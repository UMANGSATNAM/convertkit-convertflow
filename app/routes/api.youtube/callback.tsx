import { json, redirect } from "@remix-run/node";
import { getTokensFromCode } from "~/services/youtube/api.server";
import prisma from "~/db.server";
import { encrypt } from "~/services/crypto.server";
import { getChannelInfo } from "~/services/youtube/api.server";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return redirect(`/app/youtube?error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return redirect(`/app/youtube?error=${encodeURIComponent("Missing code or state")}`);
  }

  try {
    const shopDomain = state;
    const shop = await prisma.shop.findUnique({ where: { shopDomain } });
    
    if (!shop) {
      return redirect(`/app/youtube?error=${encodeURIComponent("Shop not found")}`);
    }

    const tokens = await getTokensFromCode(code);
    const channelInfo = await getChannelInfo(tokens.accessToken);

    const existingChannel = await prisma.youTubeChannel.findUnique({
      where: { channelId: channelInfo.id },
    });

    if (existingChannel) {
      await prisma.youTubeChannel.update({
        where: { channelId: channelInfo.id },
        data: {
          accessToken: encrypt(tokens.accessToken),
          refreshToken: encrypt(tokens.refreshToken),
          tokenExpiry: new Date(tokens.expiryDate),
          channelName: channelInfo.title,
          channelHandle: channelInfo.handle,
          shopId: shop.id,
        },
      });
    } else {
      await prisma.youTubeChannel.create({
        data: {
          shopId: shop.id,
          channelId: channelInfo.id,
          channelName: channelInfo.title,
          channelHandle: channelInfo.handle,
          accessToken: encrypt(tokens.accessToken),
          refreshToken: encrypt(tokens.refreshToken),
          tokenExpiry: new Date(tokens.expiryDate),
        },
      });
    }

    return redirect(`/app/youtube?success=${encodeURIComponent(`Connected to ${channelInfo.title}`)}`);
  } catch (error: any) {
    console.error("YouTube OAuth error:", error);
    return redirect(`/app/youtube?error=${encodeURIComponent(error.message)}`);
  }
}