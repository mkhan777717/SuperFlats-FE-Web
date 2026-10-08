import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { Status } from "@/components/common/status-badge";
import { UserAvatar } from "@/components/common/user-avatar";
import { FilterTabs, hrefWith, PAGE_SIZE, readListParams, Table, TableEmpty, TableFooter, TableSearch, Td } from "@/components/console/data-table";
import { AddTenantButton } from "@/components/console/tenant-actions";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { TenantPage } from "@/lib/types";

export const metadata: Metadata = { title: "Tenants" };

const BASE = "/dashboard/tenants";

export default async function TenantsPage({ searchParams }: PageProps<"/dashboard/tenants">) {
  const f = readListParams(await searchParams, ["status", "propertyId"]);
  const propertyId = /^\d+$/.test(f.propertyId) ? f.propertyId : "";
  const status = f.status === "occupied" || f.status === "available" ? f.status : "";
  const data = await api<TenantPage>("/tenants", { query: { keywords: f.q, status: status || undefined, propertyId: propertyId || undefined, limit: PAGE_SIZE, offset: f.offset }, returnTo: BASE });
  const current = { q: f.q, status, propertyId, page: f.page };

  return (
    <div className="grid gap-8">
      <PageHeader eyebrow="People" title="Tenants" description="Tenant records across your properties. Occupied tenants have an active booking." actions={<AddTenantButton />} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <FilterTabs
          active={status}
          items={[
            { label: "All", value: "", href: hrefWith(BASE, current, { status: "", page: 1 }) },
            { label: "Occupied", value: "occupied", href: hrefWith(BASE, current, { status: "occupied", page: 1 }) },
            { label: "Available", value: "available", href: hrefWith(BASE, current, { status: "available", page: 1 }) },
          ]}
        />
        <TableSearch base={BASE} value={f.q} placeholder="Search name or phone" keep={{ status, propertyId }} />
      </div>

      <div className="grid gap-4">
        <Table head={["Tenant", "Phone", "Property", "Documents", "Status", "Added"]} empty={!data.tenants.length && <TableEmpty>{f.q ? "No tenants match your search." : "No tenants yet. Use “Add tenant” to create one."}</TableEmpty>}>
          {data.tenants.map((t) => (
            <tr key={t.id}>
              <Td>
                <span className="flex items-center gap-3">
                  <UserAvatar name={t.name} className="size-8 text-xs" />
                  <Link href={`/dashboard/tenants/${t.id}`} className="font-medium hover:text-link">
                    {t.name}
                  </Link>
                </span>
              </Td>
              <Td>
                <a href={`tel:${t.phone_number}`} className="tabular hover:text-link">
                  {t.phone_number}
                </a>
              </Td>
              <Td>{t.property?.name ?? "—"}</Td>
              <Td className="text-muted-foreground">{t.photos?.length ? `${t.photos.length} uploaded` : "None"}</Td>
              <Td>
                <Status value={t.status} />
              </Td>
              <Td className="whitespace-nowrap text-muted-foreground">{t.created_at ? formatDate(t.created_at) : "—"}</Td>
            </tr>
          ))}
        </Table>
        <TableFooter total={data.totalItems} page={f.page} totalPages={data.totalPages} href={(page) => hrefWith(BASE, current, { page })} />
      </div>
    </div>
  );
}
