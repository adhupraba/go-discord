import InitialModal from "@/components/modals/initial-modal";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

export default async function Home() {
  const profile = await initialProfile();

  if (profile.server) {
    return redirect(`/servers/${profile.server.id}`);
  }

  return <InitialModal />;
}
