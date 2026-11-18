import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Building2, MapPin } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { FilterTabs, hrefWith, PAGE_SIZE, readListParams, TableFooter, TableSearch } from "@/components/console/data-table";
import { AddPropertyButton } from "@/components/console/property-actions";
import { api, getCurrentUser } from "@/lib/api";
import { formatArea } from "@/lib/format";
import type { PropertyPage } from "@/lib/types";

export const metadata: Metadata = { title: "Properties" };

const BASE = "/dashboard/properties";

export default async function PropertiesPage({ searchParams }: PageProps<"/dashboard/properties">) {
  const f = readListParams(await searchParams, ["managed"]);
  const [user, data] = await Promise.all([
    getCurrentUser(),
    api<PropertyPage>("/properties", {
      query: { keywords: f.q, is_managed: f.managed || undefined, limit: PAGE_SIZE, offset: f.offset, sortBy: "created_at", sortOrder: "DESC" },
      returnTo: BASE,
    }),
  ]);
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const current = { q: f.q, managed: f.managed, page: f.page };

  return (
    <div className="grid gap-8">
      <PageHeader eyebrow="Portfolio" title="Properties" description="Buildings in your company and how many flats and tenants each has." actions={<AddPropertyButton isAdmin={isAdmin} />} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <FilterTabs
          active={f.managed}
          items={[
            { label: "All", value: "", href: hrefWith(BASE, current, { managed: "", page: 1 }) },
            { label: "Managed", value: "true", href: hrefWith(BASE, current, { managed: "true", page: 1 }) },
            { label: "Not managed", value: "false", href: hrefWith(BASE, current, { managed: "false", page: 1 }) },
          ]}
        />
        <TableSearch base={BASE} value={f.q} placeholder="Search name or address" keep={{ managed: f.managed }} />
      </div>

      {data.properties.length ? (
        <>
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {data.properties.map((p) => {
              const photo = [...(p.photos ?? [])].sort((a, b) => Number(b.is_primary) - Number(a.is_primary))[0];
              const area = formatArea(p.area_sqft);
              return (
                <li key={p.id} className="group relative overflow-hidden rounded-2xl border bg-card shadow-soft transition-all duration-200 hover:shadow-lift hover:-translate-y-0.5">
                  <div className="relative aspect-[16/9] bg-muted">
                    {photo ? (
                      <Image src={photo.photo_url} alt={p.name} fill sizes="(min-width: 1280px) 30vw, 50vw" className="object-cover" />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-muted-foreground">
                        <Building2 className="size-8" aria-hidden />
                      </span>
                    )}
                    {p.is_managed && <StatusBadge tone="primary" className="absolute top-3 left-3 bg-white">Managed</StatusBadge>}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold">
                      <Link href={`/dashboard/properties/${p.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
                        {p.name}
                      </Link>
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" aria-hidden />
                      <span className="line-clamp-1">{[p.address, p.city].filter(Boolean).join(", ")}</span>
                    </p>
                    <dl className="mt-4 grid grid-cols-3 border-t pt-4 text-center">
                      <div>
                        <dt className="text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">Flats</dt>
                        <dd className="mt-1 text-lg font-semibold tabular">{p.total_flats ?? 0}</dd>
                      </div>
                      <div className="border-x">
                        <dt className="text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">Tenants</dt>
                        <dd className="mt-1 text-lg font-semibold tabular">{p.total_tenants ?? 0}</dd>
                      </div>
                      <div>
                        <dt className="text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">Area</dt>
                        <dd className="mt-1 text-sm font-semibold">{area ?? "—"}</dd>
                      </div>
                    </dl>
                  </div>
                </li>
              );
            })}
          </ul>
          <TableFooter total={data.totalItems} page={f.page} totalPages={data.totalPages} href={(page) => hrefWith(BASE, current, { page })} />
        </>
      ) : (
        <EmptyState icon={Building2} title={f.q ? "No properties match your search" : "No properties yet"} action={!f.q && <AddPropertyButton isAdmin={isAdmin} />}>
          {f.q ? "Try a different name or address." : "Add your first property to start listing flats."}
        </EmptyState>
      )}
    </div>
  );
}
