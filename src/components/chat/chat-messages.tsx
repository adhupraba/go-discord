"use client";

import { TMember } from "@/types/model";
import { FC, useEffect } from "react";
import ChatWelcome from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { useSocket } from "../providers/socket-provider";
import { TWsOutgoingMessage } from "@/types/types";

interface IChatMessagesProps {
  name: string;
  member: TMember;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

const ChatMessages: FC<IChatMessagesProps> = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}) => {
  const { socket, isConnected } = useSocket();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
    queryKey: `chat:${chatId}`,
    apiUrl,
    paramKey,
    paramValue,
  });

  useEffect(() => {
    if (!isConnected) return;

    socket?.send(
      JSON.stringify({
        event: "JOIN_ROOM",
        memberId: member.id,
        roomId: paramValue,
        roomType: paramKey === "channelId" ? "CHANNEL" : "CONVERSATION",
      } satisfies TWsOutgoingMessage)
    );
  }, [isConnected]);

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading messages...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Something went wrong!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
    </div>
  );
};

export default ChatMessages;
