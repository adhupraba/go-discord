import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { currentProfile } from "@/lib/current-profile";
import { serverAxios } from "@/lib/server-axios";
import { TApiRes } from "@/types/api";
import { TChannel, TMember } from "@/types/model";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface IChannelPageProps {
  params: { serverId: string; channelId: string };
}

type Data = { channel: TChannel; member: TMember };

const ChannelPage = async ({ params: { serverId, channelId } }: IChannelPageProps) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const { data } = await serverAxios().get<TApiRes<Data>>(`/api/channel/${channelId}?serverId=${serverId}`);

  if (data.error) {
    console.error("channel page api error =>", data.data);
    return redirect("/");
  }

  const { channel, member } = data.data;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader name={channel.name} serverId={serverId} type="channel" />
      <div className="flex-1">
        <ChatMessages
          member={member}
          name={channel.name}
          chatId={channel.id}
          type="channel"
          apiUrl="/api/messages"
          socketUrl="/api/socket/messages"
          socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
          paramKey="channelId"
          paramValue={channel.id}
        />
      </div>
      <ChatInput
        apiUrl="/ws/messages"
        name={channel.name}
        query={{ channelId: channel.id, serverId: channel.serverId }}
        type="channel"
      />
    </div>
  );
};

export default ChannelPage;
