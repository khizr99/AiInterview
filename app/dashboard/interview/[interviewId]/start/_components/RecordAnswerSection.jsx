// import Image from 'next/image'
// import React from 'react'
// import Webcam from 'react-webcam'

// function RecordAnswerSection() {
//   return (
//     <div className='flex flex-col my-20 justify-center items-center bg-black rounded-lg p-5'>
//         <Image src={'/webcam.png'} alt="image" width={200} height={200} className='absolute'/>
//         <Webcam
//         mirrored={true}
//         style={{
//             height:300,
//             width:'100%',
//             zIndex:10,
//         }}
//         />
//     </div>
//   )
// }

// export default RecordAnswerSection
"use client";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";

// Dynamically import Webcam to prevent SSR
const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

function RecordAnswerSection() {
  const [userAnswer,setUserAnswer]=useState('');
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(()=> {
    results.map((result) => {
      setUserAnswer(prevAns => prevAns+result?.transcript)
    })
  },[results])

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        {/* Image Component */}
        <Image
          src={"/webcam.png"}
          alt="webcam placeholder"
          width={200}
          height={200}
          className="absolute"
        />

        {/* Webcam Component */}
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button variant="outline" className="my-10"
      onClick={isRecording?stopSpeechToText:startSpeechToText}
      >
        {isRecording ? (
          <h2 className="text-red-600 flex-gap-2">
            <Mic /> Stop Recording...
          </h2>
        ) : (
          "Record Answer"
        )}
      </Button>
      <Button onClick={()=>console.log(userAnswer)}>Show User Answer</Button>
    </div>
  );
}

export default RecordAnswerSection;
