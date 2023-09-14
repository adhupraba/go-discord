import InitialModal from "@/components/modals/InitialModal";
import { initialProfile } from "@/lib/initialProfile";
import { redirect } from "next/navigation";

export default async function Home() {
  const profile = await initialProfile();

  if (profile.server) {
    return redirect(`/servers/${profile.server.id}`);
  }

  return <InitialModal />;
}
