import type { Metadata } from "next";
import { Building2, LogOut, Search } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { getCurrentUser } from "@/lib/api";
import { logout } from "../(auth)/actions";

export const metadata: Metadata = { title: "Owner dashboard" };

// Placeholder until the owner/broker phase: the backend roles `admin` and `agent` land here.
export default async function OwnerPage() {
  const user = await getCurrentUser();

  return (
    <main className="flex flex-1 flex-col px-5 py-8 sm:px-10">
      <Logo />
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-12 text-center">
        <span className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <Building2 className="size-7" aria-hidden />
        </span>
        <h1 className="text-3xl font-bold sm:text-4xl">Hi {user?.name?.split(" ")[0] ?? "there"}, the owner dashboard is on its way</h1>
        <p className="mt-4 text-lg text-ink-soft">
          Managing properties, flats, tenants and rent on the web is coming soon. Until then, please use the Superflats Admin app. You can
          still browse listings here.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/explore" icon={<Search className="size-4" aria-hidden />}>
            Browse listings
          </ButtonLink>
          <form action={logout}>
            <Button type="submit" variant="outline" className="w-full" icon={<LogOut className="size-4" aria-hidden />}>
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
