import { GenericObject, Nullable } from "./helpers";

export type TChannelType = "TEXT" | "VIDEO" | "AUDIO";

export type TMemberRole = "ADMIN" | "MODERATOR" | "GUEST";

export type TChannel = {
  id: string;
  name: string;
  type: TChannelType;
  profileId: string;
  serverId: string;
  createdAt: string;
  updatedAt: string;
};

export type TMember = {
  id: string;
  role: TMemberRole;
  profileId: string;
  serverId: string;
  createdAt: string;
  updatedAt: string;
};

export type TProfile = {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type TServer = {
  id: string;
  name: string;
  imageUrl: string;
  inviteCode: string;
  profileId: string;
  createdAt: string;
  updatedAt: string;
};

export type TMessage = {
  id: string;
  content: string;
  fileUrl?: Nullable<string>;
  memberId: string;
  channelId: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TConversation = {
  id: string;
  memberOneId: string;
  memberTwoId: string;
  createdAt: string;
  updatedAt: string;
};

export type TDirectMessage = {
  id: string;
  content: string;
  fileUrl?: Nullable<string>;
  memberId: string;
  conversationId: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
};
