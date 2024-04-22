import { currentUser, auth } from "@clerk/nextjs/server";
import { serverAxios } from "./server-axios";
import type { TApiRes } from "@/types/api";
import type { TProfileWithServer } from "@/types/types";

export const initialProfile = async (): Promise<TProfileWithServer> => {
  const user = await currentUser();

  if (!user) {
    return auth().redirectToSignIn();
  }

  const { data } = await serverAxios().get<TApiRes<TProfileWithServer>>("/api/profile/upsert");

  if (data.error) {
    console.error("initial profile api error =>", data.data);
    return auth().redirectToSignIn();
  }

  return data.data;
};
