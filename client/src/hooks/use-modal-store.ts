import type { Nullable } from "@/types/helpers";
import type { TChannel, TChannelType, TServer } from "@/types/model";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"
  | "deleteMessage";

interface IModalData {
  server?: TServer;
  channelType?: TChannelType;
  channel?: TChannel;
  apiUrl?: string;
  query?: Record<string, any>;
}

interface IModalStore {
  type: Nullable<ModalType>;
  data: IModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: IModalData) => void;
  onClose: () => void;
}

export const useModal = create<IModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
