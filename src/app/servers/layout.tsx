import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import { ReactNode } from "react";

interface IServersLayoutProps {
  children: ReactNode;
}

const ServersLayout = ({ children }: IServersLayoutProps) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        {/* @ts-ignore server component */}
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default ServersLayout;
