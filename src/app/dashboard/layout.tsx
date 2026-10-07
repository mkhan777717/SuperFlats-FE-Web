import { redirect } from "next/navigation";
import { ConsoleMobileNav, ConsoleSidebar } from "@/components/console/console-nav";
import { UserMenu } from "@/components/site/user-menu";
import { getCurrentUser } from "@/lib/api";

/** Owner / agent console: dark navy sidebar, light content area. Renters are sent back to the site. */
export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");
  if (user.role === "client") redirect("/explore");

  return (
    <div className="flex min-h-dvh flex-1">
      <ConsoleSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-8">
          <ConsoleMobileNav />
          <p className="caps text-muted-foreground">{user.role === "agent" ? "Agent" : "Owner"} console</p>
          <div className="ml-auto">
            <UserMenu user={user} />
          </div>
        </header>
        <main className="flex-1 px-4 py-8 sm:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
