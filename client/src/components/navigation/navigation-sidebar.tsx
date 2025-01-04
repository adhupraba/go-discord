import { currentProfile } from "@/lib/current-profile";
import NavigationAction from "./navigation-action";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationItem from "./navigation-item";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { serverAxios } from "@/lib/server-axios";
import type { TApiRes } from "@/types/api";
import type { TServer } from "@/types/model";

interface INavigationSidebarProps {}

const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) return redirect("/");

  const { data } = await serverAxios().get<TApiRes<TServer[]>>(`/server/user-servers`);

  let servers: TServer[] = [];

  if (data.error) {
    console.error("user servers api error =>", data.data.message);
  } else {
    servers = data.data;
  }

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1e1f22] bg-[#e3e5e8] py-3">
      <NavigationAction />

      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />

      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem id={server.id} imageUrl={server.imageUrl} name={server.name} />
          </div>
        ))}
      </ScrollArea>

      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-[48px] w-[48px]" } }} />
      </div>
    </div>
  );
};

export default NavigationSidebar;
