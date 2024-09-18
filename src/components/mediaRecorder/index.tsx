"use client";
import React, { useRef, useState, useEffect } from "react";

const MediaRecorderComp: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 10; // Speed up the video by 10x
      videoRef.current.play();
    }

    const canvasStream = canvasRef.current?.captureStream(60); // 30 FPS
    const recorder = new MediaRecorder(canvasStream as MediaStream);
    setMediaRecorder(recorder);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  useEffect(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "recorded_video.mp4";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }, [recordedChunks]);

  const drawOverlay = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const video = videoRef.current;

    if (canvas && context && video) {
      context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      context.font = "30px Arial";
      context.fillStyle = "red";
      context.fillText("Overlay Text", 50, 50);
    }
  };

  useEffect(() => {
    const interval = setInterval(drawOverlay, 33); // Draw overlay every 33ms (~30 FPS)
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleVideoEnd = () => {
      stopRecording();
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("ended", handleVideoEnd);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("ended", handleVideoEnd);
      }
    };
  }, [videoRef.current]);

  return (
    <div>
      <canvas ref={canvasRef} width={640} height={480} />
      <video ref={videoRef} autoPlay muted style={{ display: "none" }}>
        <source src="/vid.mp4" type="video/mp4" />
      </video>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}
      </style>
      {!isRecording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
    </div>
  );
};

export default MediaRecorderComp;
