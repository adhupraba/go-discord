"use client";

import { FC, useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { webAxios } from "@/lib/web-axios";
import { useRouter } from "next/navigation";

const DeleteChannelModal: FC = () => {
  const router = useRouter();
  const {
    isOpen,
    type,
    data: { channel, server },
    onClose,
  } = useModal();

  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "deleteChannel";

  const confirmHandler = async () => {
    try {
      setIsLoading(true);

      await webAxios.delete(`/channel/${channel?.id}?serverId=${server?.id}`);

      onClose();
      router.refresh();
      router.push(`/servers/${server?.id}`);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Delete Channel</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            <span className="font-semibold text-indigo-500">{channel?.name}</span> will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} variant="ghost" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button disabled={isLoading} variant="primary" onClick={() => confirmHandler()}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
