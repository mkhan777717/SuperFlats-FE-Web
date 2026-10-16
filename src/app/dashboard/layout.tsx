import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, Search, Settings } from "lucide-react";
import { ConsoleMobileNav, ConsoleSidebar } from "@/components/console/console-nav";
import { UserMenu } from "@/components/site/user-menu";
import { getCurrentUser } from "@/lib/api";

const getHeaderInfo = (role: string) => {
  if (role === "super_admin") {
    return {
      title: "Super Admin Console",
      subtitle: "Platform Master · SuperFlats Network",
      badge: "Super Admin",
    };
  }
  if (role === "agent") {
    return {
      title: "Employee Console",
      subtitle: "Field Operations & Client Viewings · SuperFlats",
      badge: "Employee",
    };
  }
  return {
    title: "Owner Dashboard",
    subtitle: "Lead & Property Portfolio · SuperFlats",
    badge: "Owner / Admin",
  };
};

/** All 3 consoles (Super Admin, Owner/Admin, Employee): light clean sidebar, modern top bar, subtle canvas. */
export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");
  if (user.role === "client") redirect("/explore");

  const headerInfo = getHeaderInfo(user.role);

  return (
    <div className="flex min-h-dvh flex-1 bg-[#F8FAFC] font-sans antialiased text-slate-900">
      <ConsoleSidebar role={user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header matching reference layout */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 px-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] backdrop-blur-md sm:px-8">
          {/* Left Title */}
          <div className="flex items-center gap-3">
            <ConsoleMobileNav role={user.role} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
                  {headerInfo.title}
                </h1>
                <span className="hidden rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary sm:inline-block">
                  {headerInfo.badge}
                </span>
              </div>
              <p className="hidden text-xs text-slate-500 sm:block">{headerInfo.subtitle}</p>
            </div>
          </div>

          {/* Center Search Pill */}
          <form action="/dashboard/properties" method="GET" className="relative hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="search"
              name="q"
              placeholder="Search properties, flats, units..."
              className="h-9 w-full rounded-full border border-slate-200 bg-slate-50/80 pr-4 pl-9 text-xs transition-colors placeholder:text-slate-400 focus:border-primary/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
          </form>

          {/* Right Action Icons & User Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard/viewings"
              className="relative grid size-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Viewings notifications"
            >
              <Bell className="size-4 stroke-[2.2]" />
            </Link>
            <Link
              href="/dashboard/profile"
              className="grid size-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Settings"
            >
              <Settings className="size-4 stroke-[2.2]" />
            </Link>
            <div className="h-5 w-px bg-slate-200" aria-hidden />
            <div className="flex items-center rounded-full border border-slate-200/80 bg-white p-0.5 sm:pr-2 shadow-xs">
              <UserMenu user={user} />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 px-4 py-6 sm:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
