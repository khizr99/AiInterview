// "use client";
// import { db } from "@/utils/db";
// import { MockInterview } from "@/utils/schema";
// import { eq } from "drizzle-orm";
// import React, { useEffect, useState } from "react";
// import QuestionsSection from "./_components/QuestionsSection";

// function StartInterview({ params }) {
//   const [interviewData, setInterviewData] = useState();
//   const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
//   const [interviewId, setInterviewId] = useState(null);

//   // Unwrap the `params` object using React.use
//   useEffect(() => {
//     (async () => {
//       const unwrappedParams = await params;
//       setInterviewId(unwrappedParams.interviewId);
//     })();
//   }, [params]);

//   useEffect(() => {
//     if (interviewId) {
//       GetInterviewDetails();
//     }
//   }, [interviewId]);

//   /**
//    * Used to Get Interview Details by MockId/Interview Id
//    */
//   const GetInterviewDetails = async () => {
//     try {
//       const result = await db
//         .select()
//         .from(MockInterview)
//         .where(eq(MockInterview.mockId, interviewId));

//       const jsonMockResp = JSON.parse(result[0].jsonMockResp);
//       console.log(jsonMockResp);
//       setMockInterviewQuestion(jsonMockResp);
//       setInterviewData(result[0]);
//     } catch (error) {
//       console.error("Error fetching interview details:", error);
//     }
//   };

//   return (
//    <div>
//       <div className="grid grid-cols-1 md:grid-cols-2">
//         {/* Questions */}
//         <QuestionsSection mockInterviewQuestion={mockInterviewQuestion}/>
//         {/* Video / Audio Recording */}
//       </div>
//    </div>

//   );
// }

// export default StartInterview;

"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [interviewId, setInterviewId] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Extract interviewId from params
  useEffect(() => {
    (async () => {
      const unwrappedParams = await params;
      setInterviewId(unwrappedParams.interviewId);
    })();
  }, [params]);

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    }
  }, [interviewId]);

  /**
   * Fetch interview details using the interviewId
   */
  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      const jsonMockResp = JSON.parse(result[0].jsonMockResp);
      console.log("Parsed jsonMockResp:", jsonMockResp);

      // Extract and set interviewQuestions array
      setMockInterviewQuestion(jsonMockResp.interviewQuestions || []);
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Questions Section */}
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />
        {/* Placeholder for Video / Audio Recording */}

        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>

      <div className="flex justify-end gap-6">
        {activeQuestionIndex > 0 && <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)} >Previous Question</Button>}
        {activeQuestionIndex != mockInterviewQuestion?.length - 1 && (
          <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>
        )}
        {activeQuestionIndex === mockInterviewQuestion?.length - 1 && (
          <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
          <Button >End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
