import ChatHeader from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { serverAxios } from "@/lib/server-axios";
import { TApiRes } from "@/types/api";
import { TMember } from "@/types/model";
import { TMemberWithProfile } from "@/types/types";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface IConversationPageProps {
  params: { serverId: string; memberId: string };
}

const ConversationPage = async ({ params: { serverId, memberId } }: IConversationPageProps) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const { data } = await serverAxios().get<TApiRes<TMemberWithProfile>>(`/api/member/server/${serverId}`);

  if (data.error) return redirect("/");

  const currMember = data.data;
  const conversation = await getOrCreateConversation(currMember.id, memberId);

  if (!conversation) return redirect(`/servers/${serverId}`);

  const { memberOne, memberTwo } = conversation;
  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberTwo;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={otherMember.profile.name}
        serverId={serverId}
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
      />
    </div>
  );
};

export default ConversationPage;
