import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarRange, Home, IndianRupee, Phone, ChevronLeft } from "lucide-react";
import { StatCard } from "@/components/common/stat-card";
import { Status, StatusBadge } from "@/components/common/status-badge";
import { UserAvatar } from "@/components/common/user-avatar";
import { Table, TableEmpty, Td } from "@/components/console/data-table";
import { RowAction } from "@/components/console/row-action";
import { TenantActions } from "@/components/console/tenant-actions";
import { TenantDocuments } from "@/components/console/tenant-documents";
import { ApiError, api } from "@/lib/api";
import { formatDate, formatRupees } from "@/lib/format";
import type { Booking, Paginated, Photo, RentBill, Tenant } from "@/lib/types";

export const metadata: Metadata = { title: "Tenant" };

type TenantProfile = Tenant & { bookings?: Booking[]; photos?: Pick<Photo, "id" | "name" | "photo_url">[] };
type RentHistory = Paginated & { total_due: number | string; history: RentBill[] };

const monthLabel = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });

export default async function TenantPage({ params }: PageProps<"/dashboard/tenants/[id]">) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const back = `/dashboard/tenants/${id}`;
  const notFoundAs404 = (e: unknown) => (e instanceof ApiError && e.status === 404 ? null : Promise.reject(e));

  const [tenant, rent] = await Promise.all([
    api<TenantProfile>(`/tenants/${id}`, { returnTo: back }).catch(notFoundAs404),
    api<RentHistory>(`/rents/tenants/${id}/history`, { query: { limit: 24, offset: 0 }, returnTo: back }).catch(notFoundAs404),
  ]);
  if (!tenant) notFound();

  const bookings = [...(tenant.bookings ?? [])].sort((a, b) => +new Date(b.start_date) - +new Date(a.start_date));
  const active = bookings.find((b) => b.status === "active");

  return (
    <div className="grid gap-10">
      <Link href="/dashboard/tenants" className="caps inline-flex w-fit items-center gap-1.5 text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" aria-hidden /> Tenants
      </Link>

      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <UserAvatar name={tenant.name} className="size-16 text-lg" />
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-medium text-primary sm:text-4xl">{tenant.name}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-3 text-muted-foreground">
              <a href={`tel:${tenant.phone_number}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                <Phone className="size-4" aria-hidden /> {tenant.phone_number}
              </a>
              <span>· {tenant.property?.name}</span>
              <Status value={tenant.status} />
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <TenantActions tenant={tenant} />
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total due" value={formatRupees(rent?.total_due ?? 0)} icon={IndianRupee} tone={Number(rent?.total_due) > 0 ? "red" : "green"} />
        <StatCard label="Current flat" value={active ? `Unit ${active.flat?.unit_number}` : "—"} icon={Home} hint={active ? `${formatRupees(active.monthly_rent)} / month` : "No active booking"} />
        <StatCard label="Bookings" value={bookings.length} icon={CalendarRange} hint="All time" />
      </section>

      <section className="grid gap-5">
        <div>
          <h2 className="font-display text-2xl font-medium text-primary">ID documents</h2>
          <span className="gold-rule mt-3" aria-hidden />
        </div>
        <TenantDocuments tenantId={tenant.id} documents={tenant.photos ?? []} />
      </section>

      <section className="grid gap-5">
        <div>
          <h2 className="font-display text-2xl font-medium text-primary">Bookings</h2>
          <span className="gold-rule mt-3" aria-hidden />
        </div>
        <Table head={["Flat", "Period", "Rent", "Security", "Status"]} empty={!bookings.length && <TableEmpty>No bookings yet. Create one from Bookings.</TableEmpty>}>
          {bookings.map((b) => (
            <tr key={b.id}>
              <Td>
                <span className="block font-medium">Unit {b.flat?.unit_number}</span>
                <span className="text-xs text-muted-foreground">{b.flat?.property?.name}</span>
              </Td>
              <Td className="whitespace-nowrap">
                {formatDate(b.start_date)} – {formatDate(b.end_date)}
              </Td>
              <Td className="tabular">{formatRupees(b.monthly_rent)}</Td>
              <Td className="tabular">
                {formatRupees(b.security_amount)} <span className="text-xs text-muted-foreground">{b.security_type}</span>
              </Td>
              <Td>
                <Status value={b.status} />
              </Td>
            </tr>
          ))}
        </Table>
      </section>

      <section className="grid gap-5">
        <div>
          <h2 className="font-display text-2xl font-medium text-primary">Rent history</h2>
          <span className="gold-rule mt-3" aria-hidden />
        </div>
        <Table head={["Month", "Amount", "Status", ""]} empty={!rent?.history.length && <TableEmpty>No rent bills yet. They are created on the 1st of each month for active bookings.</TableEmpty>}>
          {(rent?.history ?? []).map((bill) => (
            <tr key={bill.id}>
              <Td>{monthLabel(bill.bill_month)}</Td>
              <Td className="font-semibold tabular">{formatRupees(bill.amount)}</Td>
              <Td>
                {bill.is_paid ? (
                  <StatusBadge tone="success" dot>
                    Paid{bill.payment_date && ` · ${formatDate(bill.payment_date)}`}
                  </StatusBadge>
                ) : (
                  <StatusBadge tone="danger" dot>
                    Unpaid
                  </StatusBadge>
                )}
              </Td>
              <Td>
                <div className="flex justify-end">
                  {bill.is_paid ? (
                    <RowAction path={`/rents/bills/${bill.id}/unpay`} label="Mark unpaid" success="Bill marked unpaid" variant="ghost" />
                  ) : (
                    <RowAction path={`/rents/bills/${bill.id}/pay`} label="Mark paid" success="Rent marked as paid" />
                  )}
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </section>
    </div>
  );
}
