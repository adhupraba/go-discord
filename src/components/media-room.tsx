"use client";

import { FC, useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import type { TChannel } from "@/types/model";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { webEnv } from "@/constants/config";
import axios from "axios";
import "@livekit/components-styles";

interface IMediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

const MediaRoom: FC<IMediaRoomProps> = ({ chatId, video, audio }) => {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    const getToken = async () => {
      try {
        const { data } = await axios.get(`/api/livekit?room=${chatId}&username=${name}`);
        setToken(data.token);
      } catch (err) {
        console.error("getToken error =>", err);
      }
    };

    getToken();
  }, [user?.firstName, user?.lastName, chatId]);

  if (!token) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom data-lk-theme="default" serverUrl={webEnv.livekitUrl} token={token} video={video} audio={audio}>
      <VideoConference />
    </LiveKitRoom>
  );
};

export default MediaRoom;
