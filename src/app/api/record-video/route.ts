import { exec } from "child_process";
import puppeteer from "puppeteer";
import path from "path";

export async function GET(req: any, res: any) {
  const reactAppUrl = "http://localhost:3000/video"; // The URL of your React app

  const browser = await puppeteer.launch({
    headless: false, // You need a visible browser for screen capture
    args: ["--window-size=1280,720"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  try {
    // Navigate to the React app where video is rendered
    await page.goto(reactAppUrl);

    // Wait for the video element to load
    await page.waitForSelector("video");

    // Speed up video and CSS animations
    await page.evaluate(() => {
      const video: any = document.querySelector("video");
      video.playbackRate = 10.0; // Set the video to 10x speed

      // Adjust CSS animation speeds if needed (Optional)
      document.querySelectorAll(".animated-element").forEach((el: any) => {
        el.style.animationDuration = "0.1s"; // Sync animations to speed
      });
    });

    // Define paths for saving the recording
    const fastRecordingPath = path.resolve("./fast_recording.mp4");
    const finalRecordingPath = path.resolve("./output_with_animations.mp4");

    // FFmpeg command to record screen with audio at 10x speed
    const ffmpegCommand = `ffmpeg -f x11grab -s 1280x720 -r 25 -i :0.0+100,100 -f pulse -i default -c:v libx264 -preset ultrafast -c:a aac ${fastRecordingPath}`;

    // Execute FFmpeg to record the screen
    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        return new Response(JSON.stringify({ error: error.message }));
      }

      // Slow down the recorded video and animations
      const slowDownCommand = `ffmpeg -i ${fastRecordingPath} -filter:v "setpts=10*PTS" -filter:a "atempo=0.1" -c:v libx264 -c:a aac ${finalRecordingPath}`;

      exec(slowDownCommand, (slowError: any, slowStdout, slowStderr) => {
        if (slowError) {
          return new Response(JSON.stringify({ error: slowError.message }));
        }

        // Respond with the final video URL
        return new Response(
          JSON.stringify({ videoUrl: "/output_with_animations.mp4" })
        );
      });
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "An error occurred during processing" })
    );
  } finally {
    await browser.close();
  }
}
