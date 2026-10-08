import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { FilterTabs, hrefWith, PAGE_SIZE, readListParams, Table, TableEmpty, TableFooter, Td } from "@/components/console/data-table";
import { RowAction } from "@/components/console/row-action";
import { api } from "@/lib/api";
import { formatDate, formatRupees } from "@/lib/format";
import type { RentBillPage } from "@/lib/types";

export const metadata: Metadata = { title: "Rent" };

const BASE = "/dashboard/rent";

const monthLabel = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });

export default async function RentPage({ searchParams }: PageProps<"/dashboard/rent">) {
  const f = readListParams(await searchParams, ["paid", "month"]);
  const paid = f.paid === "true" || f.paid === "false" ? f.paid : "";
  const month = /^\d{4}-\d{2}$/.test(f.month) ? f.month : "";
  const data = await api<RentBillPage>("/rents/bills", {
    query: { is_paid: paid || undefined, month: month || undefined, limit: PAGE_SIZE, offset: f.offset, sortBy: "bill_month", sortOrder: "DESC" },
    returnTo: BASE,
  });
  const current = { paid, month, page: f.page };

  return (
    <div className="grid gap-8">
      <PageHeader eyebrow="Collections" title="Rent" description="Monthly rent bills are created on the 1st for every active booking. Mark them paid as you collect." />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <FilterTabs
          active={paid}
          items={[
            { label: "All bills", value: "", href: hrefWith(BASE, current, { paid: "", page: 1 }) },
            { label: "Unpaid", value: "false", href: hrefWith(BASE, current, { paid: "false", page: 1 }) },
            { label: "Paid", value: "true", href: hrefWith(BASE, current, { paid: "true", page: 1 }) },
          ]}
        />
        <form action={BASE} className="flex items-center gap-2">
          {paid && <input type="hidden" name="paid" value={paid} />}
          <label className="text-sm text-muted-foreground" htmlFor="month">
            Month
          </label>
          <input
            id="month"
            name="month"
            type="month"
            defaultValue={month}
            className="h-10 rounded-sm border border-input bg-card px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
          />
          <button type="submit" className="caps h-10 rounded-sm border px-3 hover:bg-muted">
            Apply
          </button>
        </form>
      </div>

      <div className="grid gap-4">
        <Table head={["Tenant", "Flat", "Month", "Amount", "Status", ""]} empty={!data.bills.length && <TableEmpty>No rent bills here.</TableEmpty>}>
          {data.bills.map((b) => (
            <tr key={b.id}>
              <Td className="font-medium">{b.tenant?.name ?? "—"}</Td>
              <Td>
                <span className="block">Unit {b.booking?.flat?.unit_number}</span>
                <span className="text-xs text-muted-foreground">{b.booking?.flat?.property?.name}</span>
              </Td>
              <Td className="whitespace-nowrap">{monthLabel(b.bill_month)}</Td>
              <Td className="font-semibold tabular">{formatRupees(b.amount)}</Td>
              <Td>
                {b.is_paid ? (
                  <StatusBadge tone="success" dot>
                    Paid{b.payment_date && ` · ${formatDate(b.payment_date)}`}
                  </StatusBadge>
                ) : (
                  <StatusBadge tone="danger" dot>
                    Unpaid
                  </StatusBadge>
                )}
              </Td>
              <Td>
                <div className="flex justify-end">
                  {b.is_paid ? (
                    <RowAction
                      path={`/rents/bills/${b.id}/unpay`}
                      label="Mark unpaid"
                      success="Bill marked unpaid"
                      variant="ghost"
                      confirm={{ title: "Mark this bill as unpaid?", description: "Use this only if the payment was recorded by mistake.", action: "Mark unpaid" }}
                    />
                  ) : (
                    <RowAction path={`/rents/bills/${b.id}/pay`} label="Mark paid" success="Rent marked as paid" />
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
