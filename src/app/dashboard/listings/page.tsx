import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Status } from "@/components/common/status-badge";
import { hrefWith, PAGE_SIZE, readListParams, Table, TableEmpty, TableFooter, TableSearch, Td } from "@/components/console/data-table";
import { RowAction } from "@/components/console/row-action";
import { api, getCurrentUser } from "@/lib/api";
import { coverPhoto, formatDate, formatRupees } from "@/lib/format";
import type { OwnerListingPage } from "@/lib/types";

export const metadata: Metadata = { title: "Listings" };

const BASE = "/dashboard/listings";

export default async function ListingsPage({ searchParams }: PageProps<"/dashboard/listings">) {
  const f = readListParams(await searchParams);
  const [user, data] = await Promise.all([
    getCurrentUser(),
    api<OwnerListingPage>("/listings/me", { query: { keywords: f.q, limit: PAGE_SIZE, offset: f.offset }, returnTo: BASE }),
  ]);
  const isAdmin = user?.role === "admin";
  const current = { q: f.q, page: f.page };

  return (
    <div className="grid gap-8">
      <PageHeader eyebrow="Marketing" title="Listings" description="Flats you have advertised to renters. Only active listings are shown on the website." />

      <div className="flex justify-end">
        <TableSearch base={BASE} value={f.q} placeholder="Search title, unit or property" />
      </div>

      <div className="grid gap-4">
        <Table
          head={["Listing", "Rent", "Deposit", "Status", "Listed", ""]}
          empty={!data.listings.length && <TableEmpty>{f.q ? "No listings match your search." : "No listings yet. Create one from the Superflats Admin app."}</TableEmpty>}
        >
          {data.listings.map((l) => {
            const photo = coverPhoto(l);
            return (
              <tr key={l.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-sm bg-muted text-muted-foreground">
                      {photo ? <Image src={photo} alt="" fill sizes="48px" className="object-cover" /> : <Megaphone className="size-4" aria-hidden />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{l.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {l.flat?.property?.name} · Unit {l.flat?.unit_number}
                      </span>
                    </span>
                  </div>
                </Td>
                <Td className="tabular">{formatRupees(l.monthly_rent)}</Td>
                <Td className="tabular">
                  {formatRupees(l.security_amount)} <span className="text-xs text-muted-foreground">{l.security_type}</span>
                </Td>
                <Td>
                  <Status value={l.status} />
                </Td>
                <Td className="whitespace-nowrap text-muted-foreground">{l.created_at ? formatDate(l.created_at) : "—"}</Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    {l.status === "active" && (
                      <Link href={`/listings/${l.id}`} target="_blank" className="grid size-9 place-items-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="View on website">
                        <ExternalLink className="size-4" />
                      </Link>
                    )}
                    {isAdmin && l.status !== "active" && <RowAction path={`/listings/${l.id}`} body={{ status: "active" }} label="Activate" success="Listing is now live" />}
                    {isAdmin && l.status === "active" && (
                      <RowAction
                        path={`/listings/${l.id}`}
                        body={{ status: "closed" }}
                        label="Close"
                        success="Listing closed"
                        variant="ghost"
                        confirm={{ title: "Close this listing?", description: "Renters will no longer see it. You can activate it again later.", action: "Close listing" }}
                      />
                    )}
                  </div>
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
