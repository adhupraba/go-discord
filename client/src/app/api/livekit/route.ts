import { serverEnv, webEnv } from "@/constants/config";
import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room");
  const username = req.nextUrl.searchParams.get("username");

  if (!room) {
    return NextResponse.json({ error: 'Missing "room" query parameter' }, { status: 400 });
  } else if (!username) {
    return NextResponse.json({ error: 'Missing "username" query parameter' }, { status: 400 });
  }

  if (!serverEnv.livekitApiKey || !serverEnv.livekitApiSecret || !webEnv.livekitUrl) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const at = new AccessToken(serverEnv.livekitApiKey, serverEnv.livekitApiSecret, { identity: username });

  at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

  return NextResponse.json({ token: await at.toJwt() });
}
