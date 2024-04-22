"use client";

import { cn } from "@/lib/utils";
import type { TMemberRole, TServer } from "@/types/model";
import type { TMemberWithProfile } from "@/types/types";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC, ReactNode } from "react";
import UserAvatar from "@/components/user-avatar";
import ActionTooltip from "../action-tooltip";

interface IServerMemberProps {
  member: TMemberWithProfile;
  server: TServer;
}

const roleIconMap: { [key in TMemberRole]: ReactNode } = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
};

const ServerMember: FC<IServerMemberProps> = ({ member, server }) => {
  const params = useParams() as { serverId: string; memberId: string };
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const onClick = () => {
    router.push(`/servers/${server.id}/conversations/${member.id}`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group p-2 rounded-md flex items-center justify-between w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <ActionTooltip label={member.profile.name}>
        <div className="flex items-center gap-x-2">
          <UserAvatar src={member.profile.imageUrl} className="h-8 w-8 md:h-8 md:w-8" />
          <p
            className={cn(
              "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition max-w-[130px] truncate text-left",
              params.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}
          >
            {member.profile.name}
          </p>
        </div>
      </ActionTooltip>
      {icon}
    </button>
  );
};

export default ServerMember;
