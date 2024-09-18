"use client";
import React, { useRef, useState, useEffect } from "react";

const VideoRecorder: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);

  const startRecording = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 10; // Speed up the video by 10x
      videoRef.current.play();
    }

    const canvasStream = canvasRef.current?.captureStream(30); // 30 FPS
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
    if (videoRef.current) {
      videoRef.current.playbackRate = 1; // Set the playback rate back to normal
    }
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
    const canvas: any = canvasRef.current;
    const ctx = canvas?.getContext("3d");
    const video = videoRef.current;
    const overlay = overlayRef.current;

    if (ctx && video && overlay) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Draw the overlay text
      ctx.font = "30px Arial";
      ctx.fillStyle = "red";
      ctx.fillText("Overlay Text", 50, 50);

      // Animate the text
      overlay.style.transform = `translateY(${
        Math.sin(animationFrame / 10) * 20
      }px)`;
      setAnimationFrame((prev) => prev + 1);

      requestAnimationFrame(drawOverlay);
    }
  };

  useEffect(() => {
    drawOverlay();
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        src="your-video-source.mp4"
        width="640"
        height="480"
      />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ display: "none" }}
      />
      <div
        ref={overlayRef}
        style={{ position: "absolute", top: 0, left: 0, color: "white" }}
      >
        Overlay Text
      </div>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
    </div>
  );
};

export default VideoRecorder;
