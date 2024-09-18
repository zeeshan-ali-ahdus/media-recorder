"use client";
import MediaRecorderComp from "@/components/mediaRecorder";
// import VideoRecorder from "@/components/canvas";
import VideoPlayer from "@/components/video-player";
import React from "react";

const VideoPage = () => {
  return (
    <div>
      {/* <VideoRecorder /> */}

      {/* Using html2canvas animations are rendering perfect but not being recorded */}
      <VideoPlayer />

      {/* Using Canvas api and media recorder animations  are not rendering  but  being recorded */}
      {/* <MediaRecorderComp /> */}
    </div>
  );
};

export default VideoPage;
