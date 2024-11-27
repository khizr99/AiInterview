// "use client";
// import { db } from "@/utils/db";
// import { MockInterview } from "@/utils/schema";
// import { eq } from "drizzle-orm";
// import React, { useEffect } from "react";

// function Interview({ params }) {
//   useEffect(() => {
//     console.log(params.interviewId);
//     GetInterviewDetails();
//   }, []);

//   const GetInterviewDetails = async () => {
//     const result = await db
//       .select()
//       .from(MockInterview)
//       .where(eq(MockInterview.mockId, params.interviewId));
//     console.log(result);
//   };
//   return <div>Interview</div>;
// }

// export default Interview;

"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const [interviewId, setInterviewId] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    // Resolve params using React.use()
    (async () => {
      const resolvedParams = await params;
      setInterviewId(resolvedParams.interviewId);
    })();
  }, [params]);

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    }
  }, [interviewId]);

  /**
   * Used to Get Interview Details by MockId/Interview Id
   */
  const GetInterviewDetails = async () => {
    setIsLoading(true);
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));
      setInterviewData(result[0] || null);
    } catch (error) {
      console.error("Error fetching interview details:", error);
      setInterviewData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : interviewData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col my-5 gap-5">
            <div className="flex flex-col p-5 rounded-lg border gap-5">
              <h2>
                <strong className="text-lg">Job Role/Job Position:</strong>{" "}
                {interviewData.jsonPosition}
              </h2>
              <h2>
                <strong className="text-lg">Job Description/Tech Stack:</strong>{" "}
                {interviewData.jsonDesc}
              </h2>
              <h2>
                <strong className="text-lg">Years of Experience:</strong>{" "}
                {interviewData.jsonExperience}
              </h2>
            </div>
            <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
              <h2 className="flex gap-2 items-center text-yellow-500"><Lightbulb/> <strong>Information</strong></h2>
              <h2 className="mt-3 text-yellow-500">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
            </div>
          </div>
          <div>
            {webCamEnabled ? (
              <Webcam
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                mirrored={true}
                style={{
                  height: 300,
                  width: 300,
                }}
              />
            ) : (
              <>
                <WebcamIcon className="h-72 w-full my-7 bg-secondary rounded-lg border" />
                <Button variant="ghost" className="w-full" onClick={() => setWebCamEnabled(true)}>
                  Enable WebCam and Microphone
                </Button>
              </>
            )}
          </div>    
        </div>
      ) : (
        <p>No data found for the provided interview ID.</p>
      )}
      <div className="flex justify-end items-end">
      {interviewId ? (
    <Link href={`/dashboard/interview/${interviewId}/start`}>
      <Button>Start Interview</Button>
    </Link>
  ) : (
    <p>Loading link...</p>
  )}
      </div>
    </div>
  );
}

export default Interview;

