import { Nullable } from "./helpers";
import { TChannel, TConversation, TMember, TMessage, TProfile, TServer } from "./model";

export type TProfileWithServer = TProfile & { server: Nullable<TServer> };

export type TMemberWithProfile = TMember & { profile: TProfile };

export type TServerWithChannelsAndMembers = TServer & {
  channels: TChannel[];
  members: TMemberWithProfile[];
};

export type TServerWithMembers = TServer & {
  members: TMemberWithProfile[];
};

export type TConversationWithMemberAndProfile = TConversation & {
  memberOne: TMemberWithProfile;
  memberTwo: TMemberWithProfile;
};

export type TWsMessageEvent = "AUTHENTICATE" | "JOIN_ROOM" | "BROADCAST" | "NEW_MESSAGE";

type TWsMessageContent = (Omit<TMessage, "channelId"> & { roomId: string; member: TMemberWithProfile })[];

export type TWsIncomingMessage = {
  event: TWsMessageEvent;
  message: TWsMessageContent;
};

export type TWsOutgoingMessageBody = {
  content: string;
  fileUrl?: string | null;
};

type WsMessageAuthenticate = {
  event: "AUTHENTICATE";
  authToken: string | null;
};

type WsMessageJoinRoom = {
  event: "JOIN_ROOM";
  memberId: string;
  roomId: string;
  roomType: "CHANNEL" | "CONVERSATION";
};

type WsMessageBroadcast = {
  event: "NEW_MESSAGE";
  message: TWsOutgoingMessageBody;
};

export type TWsOutgoingMessage = WsMessageAuthenticate | WsMessageJoinRoom | WsMessageBroadcast;
