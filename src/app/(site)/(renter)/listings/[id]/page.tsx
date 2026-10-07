import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BedDouble, Car, CheckCircle2, ChevronLeft, Hash, MapPin, ReceiptIndianRupee, SquareDashed } from "lucide-react";
import { UserAvatar } from "@/components/common/user-avatar";
import { SignInToBrowse } from "@/components/landing/home-sections";
import { BookVisit } from "@/components/listings/book-visit";
import { FavoriteButton } from "@/components/listings/favorite-button";
import { PhotoGallery } from "@/components/listings/photo-gallery";
import { getOptionalUser, publicApi } from "@/lib/api";
import { getFavoriteIds } from "@/lib/favorites";
import { formatArea, formatRupees, listingAmenities, sortedPhotos, timeAgo } from "@/lib/format";
import type { Listing } from "@/lib/types";

const loadListing = (id: string) => publicApi<Listing>(`/listings/${encodeURIComponent(id)}`);

export async function generateMetadata({ params }: PageProps<"/listings/[id]">): Promise<Metadata> {
  const { id } = await params;
  const res = await loadListing(id);
  if (!res.ok) return { title: "Property" };
  const l = res.data;
  return {
    title: l.title,
    description: `${l.flat?.type} for rent at ${formatRupees(l.monthly_rent)}/month in ${[l.flat?.property?.address, l.flat?.property?.city].filter(Boolean).join(", ")}.`,
  };
}

function Spec({ icon: Icon, label, value }: { icon: typeof BedDouble; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-accent text-accent-foreground">
        <Icon className="size-5" aria-hidden />
      </span>
      <span>
        <span className="block text-[0.7rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">{label}</span>
        <span className="font-medium">{value}</span>
      </span>
    </div>
  );
}

export default async function ListingPage({ params }: PageProps<"/listings/[id]">) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const [res, user, favorites] = await Promise.all([loadListing(id), getOptionalUser(), getFavoriteIds()]);
  if (!res.ok) {
    if (res.status === 404) notFound();
    return (
      <div className="grid gap-6">
        <Back />
        <SignInToBrowse />
      </div>
    );
  }

  const listing = res.data;
  if (listing.status !== "active") notFound();

  const flat = listing.flat;
  const property = flat?.property;
  const area = formatArea(flat?.area_sqft);
  const amenities = listingAmenities(listing);
  const by = listing.company?.name || listing.lister?.name || "Owner";
  const address = [property?.address, property?.city, property?.state, property?.zipcode].filter(Boolean).join(", ");
  const mapUrl =
    property?.latitude && property?.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`
      : address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
        : null;

  return (
    <div className="grid gap-8">
      <Back />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid min-w-0 gap-10">
          <PhotoGallery photos={sortedPhotos(flat)} title={listing.title} />

          <header className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="eyebrow">{flat?.type} for rent</p>
              <h1 className="mt-2 font-display text-3xl font-medium text-primary sm:text-4xl">{listing.title}</h1>
              {address && (
                <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="size-4 shrink-0" aria-hidden /> {address}
                </p>
              )}
            </div>
            <FavoriteButton listingId={listing.id} initial={favorites.has(listing.id)} signedIn={!!user} className="size-11 border" />
          </header>

          <div className="grid gap-6 rounded-sm border bg-card p-6 sm:grid-cols-2 lg:grid-cols-3">
            <Spec icon={BedDouble} label="Type" value={flat?.type ?? "—"} />
            {area && <Spec icon={SquareDashed} label="Area" value={area} />}
            <Spec icon={ReceiptIndianRupee} label={listing.security_type === "lease" ? "Lease amount" : "Security deposit"} value={formatRupees(listing.security_amount)} />
            {flat?.unit_number && <Spec icon={Hash} label="Unit" value={flat.unit_number} />}
            {property?.parking != null && <Spec icon={Car} label="Parking" value={property.parking ? "Available" : "Not available"} />}
          </div>

          {(listing.description || property?.description) && (
            <section>
              <h2 className="font-display text-2xl font-medium text-primary">About this property</h2>
              <span className="gold-rule mt-3" aria-hidden />
              <div className="mt-5 grid gap-4 leading-relaxed whitespace-pre-line text-foreground/80">
                {listing.description && <p>{listing.description}</p>}
                {property?.description && property.description !== listing.description && <p>{property.description}</p>}
              </div>
            </section>
          )}

          {amenities.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-medium text-primary">Amenities</h2>
              <span className="gold-rule mt-3" aria-hidden />
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 shrink-0 text-gold-strong" aria-hidden /> {a}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {property && (
            <section>
              <h2 className="font-display text-2xl font-medium text-primary">Location</h2>
              <span className="gold-rule mt-3" aria-hidden />
              <div className="mt-5 flex flex-col gap-4 rounded-sm border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{property.name}</p>
                  <p className="text-muted-foreground">{address}</p>
                </div>
                {mapUrl && (
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="caps shrink-0 text-gold-strong hover:underline">
                    Open in Google Maps
                  </a>
                )}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="grid gap-6 rounded-sm border bg-card p-6 shadow-lift">
            <div>
              <p className="text-4xl font-semibold tracking-tight text-primary tabular">
                {formatRupees(listing.monthly_rent)}
                <span className="ml-1.5 text-base font-normal tracking-normal text-muted-foreground">/ month</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                + {formatRupees(listing.security_amount)} {listing.security_type === "lease" ? "lease" : "deposit"}
              </p>
            </div>
            <div className="border-t pt-6">
              <BookVisit listingId={listing.id} signedIn={!!user} />
            </div>
            <div className="flex items-center gap-3 border-t pt-6">
              <UserAvatar name={by} src={listing.lister?.profile_image} className="size-11" />
              <div className="min-w-0 text-sm">
                <p className="truncate font-semibold">{by}</p>
                <p className="text-muted-foreground">
                  {listing.lister?.name && listing.company?.name && listing.lister.name !== listing.company.name ? `Listed by ${listing.lister.name}` : "Property manager"}
                  {listing.created_at && ` · ${timeAgo(listing.created_at)}`}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Back() {
  return (
    <Link href="/explore" className="caps inline-flex w-fit items-center gap-1.5 text-muted-foreground hover:text-foreground">
      <ChevronLeft className="size-4" aria-hidden /> All properties
    </Link>
  );
}
