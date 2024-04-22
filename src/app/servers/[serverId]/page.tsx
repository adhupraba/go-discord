import { currentProfile } from "@/lib/current-profile";
import { serverAxios } from "@/lib/server-axios";
import type { TApiRes } from "@/types/api";
import type { TChannel } from "@/types/model";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface IServerPageProps {
  params: { serverId: string };
}

const ServerPage = async ({ params: { serverId } }: IServerPageProps) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  const { data } = await serverAxios().get<TApiRes<TChannel>>(`/api/server/${serverId}/general-channel`);

  if (data.error || data.data?.name !== "general") {
    console.error("server page data error", data.data);
    return null;
  }

  return redirect(`/servers/${serverId}/channels/${data.data.id}`);
};

export default ServerPage;
