import { currentProfile } from "@/lib/current-profile";
import { serverAxios } from "@/lib/server-axios";
import type { TApiRes } from "@/types/api";
import type { TChannelType, TMemberRole } from "@/types/model";
import type { TServerWithChannelsAndMembers } from "@/types/types";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ServerSearch from "./server-search";
import { ReactNode } from "react";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";

interface IServerSidebarProps {
  serverId: string;
}

const iconMap: { [key in TChannelType]: ReactNode } = {
  TEXT: <Hash className="mr-2 h-4 w-4" />,
  AUDIO: <Mic className="mr-2 h-4 w-4" />,
  VIDEO: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap: { [key in TMemberRole]: ReactNode } = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
};

const ServerSidebar = async ({ serverId }: IServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) return redirect("/");

  const { data } = await serverAxios().get<TApiRes<TServerWithChannelsAndMembers>>(
    `/server/${serverId}/channels-and-members`
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
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChans.map((chan) => ({ id: chan.id, name: chan.name, icon: iconMap[chan.type] })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChans.map((chan) => ({ id: chan.id, name: chan.name, icon: iconMap[chan.type] })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChans.map((chan) => ({ id: chan.id, name: chan.name, icon: iconMap[chan.type] })),
              },
              {
                label: "Members",
                type: "member",
                data: members.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChans.length && (
          <div className="mb-2">
            <ServerSection sectionType="channels" channelType="TEXT" role={user?.role} label="Text Channels" />
            <div className="space-y-[2px]">
              {textChans.map((chan) => (
                <ServerChannel key={chan.id} channel={chan} server={server} role={user?.role} />
              ))}
            </div>
          </div>
        )}
        {!!audioChans.length && (
          <div className="mb-2">
            <ServerSection sectionType="channels" channelType="AUDIO" role={user?.role} label="Voice Channels" />
            <div className="space-y-[2px]">
              {audioChans.map((chan) => (
                <ServerChannel key={chan.id} channel={chan} server={server} role={user?.role} />
              ))}
            </div>
          </div>
        )}
        {!!videoChans.length && (
          <div className="mb-2">
            <ServerSection sectionType="channels" channelType="VIDEO" role={user?.role} label="Video Channels" />
            <div className="space-y-[2px]">
              {videoChans.map((chan) => (
                <ServerChannel key={chan.id} channel={chan} server={server} role={user?.role} />
              ))}
            </div>
          </div>
        )}
        {!!members.length && (
          <div className="mb-2">
            <ServerSection sectionType="members" role={user?.role} label="Members" server={server} />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
