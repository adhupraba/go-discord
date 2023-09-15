import { currentProfile } from "@/lib/current-profile";
import { serverAxios } from "@/lib/server-axios";
import { TApiRes } from "@/types/api";
import { TMember, TServer } from "@/types/model";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface IInvitePageProps {
  params: { inviteCode: string };
}

type ExistingData = { existing: true; server: TServer };

type NewData = { existing: false; member: TMember };

const InvitePage = async ({ params: { inviteCode } }: IInvitePageProps) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  if (!inviteCode) return redirect("/");

  const { data } = await serverAxios().patch<TApiRes<ExistingData | NewData>>(`/api/server/${inviteCode}/verify`);

  console.log("invite code verify api =>", JSON.stringify(data, undefined, 2));

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
