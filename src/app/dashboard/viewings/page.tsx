import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { Status } from "@/components/common/status-badge";
import { FilterTabs, hrefWith, PAGE_SIZE, readListParams, Table, TableEmpty, TableFooter, Td } from "@/components/console/data-table";
import { RowAction } from "@/components/console/row-action";
import { ManageViewingButton } from "@/components/console/viewing-manage";
import { api } from "@/lib/api";
import type { AppointmentPage } from "@/lib/types";

export const metadata: Metadata = { title: "Viewing requests" };

const BASE = "/dashboard/viewings";
const STATUSES = ["", "pending", "confirmed", "completed", "cancelled"] as const;
const LABEL: Record<string, string> = { "": "All", pending: "Pending", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled" };

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });

export default async function ViewingsPage({ searchParams }: PageProps<"/dashboard/viewings">) {
  const f = readListParams(await searchParams, ["status"]);
  const status = (STATUSES as readonly string[]).includes(f.status) ? f.status : "";
  const data = await api<AppointmentPage>("/appointments", { query: { status: status || undefined, limit: PAGE_SIZE, offset: f.offset }, returnTo: BASE });
  const current = { status, page: f.page };

  return (
    <div className="grid gap-8">
      <PageHeader eyebrow="Leads" title="Viewing requests" description="Renters who asked to see your flats. Confirm, complete or cancel each visit." />

      <FilterTabs active={status} items={STATUSES.map((s) => ({ label: LABEL[s]!, value: s, href: hrefWith(BASE, current, { status: s, page: 1 }) }))} />

      <div className="grid gap-4">
        <Table head={["Renter", "Property", "When", "Agent", "Status", ""]} empty={!data.appointments.length && <TableEmpty>No viewing requests here.</TableEmpty>}>
          {data.appointments.map((a) => (
            <tr key={a.id}>
              <Td>
                <span className="block font-medium">{(a as { user?: { name?: string } }).user?.name ?? "Renter"}</span>
                <span className="text-xs text-muted-foreground">
                  {[(a as { user?: { phone_number?: string } }).user?.phone_number, (a as { user?: { email?: string } }).user?.email].filter(Boolean).join(" · ")}
                </span>
              </Td>
              <Td>
                <span className="block font-medium">{a.listing?.title ?? "Listing removed"}</span>
                <span className="text-xs text-muted-foreground">
                  {a.listing?.flat?.property?.name}
                  {a.listing?.flat?.unit_number && ` · Unit ${a.listing.flat.unit_number}`}
                </span>
              </Td>
              <Td className="whitespace-nowrap">{fmt(a.scheduled_at)}</Td>
              <Td className="text-muted-foreground">{a.employee?.name ?? "—"}</Td>
              <Td>
                <Status value={a.status} />
              </Td>
              <Td>
                <div className="flex justify-end gap-2">
                  <ManageViewingButton viewing={a} />
                  {a.status === "pending" && <RowAction path={`/appointments/${a.id}`} body={{ status: "confirmed" }} label="Confirm" success="Viewing confirmed" />}
                  {(a.status === "pending" || a.status === "confirmed") && (
                    <>
                      <RowAction path={`/appointments/${a.id}`} body={{ status: "completed" }} label="Done" success="Marked as completed" variant="ghost" />
                      <RowAction
                        path={`/appointments/${a.id}`}
                        body={{ status: "cancelled" }}
                        label="Cancel"
                        success="Viewing cancelled"
                        variant="ghost"
                        confirm={{ title: "Cancel this viewing?", description: "The renter will see it as cancelled.", action: "Cancel viewing" }}
                      />
                    </>
                  )}
                </div>
              </Td>
            </tr>
          ))}
        </Table>
        <TableFooter total={data.totalItems} page={f.page} totalPages={data.totalPages} href={(page) => hrefWith(BASE, current, { page })} />
      </div>
    </div>
  );
}
