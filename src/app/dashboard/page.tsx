
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  IndianRupee,
  Layers,
  Megaphone,
  Phone,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { StatCard } from "@/components/common/stat-card";
import { Status } from "@/components/common/status-badge";
import { api, getCurrentUser } from "@/lib/api";
import { formatRupees } from "@/lib/format";
import type { AppointmentPage, BusinessKpis, DashboardStats } from "@/lib/types";

export const metadata: Metadata = { title: "Dashboard" };

const OWNER_ACTIONS = [
  { href: "/dashboard/properties", label: "Properties", icon: Building2, desc: "Manage buildings & flats" },
  { href: "/dashboard/listings", label: "Listings", icon: Megaphone, desc: "Public rental ads" },
  { href: "/dashboard/tenants", label: "Tenants", icon: Users, desc: "Active & past leases" },
  { href: "/dashboard/rent?paid=false", label: "Unpaid Rent", icon: IndianRupee, desc: "Bills pending payment" },
];

const EMPLOYEE_ACTIONS = [
  { href: "/dashboard/viewings", label: "Viewing Schedule", icon: CalendarCheck, desc: "Today's assigned visits" },
  { href: "/dashboard/listings", label: "Active Listings", icon: Megaphone, desc: "Units available to show" },
  { href: "/dashboard/properties", label: "Properties", icon: Building2, desc: "Building & flat details" },
  { href: "/dashboard/tenants", label: "Tenant Directory", icon: Users, desc: "Contacts & lease info" },
];

const SUPERADMIN_ACTIONS = [
  { href: "/dashboard/properties", label: "All Properties", icon: Building2, desc: "Platform-wide buildings" },
  { href: "/dashboard/listings", label: "All Listings", icon: Megaphone, desc: "Review public inventory" },
  { href: "/dashboard/team", label: "Owners & Agents", icon: ShieldCheck, desc: "Company administrators" },
  { href: "/dashboard/rent", label: "Platform Revenue", icon: IndianRupee, desc: "Overall transaction flow" },
];

