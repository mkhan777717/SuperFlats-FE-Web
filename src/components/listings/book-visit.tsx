"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/lib/client-api";
import { cn } from "@/lib/utils";

// Same slots as the Superflats mobile app.
const SLOTS = [
  { label: "9:00 AM", hour: 9 },
  { label: "11:00 AM", hour: 11 },
  { label: "1:00 PM", hour: 13 },
  { label: "3:00 PM", hour: 15 },
  { label: "5:00 PM", hour: 17 },
];
const DAYS_AHEAD = 7;

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

/** Day + time slot picker that requests a viewing; guests are sent to log in first. */
export function BookVisit({ listingId, signedIn }: { listingId: number; signedIn: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  // Dates depend on the visitor's clock, so they are built after mount to keep server HTML stable.
  const [now, setNow] = useState<Date | null>(null);
  const [day, setDay] = useState<Date | null>(null);
  const [hour, setHour] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setNow(new Date()), 0);
    return () => clearTimeout(id);
  }, []);

  const days = now ? Array.from({ length: DAYS_AHEAD }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)) : [];
  const isPast = (d: Date, h: number) => !!now && sameDay(d, now) && h <= now.getHours();

  async function book() {
    if (!signedIn) return router.push(`/login?next=${encodeURIComponent(pathname)}`);
    if (!day || hour === null) return;
    const scheduled = new Date(day);
    scheduled.setHours(hour, 0, 0, 0);
    setStatus("saving");
    setError(null);
    try {
      await clientApi("/appointments", { method: "POST", body: JSON.stringify({ listing_id: listingId, scheduled_at: scheduled.toISOString() }) });
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't book the visit.");
      setStatus("idle");
    }
  }

  if (status === "done" && day && hour !== null) {
    return (
      <div className="text-center">
        <span className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-success-soft text-success">
          <CalendarCheck className="size-6" aria-hidden />
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-primary">Visit requested</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {day.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} at {SLOTS.find((s) => s.hour === hour)?.label}. The owner will confirm it with
          you.
        </p>
        <Button asChild variant="outline" className="mt-5 w-full">
          <Link href="/visits">View my visits</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold tracking-tight text-primary">Book a viewing</h3>
      <p className="mt-1 text-sm text-muted-foreground">Free to request. The owner confirms the time.</p>

      <fieldset className="mt-5">
        <legend className="mb-2 text-[0.7rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">Day</legend>
        <div className="scrollbar-none -mx-1 flex min-h-[76px] gap-2 overflow-x-auto px-1 pb-1">
          {days.map((d) => {
            const active = !!day && sameDay(d, day);
            const full = SLOTS.every((s) => isPast(d, s.hour));
            return (
              <button
                key={d.toISOString()}
                type="button"
                disabled={full}
                onClick={() => {
                  setDay(d);
                  if (hour !== null && isPast(d, hour)) setHour(null);
                }}
                aria-pressed={active}
                className={cn(
                  "flex w-[58px] shrink-0 flex-col items-center rounded-sm border py-2 transition disabled:opacity-40",
                  active ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/40",
                )}
              >
                <span className={cn("text-[11px]", active ? "text-white/75" : "text-muted-foreground")}>
                  {now && sameDay(d, now) ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" })}
                </span>
                <span className="text-lg font-semibold">{d.getDate()}</span>
                <span className={cn("text-[11px]", active ? "text-white/75" : "text-muted-foreground")}>{d.toLocaleDateString("en-IN", { month: "short" })}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-4" disabled={!day}>
        <legend className="mb-2 text-[0.7rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">Time</legend>
        <div className="grid grid-cols-3 gap-2">
          {SLOTS.map((s) => {
            const active = hour === s.hour;
            const past = !!day && isPast(day, s.hour);
            return (
              <button
                key={s.hour}
                type="button"
                disabled={!day || past}
                onClick={() => setHour(s.hour)}
                aria-pressed={active}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-sm border py-2.5 text-sm font-medium transition disabled:opacity-40",
                  active ? "border-gold bg-accent text-foreground" : "hover:border-primary/40",
                )}
              >
                <Clock className="size-3.5" aria-hidden /> {s.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="mt-4 rounded-sm bg-destructive-soft px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button onClick={book} variant="gold" disabled={signedIn && (!day || hour === null)} loading={status === "saving"} size="xl" className="mt-5 w-full">
        {signedIn ? "Request viewing" : "Log in to book a viewing"}
      </Button>
    </div>
  );
}
