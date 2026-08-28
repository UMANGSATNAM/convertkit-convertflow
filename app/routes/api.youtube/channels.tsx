import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";
import { getAuthUrl, getChannelVideos, triggerFetchVideos, scheduleChannelMonitoring, stopChannelMonitoring } from "~/services/youtube/api.server";
import { monitorChannel } from "~/services/youtube/monitor-worker.server";

export async function loader({ request }: { request: Request }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const channelId = url.searchParams.get("channelId");
  const action = url.searchParams.get("action");

  if (!shop) {
    return json({ error: "Shop parameter required" }, { status: 400 });
  }

  try {
    if (action === "auth-url") {
      const authUrl = getAuthUrl(shop);
      return json({ authUrl });
    }

    if (action === "list") {
      const channels = await prisma.youTubeChannel.findMany({
        where: { shop: { shopDomain: shop } },
        include: {
          _count: {
            select: { videos: true, shorts: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return json({ channels });
    }

    if (channelId && action === "videos") {
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "20");
      
      const [videos, total] = await Promise.all([
        prisma.youTubeVideo.findMany({
          where: { channelId },
          include: { shorts: true },
          orderBy: { publishedAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.youTubeVideo.count({ where: { channelId } }),
      ]);
      
      return json({ videos, total, page, totalPages: Math.ceil(total / limit) });
    }

    if (channelId && action === "shorts") {
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "20");
      const status = url.searchParams.get("status");
      
      const [shorts, total] = await Promise.all([
        prisma.youTubeShort.findMany({
          where: { channelId, ...(status ? { status: status as any } : {}) },
          include: { sourceVideo: true },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.youTubeShort.count({ where: { channelId, ...(status ? { status: status as any } : {}) } }),
      ]);
      
      return json({ shorts, total, page, totalPages: Math.ceil(total / limit) });
    }

    if (channelId && action === "jobs") {
      const jobs = await prisma.processingJob.findMany({
        where: { channelId },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
      return json({ jobs });
    }

    return json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("YouTube API error:", error);
    return json({ error: error.message }, { status: 500 });
  }
}

export async function action({ request }: { request: Request }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  
  const formData = await request.formData();
  const channelId = formData.get("channelId") as string;
  const action = formData.get("action") as string;

  if (!shop) {
    return json({ error: "Shop parameter required" }, { status: 400 });
  }

  try {
    if (action === "connect") {
      const authUrl = getAuthUrl(shop);
      return json({ authUrl });
    }

    if (action === "fetch-videos" && channelId) {
      await triggerFetchVideos(channelId);
      return json({ success: true, message: "Fetch videos job queued" });
    }

    if (action === "start-monitoring" && channelId) {
      const interval = parseInt(formData.get("interval") as string || "30");
      await scheduleChannelMonitoring(channelId, interval);
      return json({ success: true, message: "Monitoring started" });
    }

    if (action === "stop-monitoring" && channelId) {
      await stopChannelMonitoring(channelId);
      return json({ success: true, message: "Monitoring stopped" });
    }

    if (action === "delete-channel" && channelId) {
      await stopChannelMonitoring(channelId);
      await prisma.youTubeChannel.delete({ where: { id: channelId } });
      return json({ success: true, message: "Channel deleted" });
    }

    if (action === "create-short" && channelId) {
      const videoId = formData.get("videoId") as string;
      const startTime = parseInt(formData.get("startTime") as string || "0");
      const endTime = parseInt(formData.get("endTime") as string || "60");

      const video = await prisma.youTubeVideo.findUnique({ where: { videoId } });
      if (!video) return json({ error: "Video not found" }, { status: 404 });

      const { youtubeQueue } = await import("~/services/queue.server");
      await youtubeQueue.add("process-video", {
        channelId,
        videoId: video.id,
        jobType: "CREATE_SHORT",
      });

      return json({ success: true, message: "Short creation queued" });
    }

    return json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("YouTube API error:", error);
    return json({ error: error.message }, { status: 500 });
  }
}