export default async function DashboardPage() {
  const [user, stats, kpis, today] = await Promise.all([
    getCurrentUser(),
    api<DashboardStats>("/dashboard/stats", { returnTo: "/dashboard" }),
    api<BusinessKpis>("/dashboard/business-kpis", { returnTo: "/dashboard" }),
    api<AppointmentPage>("/appointments", { query: { date: "today", limit: 10, offset: 0 }, returnTo: "/dashboard" }),
  ]);
  const firstName = user?.name.split(" ")[0];
  const role = user?.role ?? "admin";

  // ─────────────────────────────────────────────────────────────
  // 1. SUPER ADMIN DASHBOARD
  // ─────────────────────────────────────────────────────────────
  if (role === "super_admin") {
    return (
      <div className="space-y-6 sm:space-y-8 font-sans">
        {/* Hero Banner: Super Admin Master */}
        <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#0B192C] via-[#10233D] to-[#18365B] p-6 text-white shadow-xl sm:p-8 lg:p-10">
          <div
            className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.085_78/0.25),transparent_70%)] blur-2xl"
            aria-hidden
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-gold uppercase tracking-wider">
                Platform Master
              </span>
              <p className="text-xs font-medium text-white/70 sm:text-sm">Global System Overview</p>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Super Admin Control Center
            </h1>

            {/* Embedded Glassmorphism Card */}
            <div className="mt-6 sm:mt-8 overflow-hidden rounded-[20px] border border-white/20 bg-white/[0.08] backdrop-blur-md p-5 sm:p-6 shadow-inner">
              <div className="grid gap-6 sm:grid-cols-[auto_1px_1fr] sm:items-center">
                <div className="space-y-1">
                  <p className="text-xs font-semibold tracking-wider text-white/70 uppercase">Platform Gross Volume</p>
                  <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl tabular">
                    {formatRupees(kpis.totalRevenueThisMonth)}
                  </p>
                </div>

                <div className="hidden h-16 w-px bg-white/20 sm:block" aria-hidden />

                <div className="grid grid-cols-3 gap-3 divide-x divide-white/10 text-center sm:gap-4">
                  <div className="px-2">
                    <p className="text-2xl font-bold text-white tabular sm:text-3xl">{stats.totalProperties}</p>
                    <p className="mt-1 text-xs text-white/70">Properties</p>
                  </div>
                  <div className="px-2">
                    <p className="text-2xl font-bold text-white tabular sm:text-3xl">{stats.totalListings}</p>
                    <p className="mt-1 text-xs text-white/70">Live Listings</p>
                  </div>
                  <div className="px-2">
                    <p className="text-2xl font-bold text-white tabular sm:text-3xl">{stats.activeTenants}</p>
                    <p className="mt-1 text-xs text-white/70">Active Users</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 iOS Stat Cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Live Listings"
            value={stats.totalListings}
            icon={Megaphone}
            tone="emerald"
            href="/dashboard/listings"
          />
          <StatCard
            label="Total Tenants"
            value={stats.activeTenants}
            icon={Users}
            tone="orange"
            href="/dashboard/tenants"
          />
          <StatCard
            label="Viewings Network"
            value={stats.appointmentsToday}
            icon={CalendarCheck}
            tone="amber"
            href="/dashboard/viewings"
          />
          <StatCard
            label="Platform Properties"
            value={stats.totalProperties}
            icon={Building2}
            tone="blue"
            href="/dashboard/properties"
          />
        </section>

        {/* Two-Column Split */}
        <div className="grid gap-6 lg:grid-cols-12">
          <section className="space-y-4 lg:col-span-7">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">Network Viewings</h2>
                <p className="text-xs text-slate-500">Scheduled client visits across all properties</p>
              </div>
              <Link href="/dashboard/viewings" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                <span>All Viewings</span>
                <ChevronRight className="size-4" />
              </Link>
            </div>
            <div className="overflow-hidden rounded-[22px] border border-slate-100 bg-white p-2 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)]">
              {today.appointments.length ? (
                <ul className="divide-y divide-slate-100">
                  {today.appointments.map((a) => (
                    <li key={a.id} className="flex items-center justify-between p-4 hover:bg-slate-50/80 rounded-xl transition">
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{a.listing?.title ?? "Property Visit"}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(a.scheduled_at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
                          {a.employee?.name && ` · Agent: ${a.employee.name}`}
                        </p>
                      </div>
                      <Status value={a.status} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-8 text-center text-xs text-slate-400">No viewings currently scheduled across the network today.</p>
              )}
            </div>
          </section>

          <section className="space-y-4 lg:col-span-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">Platform Operations</h2>
              <Link href="/dashboard/rent" className="text-xs font-semibold text-primary hover:underline">
                Revenue Flow →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SUPERADMIN_ACTIONS.map(({ href, label, icon: Icon, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex flex-col justify-between rounded-[22px] border border-slate-100 bg-white p-4 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] transition hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-9 place-items-center rounded-[12px] bg-slate-900 text-gold shadow-sm">
                      <Icon className="size-4" />
                    </span>
                    <ChevronRight className="size-4 text-slate-300 group-hover:text-slate-700 transition" />
                  </div>
                  <div className="mt-3">
                    <p className="font-semibold text-sm text-slate-900">{label}</p>
                    <p className="text-[11px] text-slate-500 truncate">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. EMPLOYEE / AGENT DASHBOARD
  // ─────────────────────────────────────────────────────────────
  if (role === "agent") {
    return (
      <div className="space-y-6 sm:space-y-8 font-sans">
        {/* Hero Banner: Employee / Agent */}
        <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#0B192C] via-[#10233D] to-[#18365B] p-6 text-white shadow-xl sm:p-8 lg:p-10">
          <div
            className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.085_78/0.25),transparent_70%)] blur-2xl"
            aria-hidden
          />
          <div className="relative z-10">
            <p className="text-xs font-medium text-white/70 sm:text-sm">Welcome back</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {firstName ? `${firstName}'s Agent Dashboard` : "Agent Field Dashboard"}
            </h1>

            {/* Embedded Glassmorphism Card */}
            <div className="mt-6 sm:mt-8 overflow-hidden rounded-[20px] border border-white/20 bg-white/[0.08] backdrop-blur-md p-5 sm:p-6 shadow-inner">
              <div className="grid gap-6 sm:grid-cols-[auto_1px_1fr] sm:items-center">
                <div className="space-y-1">
                  <p className="text-xs font-semibold tracking-wider text-white/70 uppercase">Today&apos;s Appointments</p>
                  <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl tabular">
                    {stats.appointmentsToday}
                  </p>
                </div>

                <div className="hidden h-16 w-px bg-white/20 sm:block" aria-hidden />

                <div className="grid grid-cols-3 gap-3 divide-x divide-white/10 text-center sm:gap-4">
                  <div className="px-2">
                    <p className="text-2xl font-bold text-white tabular sm:text-3xl">{stats.totalListings}</p>
                    <p className="mt-1 text-xs text-white/70">Units to Show</p>
                  </div>
                  <div className="px-2">
                    <p className="text-2xl font-bold text-white tabular sm:text-3xl">{stats.activeTenants}</p>
                    <p className="mt-1 text-xs text-white/70">Assigned Clients</p>
                  </div>
                  <div className="px-2">
                    <p className="text-2xl font-bold text-white tabular sm:text-3xl">{kpis.appointmentsCompleted}</p>
                    <p className="mt-1 text-xs text-white/70">Visits Done</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 iOS Stat Cards for Employee */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Today's Viewings"
            value={stats.appointmentsToday}
            icon={CalendarCheck}
            tone="amber"
            href="/dashboard/viewings"
          />
          <StatCard
            label="Active Listings"
            value={stats.totalListings}
            icon={Megaphone}
            tone="emerald"
            href="/dashboard/listings"
          />
          <StatCard
            label="Assigned Clients"
            value={stats.activeTenants}
            icon={Users}
            tone="orange"
            href="/dashboard/tenants"
          />
          <StatCard
            label="Completed Visits"
            value={kpis.appointmentsCompleted}
            icon={CheckCircle2}
            tone="blue"
            href="/dashboard/viewings"
          />
        </section>

        {/* Two-Column Split for Employee */}
        <div className="grid gap-6 lg:grid-cols-12">
          <section className="space-y-4 lg:col-span-7">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">Today&apos;s Field Visits</h2>
                <p className="text-xs text-slate-500">Your scheduled property showings today</p>
              </div>
              <Link href="/dashboard/viewings" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                <span>All Schedule</span>
                <ChevronRight className="size-4" />
              </Link>
            </div>

            <div className="overflow-hidden rounded-[22px] border border-slate-100 bg-white p-2 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)]">
              {today.appointments.length ? (
                <ul className="divide-y divide-slate-100">
                  {today.appointments.map((a) => (
                    <li key={a.id} className="flex items-center justify-between p-4 hover:bg-slate-50/80 rounded-xl transition">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-[14px] bg-gradient-to-br from-[#FFCC00] to-[#D49E00] text-white shadow-sm">
                          <Clock className="size-4 stroke-[2.2]" />
                        </span>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{a.listing?.title ?? "Property Showing"}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(a.scheduled_at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                      <Status value={a.status} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm font-semibold text-slate-900">No visits scheduled for today</p>
                  <p className="mt-1 text-xs text-slate-500">Check upcoming appointments or review new requests.</p>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4 lg:col-span-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">Agent Shortcuts</h2>
              <span className="text-xs text-slate-500">Daily Operations</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {EMPLOYEE_ACTIONS.map(({ href, label, icon: Icon, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex flex-col justify-between rounded-[22px] border border-slate-100 bg-white p-4 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] transition hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-9 place-items-center rounded-[12px] bg-primary/10 text-primary group-hover:scale-105 transition">
                      <Icon className="size-4 stroke-[2.2]" />
                    </span>
                    <ChevronRight className="size-4 text-slate-300 group-hover:text-slate-700 transition" />
                  </div>
                  <div className="mt-3">
                    <p className="font-semibold text-sm text-slate-900">{label}</p>
                    <p className="text-[11px] text-slate-500 truncate">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. OWNER / ADMIN DASHBOARD (Default)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 sm:space-y-8 font-sans">
      {/* ── 1. Hero Welcome Banner ── */}
      <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#0B192C] via-[#10233D] to-[#18365B] p-6 text-white shadow-xl sm:p-8 lg:p-10">
        <div
          className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.085_78/0.25),transparent_70%)] blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/3 size-64 rounded-full bg-[radial-gradient(circle,oklch(0.55_0.13_155/0.15),transparent_70%)] blur-2xl"
          aria-hidden
        />

        <div className="relative z-10">
          <p className="text-xs font-medium tracking-wide text-white/70 sm:text-sm">Welcome back</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {firstName ? `${firstName}'s Dashboard` : "Owner Dashboard"}
          </h1>

          {/* Embedded Glassmorphism Summary Card */}
          <div className="mt-6 sm:mt-8 overflow-hidden rounded-[20px] border border-white/20 bg-white/[0.08] backdrop-blur-md p-5 sm:p-6 shadow-inner">
            <div className="grid gap-6 sm:grid-cols-[auto_1px_1fr] sm:items-center">
              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-wider text-white/70 uppercase">This Month&apos;s Rent</p>
                <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl tabular">
                  {formatRupees(kpis.totalRevenueThisMonth)}
                </p>
              </div>

              <div className="hidden h-16 w-px bg-white/20 sm:block" aria-hidden />

              <div className="grid grid-cols-3 gap-3 divide-x divide-white/10 text-center sm:gap-4">
                <div className="px-2">
                  <p className="text-2xl font-bold text-white tabular sm:text-3xl">{stats.totalListings}</p>
                  <p className="mt-1 text-xs text-white/70">Active Listings</p>
                </div>
                <div className="px-2">
                  <p className="text-2xl font-bold text-white tabular sm:text-3xl">{stats.activeTenants}</p>
                  <p className="mt-1 text-xs text-white/70">Active Tenants</p>
                </div>
                <div className="px-2">
                  <p className="text-2xl font-bold text-white tabular sm:text-3xl">{stats.appointmentsToday}</p>
                  <p className="mt-1 text-xs text-white/70">Visits Today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Primary 4 iOS Stat Cards Row ── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Listings"
          value={stats.totalListings}
          icon={Megaphone}
          tone="emerald"
          href="/dashboard/listings"
        />
        <StatCard
          label="Active Tenants"
          value={stats.activeTenants}
          icon={Users}
          tone="orange"
          href="/dashboard/tenants"
        />
        <StatCard
          label="Scheduled Visits"
          value={stats.appointmentsToday}
          icon={CalendarCheck}
          tone="amber"
          href="/dashboard/viewings"
        />
        <StatCard
          label="Total Properties"
          value={stats.totalProperties}
          icon={Building2}
          tone="blue"
          href="/dashboard/properties"
        />
      </section>

      {/* ── 3. Bottom Two Columns ── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Today's Viewings */}
        <section className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">Today&apos;s Viewings</h2>
              <p className="text-xs text-slate-500">Scheduled property visits for today</p>
            </div>
            <Link
              href="/dashboard/viewings"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:underline sm:text-sm"
            >
              <span>View All</span>
              <ChevronRight className="size-4" aria-hidden />
            </Link>
          </div>

          <div className="overflow-hidden rounded-[22px] border border-slate-100 bg-white p-2 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)]">
            {today.appointments.length ? (
              <ul className="divide-y divide-slate-100">
                {today.appointments.map((a) => (
                  <li
                    key={a.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-slate-50/80 rounded-xl sm:px-5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-gradient-to-br from-[#FFCC00] to-[#D49E00] text-white shadow-sm">
                        <CalendarCheck className="size-5 stroke-[2.2]" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate max-w-xs sm:max-w-sm">
                          {a.listing?.title ?? "Listing visit"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(a.scheduled_at).toLocaleTimeString("en-IN", {
                            hour: "numeric",
                            minute: "2-digit",
                            timeZone: "Asia/Kolkata",
                          })}
                          {a.employee?.name && ` · Agent: ${a.employee.name}`}
                        </p>
                      </div>
                    </div>
                    <Status value={a.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center sm:p-12">
                <div className="grid size-12 place-items-center rounded-[16px] bg-slate-100 text-slate-400">
                  <CalendarCheck className="size-6 stroke-[2]" />
                </div>
                <p className="mt-3 font-semibold text-slate-900 text-sm">No viewings scheduled for today</p>
                <p className="mt-1 text-xs text-slate-500">All viewing requests will show up here as clients book visits.</p>
                <Link
                  href="/dashboard/viewings"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-800 transition hover:bg-slate-50"
                >
                  Check all viewings <ArrowRight className="size-3" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Performance & Quick Actions */}
        <section className="space-y-4 lg:col-span-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">Performance</h2>
              <p className="text-xs text-slate-500">Monthly metrics & overview</p>
            </div>
            <Link
              href="/dashboard/rent"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:underline sm:text-sm"
            >
              <span>Details</span>
              <ChevronRight className="size-4" aria-hidden />
            </Link>
          </div>

          <div className="space-y-4">
            <div className="rounded-[22px] border border-slate-100 bg-white p-5 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-slate-500">Pending Rent</p>
                    <p className="text-xl font-bold text-rose-600 tabular">{formatRupees(stats.totalRentDue)}</p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p className="text-xs font-medium text-slate-500">Collected This Month</p>
                    <p className="text-xl font-bold text-emerald-600 tabular">{formatRupees(kpis.totalRevenueThisMonth)}</p>
                  </div>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
                    style={{
                      width: `${kpis.totalRevenueThisMonth + stats.totalRentDue > 0
                          ? Math.min(100, Math.round((kpis.totalRevenueThisMonth / (kpis.totalRevenueThisMonth + stats.totalRentDue)) * 100))
                          : 0
                        }%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="rounded-[14px] bg-slate-50 p-2.5">
                    <p className="font-bold text-slate-900 tabular">{kpis.appointmentsCompleted}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">Completed</p>
                  </div>
                  <div className="rounded-[14px] bg-slate-50 p-2.5">
                    <p className="font-bold text-slate-900 tabular">{kpis.appointmentsCanceled}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">Cancelled</p>
                  </div>
                  <div className="rounded-[14px] bg-slate-50 p-2.5">
                    <p className="font-bold text-slate-900 tabular">{kpis.newLeadsThisWeek}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">New Leads</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {OWNER_ACTIONS.map(({ href, label, icon: Icon, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex flex-col justify-between rounded-[22px] border border-slate-100 bg-white p-4 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-9 place-items-center rounded-[12px] bg-primary/10 text-primary transition-transform group-hover:scale-105">
                      <Icon className="size-4 stroke-[2.2]" aria-hidden />
                    </span>
                    <ChevronRight className="size-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-800" />
                  </div>
                  <div className="mt-3">
                    <p className="font-semibold text-slate-900 text-sm">{label}</p>
                    <p className="text-[11px] text-slate-500 truncate">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
