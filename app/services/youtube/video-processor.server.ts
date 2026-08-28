import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

ffmpeg.setFfmpegPath(ffmpegPath.path);

export interface ShortOptions {
  startTime: number;
  endTime: number;
  title: string;
  addWatermark?: boolean;
  watermarkText?: string;
  cropToVertical?: boolean;
  addNoise?: boolean;
  changeSpeed?: number;
  addOverlay?: boolean;
}

export interface VideoInfo {
  duration: number;
  width: number;
  height: number;
  fps: number;
  format: string;
}

const TEMP_DIR = path.join(process.cwd(), "temp", "youtube-shorts");

export async function ensureTempDir(): Promise<string> {
  await fs.mkdir(TEMP_DIR, { recursive: true });
  return TEMP_DIR;
}

export async function getVideoInfo(filePath: string): Promise<VideoInfo> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      const videoStream = metadata.streams.find(s => s.codec_type === "video");
      if (!videoStream) return reject(new Error("No video stream found"));
      
      resolve({
        duration: metadata.format.duration || 0,
        width: videoStream.width || 0,
        height: videoStream.height || 0,
        fps: eval(videoStream.r_frame_rate || "30/1"),
        format: metadata.format.format_name || "",
      });
    });
  });
}

export async function downloadVideo(url: string, outputPath: string): Promise<void> {
  const ytdl = await import("ytdl-core");
  return new Promise((resolve, reject) => {
    const stream = ytdl(url, { quality: "highestvideo" });
    const writeStream = fs.createWriteStream(outputPath);
    
    stream.pipe(writeStream);
    stream.on("error", reject);
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
}

export async function createShort(
  inputPath: string,
  options: ShortOptions
): Promise<string> {
  const tempDir = await ensureTempDir();
  const outputFileName = `short_${randomUUID()}.mp4`;
  const outputPath = path.join(tempDir, outputFileName);

  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath)
      .setStartTime(options.startTime)
      .setDuration(options.endTime - options.startTime)
      .outputOptions("-c:v libx264")
      .outputOptions("-preset fast")
      .outputOptions("-crf 23")
      .outputOptions("-c:a aac")
      .outputOptions("-b:a 128k")
      .outputOptions("-movflags +faststart");

    if (options.cropToVertical) {
      command = command.videoFilters([
        "crop=ih*9/16:ih:(iw-ih*9/16)/2:0",
        "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=black",
      ]);
    } else {
      command = command.videoFilters([
        "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=black",
      ]);
    }

    if (options.addNoise) {
      command = command.videoFilters([
        "noise=alls=10:allf=t+u",
      ]);
    }

    if (options.changeSpeed && options.changeSpeed !== 1.0) {
      const speed = options.changeSpeed;
      command = command
        .videoFilters([`setpts=${1/speed}*PTS`])
        .audioFilters([`atempo=${speed}`]);
    }

    if (options.addOverlay) {
      command = command.videoFilters([
        "drawbox=x=0:y=0:w=iw:h=ih:color=black@0.1:t=fill",
      ]);
    }

    if (options.addWatermark && options.watermarkText) {
      command = command.videoFilters([
        `drawtext=text='${options.watermarkText}':fontcolor=white@0.5:fontsize=24:x=w-tw-20:y=h-th-20`,
      ]);
    }

    command
      .on("end", () => resolve(outputPath))
      .on("error", (err) => reject(err))
      .save(outputPath);
  });
}

export async function extractFrames(
  inputPath: string,
  interval: number = 1,
  maxFrames: number = 10
): Promise<string[]> {
  const tempDir = await ensureTempDir();
  const frameDir = path.join(tempDir, `frames_${randomUUID()}`);
  await fs.mkdir(frameDir, { recursive: true });

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions("-vf", `fps=1/${interval}`)
      .outputOptions("-vframes", maxFrames.toString())
      .output(path.join(frameDir, "frame_%04d.jpg"))
      .on("end", async () => {
        const files = await fs.readdir(frameDir);
        resolve(files.map(f => path.join(frameDir, f)).sort());
      })
      .on("error", reject)
      .run();
  });
}

export async function applyCopyrightProtection(
  inputPath: string,
  options: {
    addNoise?: boolean;
    changeSpeed?: number;
    addOverlay?: boolean;
    cropSlightly?: boolean;
    addWatermark?: boolean;
    watermarkText?: string;
  } = {}
): Promise<string> {
  const tempDir = await ensureTempDir();
  const outputFileName = `protected_${randomUUID()}.mp4`;
  const outputPath = path.join(tempDir, outputFileName);

  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath)
      .outputOptions("-c:v libx264")
      .outputOptions("-preset fast")
      .outputOptions("-crf 23")
      .outputOptions("-c:a aac")
      .outputOptions("-b:a 128k")
      .outputOptions("-movflags +faststart");

    const filters: string[] = [];

    if (options.cropSlightly) {
      filters.push("crop=iw*0.98:ih*0.98:(iw-iw*0.98)/2:(ih-ih*0.98)/2");
      filters.push("scale=iw:ih");
    }

    if (options.addNoise) {
      filters.push("noise=alls=5:allf=t+u");
    }

    if (options.changeSpeed && options.changeSpeed !== 1.0) {
      const speed = options.changeSpeed;
      filters.push(`setpts=${1/speed}*PTS`);
      command = command.audioFilters([`atempo=${speed}`]);
    }

    if (options.addOverlay) {
      filters.push("drawbox=x=0:y=0:w=iw:h=ih:color=black@0.05:t=fill");
    }

    if (options.addWatermark && options.watermarkText) {
      filters.push(`drawtext=text='${options.watermarkText}':fontcolor=white@0.3:fontsize=20:x=w-tw-10:y=h-th-10`);
    }

    if (filters.length > 0) {
      command = command.videoFilters(filters);
    }

    command
      .on("end", () => resolve(outputPath))
      .on("error", (err) => reject(err))
      .save(outputPath);
  });
}

export async function createShortFromUrl(
  videoUrl: string,
  options: ShortOptions
): Promise<string> {
  const tempDir = await ensureTempDir();
  const inputFileName = `input_${randomUUID()}.mp4`;
  const inputPath = path.join(tempDir, inputFileName);

  await downloadVideo(videoUrl, inputPath);
  
  const protectedPath = await applyCopyrightProtection(inputPath, {
    addNoise: true,
    changeSpeed: 1.02,
    addOverlay: true,
    cropSlightly: true,
  });

  const shortPath = await createShort(protectedPath, options);

  await fs.unlink(inputPath).catch(() => {});
  await fs.unlink(protectedPath).catch(() => {});

  return shortPath;
}

export async function cleanupTempFiles(pattern: string = "*"): Promise<void> {
  try {
    const files = await fs.readdir(TEMP_DIR);
    for (const file of files) {
      if (file.match(pattern.replace("*", ".*"))) {
        await fs.unlink(path.join(TEMP_DIR, file)).catch(() => {});
      }
    }
  } catch {}
}

export async function getVideoDuration(filePath: string): Promise<number> {
  const info = await getVideoInfo(filePath);
  return info.duration;
}