import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";
import { retryFailedShort } from "~/services/youtube/process-worker.server";
import { youtubeQueue } from "~/services/queue.server";

export async function loader({ request }: { request: Request }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  
  const url = new URL(request.url);
  const shortId = url.searchParams.get("shortId");

  if (!shop) {
    return json({ error: "Shop parameter required" }, { status: 400 });
  }

  try {
    if (shortId) {
      const short = await prisma.youTubeShort.findUnique({
        where: { id: shortId },
        include: { channel: true, sourceVideo: true },
      });
      
      if (!short) return json({ error: "Short not found" }, { status: 404 });
      
      return json({ short });
    }

    return json({ error: "Short ID required" }, { status: 400 });
  } catch (error: any) {
    console.error("YouTube Shorts API error:", error);
    return json({ error: error.message }, { status: 500 });
  }
}

export async function action({ request }: { request: Request }) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const shortId = formData.get("shortId") as string;
  const action = formData.get("action") as string;

  try {
    if (action === "retry-upload" && shortId) {
      await retryFailedShort(shortId);
      return json({ success: true, message: "Upload retry queued" });
    }

    if (action === "delete" && shortId) {
      const short = await prisma.youTubeShort.findUnique({ where: { id: shortId } });
      if (!short) return json({ error: "Short not found" }, { status: 404 });

      if (short.localPath) {
        const fs = await import("fs");
        fs.unlink(short.localPath).catch(() => {});
      }

      await prisma.youTubeShort.delete({ where: { id: shortId } });
      return json({ success: true, message: "Short deleted" });
    }

    if (action === "reprocess" && shortId) {
      const short = await prisma.youTubeShort.findUnique({ where: { id: shortId } });
      if (!short) return json({ error: "Short not found" }, { status: 404 });

      await prisma.youTubeShort.update({
        where: { id: shortId },
        data: { status: "PENDING", errorMessage: null },
      });

      await youtubeQueue.add("process-video", {
        channelId: short.channelId,
        shortId: short.id,
        jobType: "UPLOAD_SHORT",
      });

      return json({ success: true, message: "Reprocessing queued" });
    }

    return json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("YouTube Shorts API error:", error);
    return json({ error: error.message }, { status: 500 });
  }
}