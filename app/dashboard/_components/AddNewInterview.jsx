"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import {v4 as uuidv4} from 'uuid';
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false)
  const [jsonResponse, setJsonResponse]=useState([]);
  const router=useRouter();
  const {user} = useUser();


  const onSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    console.log(jobDesc, jobPosition, jobExperience);

    const InputPrompt="Job position: "+jobPosition+", Job Description: "+jobDesc+", Years of Experience:"+jobExperience+", Depends on Job Position, Job Description & Years of Experience give us "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" interview question along with Answer in JSON Format, Give us question ans answer field as on JSON"


    const result=await chatSession.sendMessage(InputPrompt)
    const MockJsonResp=(result.response.text()).replace('```json','').replace('```','')
    console.log(JSON.parse(MockJsonResp))
    setJsonResponse(MockJsonResp);

    if (MockJsonResp.length > 0) {
      const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: MockJsonResp,
        jsonPosition: jobPosition,
        jsonDesc: jobDesc,
        jsonExperience: jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      }).returning({mockId:MockInterview.mockId});
      console.log("Inserted ID:", resp);
      if(resp)
        {setOpenDialog(false);
        router.push('/dashboard/interview/'+resp[0]?.mockId)
      }
    } else {
      console.log("Error: MockJsonResp is empty");
    }
    
    setLoading(false)
  };


  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interviewing
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {/* Remove <h2> from here */}
            Add details about your job position/role, job description, and years of experience.
          </DialogDescription>
          <form onSubmit={onSubmit}>
            <div className="mt-7 my-3">
              <label>Job Role/Job Position</label>
              <Input
                placeholder="Ex. Full stack Developer"
                required
                onChange={(e) => setJobPosition(e.target.value)}
              />
            </div>
            <div className="my-3">
              <label>Job Description/Tech Stack (In Short)</label>
              <Textarea
                placeholder="Ex. React, Angular, NodeJs, MySql etc"
                required
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>
            <div className="my-3">
              <label>Years of Experience</label>
              <Input
                placeholder="Ex. 5"
                type="number"
                max="50"
                required
                onChange={(e) => setJobExperience(e.target.value)}
              />
            </div>
            <div className="flex gap-5 justify-end">
              <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ?
                <>
                <LoaderCircle className="animate-spin"/>'Generating from AI'</>: 'Start Interview'}
                </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
