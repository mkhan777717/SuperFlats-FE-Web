import type { Metadata } from "next";
import Link from "next/link";
import { Building2, CalendarCheck, CalendarX, Home, IndianRupee, Megaphone, TrendingUp, UserPlus, Users, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Status } from "@/components/common/status-badge";
import { api, getCurrentUser } from "@/lib/api";
import { formatRupees } from "@/lib/format";
import type { AppointmentPage, BusinessKpis, DashboardStats } from "@/lib/types";

export const metadata: Metadata = { title: "Dashboard" };

const QUICK: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard/properties", label: "Properties", icon: Building2 },
  { href: "/dashboard/listings", label: "Listings", icon: Megaphone },
  { href: "/dashboard/tenants", label: "Tenants", icon: Users },
  { href: "/dashboard/rent?paid=false", label: "Unpaid rent", icon: IndianRupee },
];

export default async function DashboardPage() {
  const [user, stats, kpis, today] = await Promise.all([
    getCurrentUser(),
    api<DashboardStats>("/dashboard/stats", { returnTo: "/dashboard" }),
    api<BusinessKpis>("/dashboard/business-kpis", { returnTo: "/dashboard" }),
    api<AppointmentPage>("/appointments", { query: { date: "today", limit: 10, offset: 0 }, returnTo: "/dashboard" }),
  ]);
  const firstName = user?.name.split(" ")[0];

  return (
    <div className="grid gap-10">
      <PageHeader eyebrow="Overview" title={firstName ? `Welcome back, ${firstName}` : "Overview"} description="Your properties, tenants and rent at a glance." />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Properties" value={stats.totalProperties} icon={Building2} href="/dashboard/properties" />
        <StatCard label="Flats" value={stats.totalFlats} icon={Home} href="/dashboard/properties" />
        <StatCard label="Listings" value={stats.totalListings} icon={Megaphone} href="/dashboard/listings" />
        <StatCard label="Active tenants" value={stats.activeTenants} icon={Users} tone="green" href="/dashboard/tenants" />
        <StatCard label="Rent due" value={formatRupees(stats.totalRentDue)} icon={IndianRupee} tone="red" hint="All unpaid rent bills" href="/dashboard/rent?paid=false" />
        <StatCard label="Viewings today" value={stats.appointmentsToday} icon={CalendarCheck} tone="blue" href="/dashboard/viewings" />
      </section>

      <section>
        <h2 className="font-display text-2xl font-medium text-primary">This month</h2>
        <span className="gold-rule mt-3" aria-hidden />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Rent collected" value={formatRupees(kpis.totalRevenueThisMonth)} icon={TrendingUp} tone="green" />
          <StatCard label="Viewings completed" value={kpis.appointmentsCompleted} icon={CalendarCheck} hint="All time" />
          <StatCard label="Viewings cancelled" value={kpis.appointmentsCanceled} icon={CalendarX} tone="amber" hint="All time" />
          <StatCard label="New tenants" value={kpis.newLeadsThisWeek} icon={UserPlus} tone="blue" hint="Last 7 days" />
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-medium text-primary">Today&apos;s viewings</h2>
              <span className="gold-rule mt-3" aria-hidden />
            </div>
            <Link href="/dashboard/viewings" className="caps text-gold-strong hover:underline">
              All viewings
            </Link>
          </div>
          <div className="mt-6 rounded-sm border bg-card">
            {today.appointments.length ? (
              <ul className="divide-y">
                {today.appointments.map((a) => (
                  <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                    <div className="min-w-0">
                      <p className="font-medium">{a.listing?.title ?? "Listing removed"}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(a.scheduled_at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" })}
                        {a.employee?.name && ` · ${a.employee.name}`}
                      </p>
                    </div>
                    <Status value={a.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-10 text-center text-muted-foreground">No viewings scheduled for today.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-medium text-primary">Quick links</h2>
          <span className="gold-rule mt-3" aria-hidden />
          <ul className="mt-6 grid grid-cols-2 gap-3">
            {QUICK.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="flex flex-col gap-3 rounded-sm border bg-card p-4 transition hover:border-gold hover:shadow-lift">
                  <Icon className="size-5 text-gold-strong" aria-hidden />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
