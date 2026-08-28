import { google, youtube_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import prisma from "../../db.server";
import { encryptToken as encrypt, decryptToken as decrypt } from "../crypto.server";

const YOUTUBE_SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/youtube.force-ssl",
];

export interface YouTubeTokens {
  accessToken: string;
  refreshToken: string;
  expiryDate: number;
}

export interface ChannelInfo {
  id: string;
  title: string;
  handle?: string;
  thumbnails?: youtube_v3.Schema$ThumbnailDetails;
}

export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  duration: string;
  publishedAt: string;
  thumbnails: youtube_v3.Schema$ThumbnailDetails;
  channelId: string;
  channelTitle: string;
}

export function getOAuth2Client(): OAuth2Client {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI || `${process.env.APP_URL}/api/youtube/callback`;

  if (!clientId || !clientSecret) {
    throw new Error("YouTube OAuth credentials not configured");
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getAuthUrl(state?: string): string {
  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: YOUTUBE_SCOPES,
    prompt: "consent",
    state,
  });
}

export async function getTokensFromCode(code: string): Promise<YouTubeTokens> {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return {
    accessToken: tokens.access_token!,
    refreshToken: tokens.refresh_token!,
    expiryDate: tokens.expiry_date!,
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<YouTubeTokens> {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await oauth2Client.refreshAccessToken();
  return {
    accessToken: credentials.access_token!,
    refreshToken: credentials.refresh_token || refreshToken,
    expiryDate: credentials.expiry_date!,
  };
}

export async function getValidTokens(channelId: string): Promise<YouTubeTokens> {
  const channel = await prisma.youTubeChannel.findUnique({
    where: { channelId },
  });

  if (!channel) {
    throw new Error("Channel not found");
  }

  const accessToken = decrypt(channel.accessToken);
  const refreshToken = decrypt(channel.refreshToken);

  if (new Date(channel.tokenExpiry) > new Date()) {
    return {
      accessToken,
      refreshToken,
      expiryDate: channel.tokenExpiry.getTime(),
    };
  }

  const newTokens = await refreshAccessToken(refreshToken);
  
  await prisma.youTubeChannel.update({
    where: { channelId },
    data: {
      accessToken: encrypt(newTokens.accessToken),
      refreshToken: encrypt(newTokens.refreshToken),
      tokenExpiry: new Date(newTokens.expiryDate),
    },
  });

  return newTokens;
}

export async function getYouTubeClient(channelId: string) {
  const tokens = await getValidTokens(channelId);
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
  });
  return google.youtube({ version: "v3", auth: oauth2Client });
}

export async function getChannelInfo(channelId: string): Promise<ChannelInfo> {
  const youtube = await getYouTubeClient(channelId);
  const response = await youtube.channels.list({
    part: ["snippet", "contentDetails", "statistics"],
    id: [channelId],
  });

  const channel = response.data.items?.[0];
  if (!channel) throw new Error("Channel not found");

  return {
    id: channel.id!,
    title: channel.snippet?.title!,
    handle: channel.snippet?.customUrl,
    thumbnails: channel.snippet?.thumbnails,
  };
}

export async function getChannelVideos(channelId: string, maxResults = 50, pageToken?: string): Promise<{ videos: VideoInfo[]; nextPageToken?: string }> {
  const youtube = await getYouTubeClient(channelId);
  
  const response = await youtube.search.list({
    part: ["snippet"],
    channelId,
    maxResults,
    order: "date",
    type: ["video"],
    pageToken,
  });

  const videoIds = response.data.items?.map(item => item.id?.videoId).filter(Boolean) || [];
  
  if (videoIds.length === 0) {
    return { videos: [], nextPageToken: response.data.nextPageToken };
  }

  const videoDetails = await youtube.videos.list({
    part: ["snippet", "contentDetails", "statistics"],
    id: videoIds,
  });

  const videos: VideoInfo[] = videoDetails.data.items?.map(video => ({
    id: video.id!,
    title: video.snippet?.title!,
    description: video.snippet?.description || "",
    duration: video.contentDetails?.duration!,
    publishedAt: video.snippet?.publishedAt!,
    thumbnails: video.snippet?.thumbnails!,
    channelId: video.snippet?.channelId!,
    channelTitle: video.snippet?.channelTitle!,
  })) || [];

  return { videos, nextPageToken: response.data.nextPageToken };
}

export async function getVideoDetails(videoId: string): Promise<VideoInfo | null> {
  const youtube = await getYouTubeClient(videoId);
  const response = await youtube.videos.list({
    part: ["snippet", "contentDetails", "statistics"],
    id: [videoId],
  });

  const video = response.data.items?.[0];
  if (!video) return null;

  return {
    id: video.id!,
    title: video.snippet?.title!,
    description: video.snippet?.description || "",
    duration: video.contentDetails?.duration!,
    publishedAt: video.snippet?.publishedAt!,
    thumbnails: video.snippet?.thumbnails!,
    channelId: video.snippet?.channelId!,
    channelTitle: video.snippet?.channelTitle!,
  };
}

export async function uploadShort(
  channelId: string,
  filePath: string,
  title: string,
  description: string,
  tags: string[] = []
): Promise<string> {
  const youtube = await getYouTubeClient(channelId);
  
  const response = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title: title.slice(0, 100),
        description: description.slice(0, 5000),
        tags: tags.slice(0, 500),
        categoryId: "22",
      },
      status: {
        privacyStatus: "public",
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: await import("fs").then(fs => fs.createReadStream(filePath)),
    },
  });

  return response.data.id!;
}

export async function deleteVideo(channelId: string, videoId: string): Promise<void> {
  const youtube = await getYouTubeClient(channelId);
  await youtube.videos.delete({ id: videoId });
}

export function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}