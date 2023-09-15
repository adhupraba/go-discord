"use client";

import { Plus } from "lucide-react";
import { FC } from "react";
import ActionTooltip from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

type INavigationActionProps = {};

const NavigationAction: FC<INavigationActionProps> = () => {
  const { onOpen } = useModal();

  return (
    <div>
      <ActionTooltip label="Add a server" side="right" align="center">
        <button onClick={() => onOpen("createServer")} className="group flex items-center">
          <div className="flex items-center justify-center mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus className="transition text-emerald-500 group-hover:text-white" size={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;
