"use client";

import { FC, Fragment, useEffect } from "react";
import ChatWelcome from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { useSocket } from "@/components/providers/socket-provider";
import type { TMember } from "@/types/model";
import type { TWsOutgoingMessage } from "@/types/types";
import ChatItem from "./chat-item";
import { format } from "date-fns/format";

const DATE_FORMAT = "d MMM yyy, HH:mm";

interface IChatMessagesProps {
  name: string;
  member: TMember;
  chatId: string;
  apiUrl: string;
  wsUrl: string;
  wsQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

const ChatMessages: FC<IChatMessagesProps> = ({
  name,
  member,
  chatId,
  apiUrl,
  wsUrl,
  wsQuery,
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
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages.map((page, idx) => (
          <Fragment key={idx}>
            {page.messages.map((message) => (
              <ChatItem
                key={message.id}
                id={message.id}
                content={message.content}
                member={message.member}
                fileUrl={message.fileUrl}
                isDeleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                currMember={member}
                wsUrl={wsUrl}
                wsQuery={wsQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;
