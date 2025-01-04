import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import type { MessageData } from "./use-chat-query";
import { useSub } from "./use-pub-sub";

interface IChatSocketProps {
  roomId: string;
  queryKey: string;
}

type InfiniteMessages = InfiniteData<MessageData, unknown>;

export const useChatSocket = ({ roomId, queryKey }: IChatSocketProps) => {
  const queryClient = useQueryClient();

  useSub("MESSAGE_MODIFIED", (message) => {
    if (message?.roomId !== roomId) return;

    queryClient.setQueryData([queryKey], (oldData: InfiniteMessages): InfiniteMessages => {
      console.log("MESSAGE_MODIFIED old data =>", oldData);

      if (!oldData || !oldData.pages || !oldData.pages.length) {
        return oldData;
      }

      const newData = oldData.pages.map((page) => ({
        ...page,
        messages: page.messages.map((item) => {
          if (item.id === message?.id) {
            return message;
          }

          return item;
        }),
      }));

      return {
        ...oldData,
        pages: newData,
      };
    });
  });

  useSub("BROADCAST", (message) => {
    queryClient.setQueryData([queryKey], (oldData: InfiniteMessages): InfiniteMessages => {
      if (!oldData || !oldData.pages || !oldData.pages.length) {
        return { pages: [{ messages: [message!], nextCursor: null }], pageParams: [] };
      }

      const newData = [...oldData.pages];

      newData[0] = {
        ...newData[0],
        messages: [message!, ...newData[0].messages],
      };

      return {
        ...oldData,
        pages: newData,
      };
    });
  });
};
