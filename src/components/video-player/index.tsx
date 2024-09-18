"use client";
import React, { useEffect, useRef } from "react";

const VideoPlayer = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video: any = videoRef.current;
    if (video) {
      // Set playback rate to 1x by default, adjust as needed
      video.playbackRate = 10;
    }
  }, []);

  return (
    <div className="video-container">
      {/* Video element */}
      <video ref={videoRef} width="720" height="400" muted autoPlay>
        <source src="/vid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Animated elements overlaying the video */}
      <div className="animated-overlay">
        <div className="animated-element">Animating Text</div>
        <div className="animated-element another">Another Animation</div>
      </div>
    </div>
  );
};

export default VideoPlayer;
