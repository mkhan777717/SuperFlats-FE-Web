import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Pagination } from "@/components/common/pagination";
import { ListingGrid } from "@/components/landing/home-sections";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { ListingPage } from "@/lib/types";

export const metadata: Metadata = { title: "Saved properties" };

const PAGE_SIZE = 12;

export default async function SavedPage({ searchParams }: PageProps<"/saved">) {
  const { page: rawPage } = await searchParams;
  const page = Math.max(1, Number.parseInt(String(rawPage ?? "1"), 10) || 1);
  const result = await api<ListingPage>("/favorites", { query: { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }, returnTo: "/saved" });
  const ids = new Set(result.listings.map((l) => l.id));

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="Your shortlist"
        title="Saved properties"
        description={result.totalItems ? `${result.totalItems} saved ${result.totalItems === 1 ? "property" : "properties"}` : undefined}
      />
      {result.listings.length ? (
        <>
          <ListingGrid listings={result.listings} favorites={ids} signedIn />
          <Pagination page={page} totalPages={result.totalPages} href={(p: number) => (p > 1 ? `/saved?page=${p}` : "/saved")} />
        </>
      ) : (
        <EmptyState
          icon={Heart}
          title="No saved properties yet"
          action={
            <Button asChild>
              <Link href="/explore">Browse properties</Link>
            </Button>
          }
        >
          Tap the heart on any property to keep it here and compare later.
        </EmptyState>
      )}
    </div>
  );
}
