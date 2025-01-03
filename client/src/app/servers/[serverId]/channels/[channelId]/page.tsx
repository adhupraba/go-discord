import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import MediaRoom from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { serverAxios } from "@/lib/server-axios";
import type { TApiRes } from "@/types/api";
import type { TChannel, TMember } from "@/types/model";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface IChannelPageProps {
  params: { serverId: string; channelId: string };
}

type Data = { channel: TChannel; member: TMember };

const ChannelPage = async ({ params: { serverId, channelId } }: IChannelPageProps) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  const { data } = await serverAxios().get<TApiRes<Data>>(`/channel/${channelId}?serverId=${serverId}`);

  if (data.error) {
    console.error("channel page api error =>", data.data);
    return redirect("/");
  }

  const { channel, member } = data.data;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader name={channel.name} serverId={serverId} type="channel" />
      {channel.type === "TEXT" && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/message"
            wsUrl="/ws/message"
            wsQuery={{ channelId: channel.id, serverId: channel.serverId }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            apiUrl="/ws/message/send"
            name={channel.name}
            query={{ channelId: channel.id, serverId: channel.serverId }}
            type="channel"
          />
        </>
      )}
      {channel.type === "AUDIO" && <MediaRoom chatId={channel.id} video={false} audio={true} />}
      {channel.type === "VIDEO" && <MediaRoom chatId={channel.id} video={true} audio={true} />}
    </div>
  );
};

export default ChannelPage;
