import { auth } from "@clerk/nextjs";
import { serverAxios } from "./server-axios";
import { TApiRes } from "@/types/api";
import { TProfileWithServers } from "@/types/types";

export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) return null;

  const { data } = await serverAxios().get<TApiRes<TProfileWithServers>>("/api/profile");

  if (data.error) return null;

  return data.data;
};
