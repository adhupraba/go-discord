import { currentProfile } from "@/lib/current-profile";
import { serverAxios } from "@/lib/server-axios";
import { TApiRes } from "@/types/api";
import { TServer } from "@/types/model";
import { TServerWithChannelsAndMembers } from "@/types/types";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";

interface IServerSidebarProps {
  serverId: string;
}

const ServerSidebar = async ({ serverId }: IServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) return redirect("/");

  const { data } = await serverAxios().get<TApiRes<TServerWithChannelsAndMembers>>(
    `/api/server/${serverId}/channels-and-members`
  );

  if (data.error) return redirect("/");

  const server = data.data;
  const textChans = server.channels.filter((chan) => chan.type === "TEXT");
  const videoChans = server.channels.filter((chan) => chan.type === "VIDEO");
  const audioChans = server.channels.filter((chan) => chan.type === "AUDIO");
  const members = server.members.filter((member) => member.profileId !== profile.id);
  const user = server.members.find((member) => member.profileId === profile.id);

  return (
    <div className="flex flex-col h-full text-primary w-full bg-[#f2f3f5] dark:bg-[#2b2d31]">
      <ServerHeader server={server} role={user?.role} />
    </div>
  );
};

export default ServerSidebar;
