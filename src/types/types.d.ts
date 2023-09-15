import { Nullable } from "./helpers";
import { TChannel, TMember, TProfile, TServer } from "./model";

export type TProfileWithServer = TProfile & { server: Nullable<TServer> };

export type TServerWithChannelsAndMembers = TServer & {
  channels: TChannel[];
  members: (TMember & { profile: TProfile })[];
};
