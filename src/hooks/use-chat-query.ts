import { useSocket } from "@/components/providers/socket-provider";
import { webAxios } from "@/lib/web-axios";
import { TApiData } from "@/types/api";
import { TWsMessageContent } from "@/types/types";
import { InfiniteData, QueryFunction, QueryKey, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface IUseChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

type MessageData = { messages: TWsMessageContent[]; nextCursor: string | null };

export const useChatQuery = ({ queryKey, apiUrl, paramKey, paramValue }: IUseChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages: QueryFunction<MessageData, QueryKey, string | undefined> = async ({ pageParam = undefined }) => {
    const { data } = await webAxios.get<TApiData<MessageData>>(apiUrl, {
      params: {
        cursor: pageParam,
        [paramKey]: paramValue,
      },
    });

    return data.data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery<
    MessageData,
    Error,
    InfiniteData<MessageData>,
    QueryKey,
    string | undefined
  >({
    initialPageParam: undefined,
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000,
    retry: 3,
  });

  useEffect(() => {
    console.log("fetched messages =>", data);
  }, [data]);

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
