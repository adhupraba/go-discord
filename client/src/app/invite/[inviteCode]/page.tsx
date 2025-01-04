import { currentProfile } from "@/lib/current-profile";
import { serverAxios } from "@/lib/server-axios";
import type { TApiRes } from "@/types/api";
import type { TMember, TServer } from "@/types/model";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface IInvitePageProps {
  params: { inviteCode: string };
}

type ExistingData = { existing: true; server: TServer };

type NewData = { existing: false; member: TMember };

const InvitePage = async ({ params: { inviteCode } }: IInvitePageProps) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  if (!inviteCode) return redirect("/");

  const { data } = await serverAxios().patch<TApiRes<ExistingData | NewData>>(`/server/${inviteCode}/verify`);

  if (data.error) {
    return <div className="text-red-500">Error - {data.data.message}</div>;
  }

  if (data.data.existing) {
    return redirect(`/servers/${data.data.server.id}`);
  }

  if (data.data.member) {
    return redirect(`/servers/${data.data.member.serverId}`);
  }

  return null;
};

export default InvitePage;
