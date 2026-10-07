import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { ProfileSettings } from "@/components/profile/profile-settings";
import { getCurrentUser } from "@/lib/api";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/profile");

  return (
    <div className="grid gap-10">
      <PageHeader eyebrow="Account" title="Your profile" />
      <ProfileSettings user={user} />
    </div>
  );
}
