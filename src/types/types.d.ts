import { Nullable } from "./helpers";
import { TChannel, TConversation, TMember, TProfile, TServer } from "./model";

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
