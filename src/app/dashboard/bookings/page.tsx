import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { Status, StatusBadge } from "@/components/common/status-badge";
import { FilterTabs, hrefWith, PAGE_SIZE, readListParams, Table, TableEmpty, TableFooter, TableSearch, Td } from "@/components/console/data-table";
import { AddBookingButton, BookingRowActions } from "@/components/console/booking-actions";
import { api } from "@/lib/api";
import { formatDate, formatRupees } from "@/lib/format";
import type { BookingPage } from "@/lib/types";

export const metadata: Metadata = { title: "Bookings" };

const BASE = "/dashboard/bookings";
const SIXTY_DAYS = 60 * 24 * 60 * 60 * 1000;

/** Active booking whose end date falls within the next 60 days. */
function isEndingSoon(status: string, endDate: string) {
  const left = new Date(endDate).getTime() - Date.now();
  return status === "active" && left > 0 && left <= SIXTY_DAYS;
}

export default async function BookingsPage({ searchParams }: PageProps<"/dashboard/bookings">) {
  const f = readListParams(await searchParams, ["status"]);
  const status = ["active", "ended", "cancelled"].includes(f.status) ? f.status : "";
  const data = await api<BookingPage>("/bookings", { query: { keywords: f.q, status: status || undefined, limit: PAGE_SIZE, offset: f.offset }, returnTo: BASE });
  const current = { q: f.q, status, page: f.page };

  return (
    <div className="grid gap-8">
      <PageHeader eyebrow="Contracts" title="Bookings" description="Rental contracts between your flats and tenants. Rent bills are created monthly for active bookings." actions={<AddBookingButton />} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <FilterTabs
          active={status}
          items={["", "active", "ended", "cancelled"].map((s) => ({ label: s ? s[0]!.toUpperCase() + s.slice(1) : "All", value: s, href: hrefWith(BASE, current, { status: s, page: 1 }) }))}
        />
        <TableSearch base={BASE} value={f.q} placeholder="Search tenant, unit or property" keep={{ status }} />
      </div>

      <div className="grid gap-4">
        <Table head={["Tenant", "Flat", "Period", "Rent", "Security", "Status", ""]} empty={!data.bookings.length && <TableEmpty>No bookings here. Use “New booking” to rent a flat to a tenant.</TableEmpty>}>
          {data.bookings.map((b) => {
            const endingSoon = isEndingSoon(b.status, b.end_date);
            return (
              <tr key={b.id}>
                <Td>
                  <span className="block font-medium">{b.tenant?.name ?? "—"}</span>
                  <span className="text-xs text-muted-foreground tabular">{b.tenant?.phone_number}</span>
                </Td>
                <Td>
                  <span className="block font-medium">Unit {b.flat?.unit_number}</span>
                  <span className="text-xs text-muted-foreground">
                    {b.flat?.property?.name} · {b.flat?.type}
                  </span>
                </Td>
                <Td className="whitespace-nowrap">
                  {formatDate(b.start_date)} – {formatDate(b.end_date)}
                  {endingSoon && (
                    <StatusBadge tone="warning" className="ml-2">
                      Ending soon
                    </StatusBadge>
                  )}
                </Td>
                <Td className="tabular">{formatRupees(b.monthly_rent)}</Td>
                <Td className="tabular">
                  {formatRupees(b.security_amount)} <span className="text-xs text-muted-foreground">{b.security_type}</span>
                </Td>
                <Td>
                  <Status value={b.status} />
                </Td>
                <Td>
                  <BookingRowActions booking={b} />
                </Td>
              </tr>
            );
          })}
        </Table>
        <TableFooter total={data.totalItems} page={f.page} totalPages={data.totalPages} href={(page) => hrefWith(BASE, current, { page })} />
      </div>
    </div>
  );
}
