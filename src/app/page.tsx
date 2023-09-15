import InitialModal from "@/components/modals/initial-modal";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

export default async function Home() {
  const profile = await initialProfile();

  if (profile.servers[0]) {
    return redirect(`/servers/${profile.servers[0].id}`);
  }

  return <InitialModal />;
}
