import { Worker, Job } from "bullmq";
import { redis } from "../redis.server";
import prisma from "../../db.server";
import { youtubeQueue } from "../queue.server";
import { getVideoDetails, uploadShort, getValidTokens } from "./api.server";
import { createShortFromUrl, applyCopyrightProtection, cleanupTempFiles } from "./video-processor.server";
import { parseDuration } from "./api.server";
import path from "path";

let processWorker: Worker | undefined;

export function initProcessWorker() {
  if (processWorker) return;

  processWorker = new Worker(
    "youtube",
    async (job: Job) => {
      const { channelId, videoId, shortId, jobType } = job.data;

      if (jobType === "CREATE_SHORT") {
        await createShortJob(channelId, videoId, job);
      } else if (jobType === "UPLOAD_SHORT") {
        await uploadShortJob(channelId, shortId, job);
      }
    },
    { connection: redis as any, concurrency: 1 }
  );

  console.log("⚙️ YouTube Process Worker initialized.");
}

async function createShortJob(channelId: string, videoId: string, job: Job) {
  const channel = await prisma.youTubeChannel.findUnique({
    where: { id: channelId },
    include: { shop: true },
  });

  if (!channel) throw new Error("Channel not found");

  const video = await prisma.youTubeVideo.findUnique({
    where: { videoId },
  });

  if (!video) throw new Error("Video not found");

  if (video.isProcessed) {
    console.log(`Video ${videoId} already processed`);
    return;
  }

  await updateJobProgress(job, 10, "Fetching video details...");
  
  const videoDetails = await getVideoDetails(videoId);
  if (!videoDetails) throw new Error("Video details not found");

  const duration = parseDuration(videoDetails.duration);
  const shortDuration = Math.min(60, duration);
  const startTime = Math.floor(duration * 0.1);
  const endTime = Math.min(startTime + shortDuration, duration);

  await updateJobProgress(job, 20, "Creating short with copyright protection...");

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const shortPath = await createShortFromUrl(videoUrl, {
    startTime,
    endTime,
    title: video.title,
    addWatermark: true,
    watermarkText: channel.channelHandle || "Shorts",
    cropToVertical: true,
    addNoise: true,
    changeSpeed: 1.02,
    addOverlay: true,
  });

  await updateJobProgress(job, 60, "Short created, saving to database...");

  const short = await prisma.youTubeShort.create({
    data: {
      channelId: channel.id,
      sourceVideoId: video.id,
      title: `${video.title} #Shorts`,
      description: `Created from: ${video.title}\n\n#Shorts #${channel.channelName}`,
      startTime,
      endTime,
      status: "READY",
      localPath: shortPath,
    },
  });

  await prisma.youTubeVideo.update({
    where: { id: video.id },
    data: { isProcessed: true, processedAt: new Date() },
  });

  await updateJobProgress(job, 80, "Queuing upload...");

  await youtubeQueue.add("upload-short", {
    channelId: channel.id,
    shortId: short.id,
    jobType: "UPLOAD_SHORT",
  });

  await updateJobProgress(job, 100, "Short created and queued for upload");
}

async function uploadShortJob(channelId: string, shortId: string, job: Job) {
  const short = await prisma.youTubeShort.findUnique({
    where: { id: shortId },
    include: { channel: true, sourceVideo: true },
  });

  if (!short) throw new Error("Short not found");
  if (!short.localPath) throw new Error("Short file not found");
  if (short.status === "UPLOADED") return;

  await updateJobProgress(job, 10, "Preparing upload...");
  await prisma.youTubeShort.update({
    where: { id: shortId },
    data: { status: "UPLOADING" },
  });

  try {
    await updateJobProgress(job, 30, "Uploading to YouTube...");

    const videoId = await uploadShort(
      short.channel.channelId,
      short.localPath,
      short.title,
      short.description || "",
      ["Shorts", short.channel.channelName, "auto-generated"]
    );

    await updateJobProgress(job, 80, "Upload complete, updating database...");

    await prisma.youTubeShort.update({
      where: { id: shortId },
      data: {
        shortVideoId: videoId,
        status: "UPLOADED",
        uploadedAt: new Date(),
      },
    });

    await updateJobProgress(job, 100, `Short uploaded successfully: https://youtube.com/shorts/${videoId}`);
  } catch (error: any) {
    await prisma.youTubeShort.update({
      where: { id: shortId },
      data: {
        status: "FAILED",
        errorMessage: error.message,
      },
    });
    throw error;
  } finally {
    if (short.localPath) {
      await cleanupTempFiles(path.basename(short.localPath));
    }
  }
}

async function updateJobProgress(job: Job, progress: number, step: string) {
  await job.updateProgress(progress);
  await prisma.processingJob.updateMany({
    where: { id: job.id },
    data: { progress, currentStep: step },
  });
}

if (process.env.NODE_ENV !== "test") {
  initProcessWorker();
}

export async function retryFailedShort(shortId: string) {
  const short = await prisma.youTubeShort.findUnique({
    where: { id: shortId },
  });

  if (!short) throw new Error("Short not found");

  await prisma.youTubeShort.update({
    where: { id: shortId },
    data: { status: "PENDING", errorMessage: null },
  });

  await youtubeQueue.add("upload-short", {
    channelId: short.channelId,
    shortId: short.id,
    jobType: "UPLOAD_SHORT",
  });
}