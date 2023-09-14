import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { serverAxios } from "./axios";
import { TApiRes } from "@/types/api";
import { TProfileWithServer } from "@/types/types";

export const initialProfile = async (): Promise<TProfileWithServer> => {
  const user = await currentUser();

  if (!user) {
    console.log("redirecting to signin page");
    return redirectToSignIn();
  }

  const { data } = await serverAxios().get<TApiRes<TProfileWithServer>>("/api/profile");

  if (data.error) {
    console.error("profile api error =>", data.data);
    return redirectToSignIn();
  }

  return data.data;
};
