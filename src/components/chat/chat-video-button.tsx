"use client";

import { FC } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Video, VideoOff } from "lucide-react";
import ActionTooltip from "@/components/action-tooltip";

const ChatVideoButton: FC = () => {
  const pathname = usePathname();
  const search = useSearchParams();
  const router = useRouter();

  const isVideo = search.get("video");
  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "End video call" : "Start video call";

  const onClick = () => {
    router.push(`${pathname}${isVideo ? "" : "?video=true"}`);
  };

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};

export default ChatVideoButton;
