import { Menu } from "lucide-react";
import { FC } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import ServerSidebar from "@/components/server/server-sidebar";

interface IMobileToggleProps {
  serverId: string;
}

const MobileToggle: FC<IMobileToggleProps> = ({ serverId }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0 w-[310px]">
        <div className="w-[72px]">
          {/* @ts-ignore server component */}
          <NavigationSidebar />
        </div>
        {/* @ts-ignore server component */}
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
