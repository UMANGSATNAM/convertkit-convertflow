import prisma from "../../db.server";
import { uploadToR2, getPresignedDownloadUrl, PRIVATE_BUCKET } from "../r2.server";

export async function createSnapshot(
  shopId: string, 
  themeId: string, 
  kind: "SETTINGS" | "TEMPLATE" | "ASSET", 
  path: string, 
  content: string, 
  reason: string
) {
  const r2Key = `snapshots/${shopId}/${themeId}/${Date.now()}_${path.replace(/\//g, '_')}`;
  
  // Upload content to R2 private bucket
  await uploadToR2({
    bucket: PRIVATE_BUCKET,
    key: r2Key,
    body: content,
    contentType: "application/json"
  });

  const snapshot = await prisma.themeSnapshot.create({
    data: {
      shopId,
      themeId,
      kind,
      path,
      r2Key,
      reason
    }
  });

  // Prune snapshots, keeping only the 25 most recent for this theme and path
  await pruneSnapshots(shopId, themeId, path);

  return snapshot;
}

export async function fetchSnapshotContent(r2Key: string): Promise<string> {
  const url = await getPresignedDownloadUrl(r2Key, 300); // 5 minute expiry
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch snapshot from R2: ${response.statusText}`);
  }
  return await response.text();
}

/**
 * Ensures we only keep the 25 most recent snapshots per file path per theme
 */
export async function pruneSnapshots(shopId: string, themeId: string, path: string) {
  const snapshots = await prisma.themeSnapshot.findMany({
    where: { shopId, themeId, path },
    orderBy: { createdAt: 'desc' },
    select: { id: true }
  });

  if (snapshots.length > 25) {
    const toDelete = snapshots.slice(25).map(s => s.id);
    await prisma.themeSnapshot.deleteMany({
      where: {
        id: { in: toDelete }
      }
    });
    // Note: We don't delete from R2 synchronously here to save time. 
    // A housekeeping job will sweep orphaned R2 files later.
  }
}
