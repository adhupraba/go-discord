import ServerSidebar from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { serverAxios } from "@/lib/server-axios";
import type { TApiData, TApiRes } from "@/types/api";
import type { TServer } from "@/types/model";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Params = { serverId: string };

interface IServerLayoutProps {
  children: ReactNode;
  params: Params;
}

export const generateMetadata = async ({ params: { serverId } }: { params: Params }): Promise<Metadata> => {
  const { data } = await serverAxios().get<TApiData<TServer>>(`/server/${serverId}`);

  if (!data.error || !data?.data?.id) {
    return {};
  }

  return {
    title: `${data.data.name} | Go Discord`,
    description: `${data.data.name} Server`,
  };
};

const ServerLayout = async ({ children, params: { serverId } }: IServerLayoutProps) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  const { data } = await serverAxios().get<TApiRes<TServer>>(`/server/${serverId}`);

  if (data.error) return redirect("/");

  const server = data.data;

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        {/* @ts-ignore server component */}
        <ServerSidebar serverId={server.id} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerLayout;
