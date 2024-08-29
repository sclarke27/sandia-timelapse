const { spawn } = require('child_process'); // Import spawn from child_process using require
const path = require('path'); // Import path module for handling file paths

// Function to run an FFmpeg command
const runFFmpeg = (inputPattern, outputVideo) => {
  // Define the FFmpeg command and its arguments
  const ffmpegArgs = [
    '-framerate', '10', // Input framerate (adjust based on your image sequence)
    '-pattern_type', 'glob', // Use glob pattern to match images
    '-i', inputPattern, // Input pattern to match images (e.g., "*.jpg")
    '-vf', 'minterpolate=fps=30:mi_mode=mci', // Use minterpolate filter for smoother transitions
    '-c:v', 'libx264', // Video codec
    '-pix_fmt', 'yuv420p', // Pixel format for broad compatibility
    outputVideo // Output video file
  ];

  // Spawn the FFmpeg process
  const ffmpeg = spawn('ffmpeg', ffmpegArgs);

  // Capture stdout and stderr
  ffmpeg.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ffmpeg.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Handle process exit
  ffmpeg.on('close', (code) => {
    if (code === 0) {
      console.log('FFmpeg process completed successfully.');
    } else {
      console.error(`FFmpeg process exited with code ${code}`);
    }
  });
};

// Define input and output paths
let inputPattern = path.join(__dirname, 'tram-cam/*.jpg'); // Adjust the path and pattern to your images
let outputVideo = path.join(__dirname, `videos/tram-timelapse-${Date.now()}.mp4`); // Define the output video file path

// Run the FFmpeg command
runFFmpeg(inputPattern, outputVideo);

inputPattern = path.join(__dirname, 'ski-cam/*.jpg'); // Adjust the path and pattern to your images
outputVideo = path.join(__dirname, `videos/ski-timelapse-${Date.now()}.mp4`); // Define the output video file path

// Run the FFmpeg command
runFFmpeg(inputPattern, outputVideo);
