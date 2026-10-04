import Link from "next/link";
import { Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Logo } from "@/components/ui/logo";
import { BottomNav, SidebarNav } from "@/components/shell/sidebar-nav";
import { getCurrentUser } from "@/lib/api";

export default async function TenantLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-dvh flex-1">
      <aside className="sticky top-0 hidden h-dvh w-72 shrink-0 flex-col border-r border-line bg-surface lg:flex">
        <div className="border-b border-line px-7 py-7">
          <Logo href="/explore" subtitle="Tenant Portal" />
        </div>
        <div className="flex-1 py-6">
          <SidebarNav />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-[72px] items-center gap-4 border-b border-line bg-surface/90 px-4 backdrop-blur sm:px-8">
          <Logo href="/explore" className="lg:hidden [&>span:last-child]:hidden sm:[&>span:last-child]:block" />
          <form action="/explore" role="search" className="relative max-w-lg flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-ink-faint" aria-hidden />
            <input
              name="keywords"
              type="search"
              placeholder="Search by area, society or keyword…"
              aria-label="Search listings"
              className="h-11 w-full rounded-2xl bg-muted pl-11 pr-4 text-[15px] placeholder:text-ink-faint focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </form>
          {user && (
            <Link href="/profile" className="ml-auto flex items-center gap-3 rounded-full py-1 pl-1 pr-1 hover:bg-muted sm:pr-4">
              <Avatar name={user.name} src={user.profile_image} size={38} />
              <span className="hidden font-medium sm:block">{user.name}</span>
            </Link>
          )}
        </header>
        <main className="flex-1 px-4 pb-28 pt-6 sm:px-8 lg:pb-12 lg:pt-8">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
