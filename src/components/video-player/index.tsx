"use client";
import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

const VideoPlayer = () => {
  const videoRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const containerRef = useRef<any>(null);
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);
  const [recordedChunks, setRecordedChunks] = useState<any>([]);

  useEffect(() => {
    const video: any = videoRef.current;
    if (video) {
      video.playbackRate = 1; // Adjust playback rate as needed
    }
  }, []);

  const captureCanvas = async () => {
    const container = containerRef.current;
    const canvas = await html2canvas(container);
    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
  };

  const startRecording = async () => {
    await captureCanvas();
    const stream = canvasRef.current.captureStream();
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev: any) => [...prev, event.data]);
      }
    };

    recorder.start();
    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "recording.webm";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div ref={containerRef}>
      <video ref={videoRef} width="720" height="400" muted autoPlay>
        <source src="/vid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="animated-overlay">
        <div className="animated-element">Animating Text</div>
        <div className="animated-element another">Another Animation</div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      <div className="controls">
        <button onClick={startRecording}>Start Recording</button>
        <button onClick={stopRecording}>Stop Recording</button>
        <button onClick={downloadRecording}>Download Recording</button>
      </div>
    </div>
  );
};

export default VideoPlayer;
