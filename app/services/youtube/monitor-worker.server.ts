import { Worker, Job } from "bullmq";
import { redis } from "../redis.server";
import prisma from "../../db.server";
import { youtubeQueue } from "../queue.server";
import { getChannelVideos } from "./api.server";
import { parseDuration } from "./api.server";

let monitorWorker: Worker | undefined;

export function initMonitorWorker() {
  if (monitorWorker) return;

  monitorWorker = new Worker(
    "youtube",
    async (job: Job) => {
      const { channelId, jobType } = job.data;

      if (jobType === "MONITOR_CHANNEL") {
        await monitorChannel(channelId, job);
      } else if (jobType === "FETCH_VIDEOS") {
        await fetchAndStoreVideos(channelId, job);
      }
    },
    { connection: redis as any, concurrency: 2 }
  );

  console.log("🔴 YouTube Monitor Worker initialized.");
}

async function monitorChannel(channelId: string, job: Job) {
  const channel = await prisma.youTubeChannel.findUnique({
    where: { channelId },
    include: { shop: true },
  });

  if (!channel || !channel.isMonitoring) {
    console.log(`Channel ${channelId} not found or monitoring disabled`);
    return;
  }

  await updateJobProgress(job, 10, "Fetching latest videos...");

  const { videos } = await getChannelVideos(channelId, 10);
  
  await updateJobProgress(job, 30, "Checking for new videos...");

  let newVideosCount = 0;
  for (const video of videos) {
    const existingVideo = await prisma.youTubeVideo.findUnique({
      where: { videoId: video.id },
    });

    if (!existingVideo) {
      const durationSeconds = parseDuration(video.duration);
      
      if (durationSeconds > 60) {
        await prisma.youTubeVideo.create({
          data: {
            channelId: channel.id,
            videoId: video.id,
            title: video.title,
            description: video.description,
            duration: durationSeconds,
            publishedAt: new Date(video.publishedAt),
            thumbnailUrl: video.thumbnails?.high?.url || video.thumbnails?.medium?.url || video.thumbnails?.default?.url,
          },
        });
        newVideosCount++;
        
        await youtubeQueue.add("process-video", {
          channelId: channel.id,
          videoId: video.id,
          jobType: "CREATE_SHORT",
        });
      }
    }
  }

  await prisma.youTubeChannel.update({
    where: { channelId },
    data: {
      lastCheckedAt: new Date(),
      lastVideoId: videos[0]?.id || channel.lastVideoId,
    },
  });

  await updateJobProgress(job, 100, `Monitoring complete. Found ${newVideosCount} new videos.`);
}

async function fetchAndStoreVideos(channelId: string, job: Job) {
  const channel = await prisma.youTubeChannel.findUnique({
    where: { channelId },
    include: { shop: true },
  });

  if (!channel) {
    throw new Error("Channel not found");
  }

  await updateJobProgress(job, 10, "Fetching videos...");

  let pageToken: string | undefined;
  let totalFetched = 0;
  let totalNew = 0;

  do {
    const { videos, nextPageToken } = await getChannelVideos(channelId, 50, pageToken);
    pageToken = nextPageToken;

    for (const video of videos) {
      const existingVideo = await prisma.youTubeVideo.findUnique({
        where: { videoId: video.id },
      });

      if (!existingVideo) {
        const durationSeconds = parseDuration(video.duration);
        
        if (durationSeconds > 60) {
          await prisma.youTubeVideo.create({
            data: {
              channelId: channel.id,
              videoId: video.id,
              title: video.title,
              description: video.description,
              duration: durationSeconds,
              publishedAt: new Date(video.publishedAt),
              thumbnailUrl: video.thumbnails?.high?.url || video.thumbnails?.medium?.url || video.thumbnails?.default?.url,
            },
          });
          totalNew++;
          
          await youtubeQueue.add("process-video", {
            channelId: channel.id,
            videoId: video.id,
            jobType: "CREATE_SHORT",
          });
        }
      }
      totalFetched++;
    }

    await updateJobProgress(job, Math.min(90, 10 + (totalFetched / 50) * 80), `Fetched ${totalFetched} videos, ${totalNew} new`);
  } while (pageToken && totalFetched < 200);

  await prisma.youTubeChannel.update({
    where: { channelId },
    data: { lastCheckedAt: new Date() },
  });

  await updateJobProgress(job, 100, `Fetch complete. ${totalFetched} videos checked, ${totalNew} new videos found.`);
}

async function updateJobProgress(job: Job, progress: number, step: string) {
  await job.updateProgress(progress);
  await prisma.processingJob.updateMany({
    where: { id: job.id },
    data: { progress, currentStep: step },
  });
}

if (process.env.NODE_ENV !== "test") {
  initMonitorWorker();
}

export async function scheduleChannelMonitoring(channelId: string, intervalMinutes = 30) {
  const channel = await prisma.youTubeChannel.findUnique({
    where: { channelId },
  });

  if (!channel) throw new Error("Channel not found");

  await youtubeQueue.add("monitor-channel", {
    channelId: channel.id,
    jobType: "MONITOR_CHANNEL",
  }, {
    repeat: { every: intervalMinutes * 60 * 1000 },
    jobId: `monitor-${channel.id}`,
  });

  await prisma.youTubeChannel.update({
    where: { channelId },
    data: { isMonitoring: true },
  });
}

export async function stopChannelMonitoring(channelId: string) {
  const channel = await prisma.youTubeChannel.findUnique({
    where: { channelId },
  });

  if (!channel) throw new Error("Channel not found");

  await youtubeQueue.remove(`monitor-${channel.id}`);
  await prisma.youTubeChannel.update({
    where: { channelId },
    data: { isMonitoring: false },
  });
}

export async function triggerFetchVideos(channelId: string) {
  const channel = await prisma.youTubeChannel.findUnique({
    where: { channelId },
  });

  if (!channel) throw new Error("Channel not found");

  await youtubeQueue.add("fetch-videos", {
    channelId: channel.id,
    jobType: "FETCH_VIDEOS",
  });
}