import { auth } from "@clerk/nextjs";
import { serverAxios } from "./server-axios";
import { TApiRes } from "@/types/api";
import { TProfile } from "@/types/model";

export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) return null;

  const { data } = await serverAxios().get<TApiRes<TProfile>>("/api/profile");

  if (data.error) return null;

  return data.data;
};
