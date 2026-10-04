import type { Metadata } from "next";
import Link from "next/link";
import { Building2, LogOut, Search } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/api";
import { logout } from "../(auth)/actions";

export const metadata: Metadata = { title: "Dashboard" };

// Temporary landing for owners and agents; replaced by the owner console.
export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <main className="container-page flex flex-1 flex-col py-6">
      <Logo />
      <div className="mx-auto flex max-w-xl flex-1 flex-col justify-center py-12 text-center">
        <span className="mx-auto mb-6 grid size-14 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
          <Building2 className="size-6" aria-hidden />
        </span>
        <h1 className="text-3xl font-bold">Hi {user?.name?.split(" ")[0] ?? "there"}, your console is being set up</h1>
        <p className="mt-3 text-muted-foreground">Property, tenant and rent management is arriving here next. Meanwhile you can browse listings.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/explore">
              <Search aria-hidden /> Browse listings
            </Link>
          </Button>
          <form action={logout}>
            <Button type="submit" variant="outline" size="lg" className="w-full">
              <LogOut aria-hidden /> Sign out
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
