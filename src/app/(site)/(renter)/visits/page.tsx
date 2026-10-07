import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, UserRound } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Status } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { VisitActions } from "@/components/visits/visit-actions";
import { api } from "@/lib/api";
import { formatRupees } from "@/lib/format";
import type { Appointment, AppointmentPage } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "My visits" };

const TABS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const when = (iso: string) => {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }),
    time: d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }),
  };
};

function VisitCard({ visit }: { visit: Appointment }) {
  const listing = visit.listing;
  const property = listing?.flat?.property;
  const { day, time } = when(visit.scheduled_at);

  return (
    <li className="flex flex-col gap-5 rounded-sm border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-5">
        <div className="grid w-20 shrink-0 place-items-center rounded-sm bg-accent py-3 text-center text-accent-foreground">
          <CalendarDays className="size-5" aria-hidden />
          <span className="mt-1 text-xs font-semibold">{day.split(",")[0]}</span>
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {listing ? (
              <Link href={`/listings/${listing.id}`} className="font-semibold hover:text-link">
                {listing.title}
              </Link>
            ) : (
              <span className="font-semibold">Listing no longer available</span>
            )}
            <Status value={visit.status} />
          </div>
          {property && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5" aria-hidden /> {[property.name, property.address, property.city].filter(Boolean).join(", ")}
            </p>
          )}
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-muted-foreground" aria-hidden /> {day} · {time}
            </span>
            {listing && <span className="text-muted-foreground">{formatRupees(listing.monthly_rent)} / month</span>}
            {visit.employee && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <UserRound className="size-4" aria-hidden /> {visit.employee.name}
              </span>
            )}
          </p>
          {visit.feedback && <p className="mt-2 text-sm text-muted-foreground italic">“{visit.feedback}”</p>}
        </div>
      </div>
      <div className="shrink-0">
        <VisitActions id={visit.id} status={visit.status} feedback={visit.feedback} />
      </div>
    </li>
  );
}

export default async function VisitsPage({ searchParams }: PageProps<"/visits">) {
  const { tab: rawTab } = await searchParams;
  const tab: Tab = TABS.some((t) => t.id === rawTab) ? (rawTab as Tab) : "upcoming";
  const result = await api<AppointmentPage>("/appointments/client", { query: { status: tab, limit: 50, offset: 0 }, returnTo: `/visits?tab=${tab}` });
  // The backend's "upcoming" means "not completed", so cancelled visits are filtered out here.
  const visits = tab === "upcoming" ? result.appointments.filter((a) => a.status === "pending" || a.status === "confirmed") : result.appointments;

  return (
    <div className="grid gap-8">
      <PageHeader eyebrow="Viewings" title="My visits" description="Visits you've requested, and their status." />

      <nav aria-label="Visit status" className="flex gap-6 border-b">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={t.id === "upcoming" ? "/visits" : `/visits?tab=${t.id}`}
            aria-current={tab === t.id ? "page" : undefined}
            className={cn("caps -mb-px border-b-2 pb-3 transition", tab === t.id ? "border-gold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {visits.length ? (
        <ul className="grid gap-4">
          {visits.map((v) => (
            <VisitCard key={v.id} visit={v} />
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title={tab === "upcoming" ? "No upcoming visits" : tab === "completed" ? "No completed visits yet" : "No cancelled visits"}
          action={
            tab === "upcoming" && (
              <Button asChild>
                <Link href="/explore">Find a property to visit</Link>
              </Button>
            )
          }
        >
          {tab === "upcoming" ? "Open any property and choose “Book a viewing” to pick a day and time." : undefined}
        </EmptyState>
      )}
    </div>
  );
}
