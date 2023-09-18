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

const LeaveServerModal: FC = () => {
  const router = useRouter();
  const {
    isOpen,
    type,
    data: { server },
    onClose,
  } = useModal();

  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "leaveServer";

  const confirmHandler = async () => {
    try {
      setIsLoading(true);

      await webAxios.patch(`/api/server/${server?.id}/leave`);

      onClose();
      router.refresh();
      router.push("/");
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Leave Server</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave <span className="font-semibold text-indigo-500">{server?.name}</span>?
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

export default LeaveServerModal;
