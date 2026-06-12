import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID || "dev-account-id";
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "dev-access-key";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "dev-secret-key";

// S3Client configured for Cloudflare R2
export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const PUBLIC_BUCKET = process.env.R2_PUBLIC_BUCKET || "storeforge-public";
export const PRIVATE_BUCKET = process.env.R2_PRIVATE_BUCKET || "storeforge-private";
export const CDN_DOMAIN = process.env.CDN_DOMAIN || `https://pub-${accountId}.r2.dev`;

/**
 * Uploads a file to R2
 */
export async function uploadToR2({
  bucket = PUBLIC_BUCKET,
  key,
  body,
  contentType,
}: {
  bucket?: string;
  key: string;
  body: Buffer | Uint8Array | string;
  contentType: string;
}) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await r2Client.send(command);

  if (bucket === PUBLIC_BUCKET) {
    return `${CDN_DOMAIN}/${key}`;
  }
  return key; // Private keys need presigned URLs
}

/**
 * Generates a presigned URL for secure download from the private bucket
 */
export async function getPresignedDownloadUrl(key: string, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: PRIVATE_BUCKET,
    Key: key,
  });
  return await getSignedUrl(r2Client, command, { expiresIn });
}
