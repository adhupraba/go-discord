import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { serverAxios } from "./server-axios";
import { TApiRes } from "@/types/api";
import { TProfileWithServers } from "@/types/types";

export const initialProfile = async (): Promise<TProfileWithServers> => {
  const user = await currentUser();

  if (!user) {
    console.log("redirecting to signin page");
    return redirectToSignIn();
  }

  const { data } = await serverAxios().get<TApiRes<TProfileWithServers>>("/api/profile/upsert");

  if (data.error) {
    console.error("profile api error =>", data.data);
    return redirectToSignIn();
  }

  return data.data;
};
