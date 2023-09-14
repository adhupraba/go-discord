import { Nullable } from "./helpers";
import { TProfile, TServer } from "./model";

export type TProfileWithServer = TProfile & { server: Nullable<TServer> };
