import { serverAxios } from "./server-axios";
import type { TApiRes } from "@/types/api";
import type { TConversationWithMemberAndProfile } from "@/types/types";

export async function getOrCreateConversation(memberOneId: string, memberTwoId: string) {
  let conv = (await findConversation(memberOneId, memberTwoId)) || (await findConversation(memberTwoId, memberOneId));

  if (!conv) {
    conv = await createNewConversation(memberOneId, memberTwoId);
  }

  return conv;
}

async function findConversation(memberOneId: string, memberTwoId: string) {
  const { data, status } = await serverAxios().get<TApiRes<TConversationWithMemberAndProfile>>(
    `/conversation/get-by-members?memberOne=${memberOneId}&memberTwo=${memberTwoId}`
  );

  if (status === 404) return null;

  if (data.error) throw new Error(data.data.message);

  return data.data;
}

async function createNewConversation(memberOneId: string, memberTwoId: string) {
  const { data } = await serverAxios().post<TApiRes<TConversationWithMemberAndProfile>>("/conversation", {
    memberOneId,
    memberTwoId,
  });

  if (data.error) {
    console.error(`createNewConversation error => ${data.data.message}`);
    return null;
  }

  return data.data;
}
