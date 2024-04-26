import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { serverAxios } from "@/lib/server-axios";
import type { TApiRes } from "@/types/api";
import type { TMemberWithProfile } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface IConversationPageProps {
  params: { serverId: string; memberId: string };
}

const ConversationPage = async ({ params: { serverId, memberId } }: IConversationPageProps) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  const { data } = await serverAxios().get<TApiRes<TMemberWithProfile>>(`/api/member/server/${serverId}`);

  if (data.error) return redirect("/");

  const currMember = data.data;
  const conversation = await getOrCreateConversation(currMember.id, memberId);

  if (!conversation) return redirect(`/servers/${serverId}`);

  const { memberOne, memberTwo } = conversation;
  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={otherMember.profile.name}
        serverId={serverId}
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
      />
      <ChatMessages
        member={currMember}
        name={otherMember.profile.name}
        chatId={conversation.id}
        type="conversation"
        apiUrl="/api/direct-message"
        wsUrl="/ws/direct-message"
        wsQuery={{ conversationId: conversation.id }}
        paramKey="conversationId"
        paramValue={conversation.id}
      />
      <ChatInput
        apiUrl="/ws/direct-message/send"
        name={otherMember.profile.name}
        query={{ conversationId: conversation.id }}
        type="channel"
      />
    </div>
  );
};

export default ConversationPage;
