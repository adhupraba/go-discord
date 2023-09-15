import { Nullable } from "./helpers";
import { TProfile, TServer } from "./model";

export type TProfileWithServers = TProfile & { servers: TServer[] };
