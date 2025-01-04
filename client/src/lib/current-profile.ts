import { auth } from "@clerk/nextjs/server";
import { serverAxios } from "./server-axios";
import type { TApiRes } from "@/types/api";
import type { TProfile } from "@/types/model";

export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) return null;

  const { data } = await serverAxios().get<TApiRes<TProfile>>("/profile");

  if (data.error) return null;

  return data.data;
};
