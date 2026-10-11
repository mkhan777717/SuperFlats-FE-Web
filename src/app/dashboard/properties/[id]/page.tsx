import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, CheckCircle2, ChevronLeft, DoorOpen, IndianRupee, MapPin, Users } from "lucide-react";
import { StatCard } from "@/components/common/stat-card";
import { Status, StatusBadge } from "@/components/common/status-badge";
import { Table, TableEmpty, Td } from "@/components/console/data-table";
import { PhotoManager } from "@/components/console/photo-manager";
import { AddFlatButton, FlatRowActions, PropertyActions } from "@/components/console/property-actions";
import { ApiError, api, getCurrentUser } from "@/lib/api";
import { FLAT_TYPES } from "@/lib/config";
import { formatArea, formatRupees, toStringArray } from "@/lib/format";
import type { Flat, OwnerProperty, Paginated } from "@/lib/types";
import { unitsLeft } from "@/lib/units";

export const metadata: Metadata = { title: "Property" };

type Overview = { totalFlats: number; totalVacantFlats: number; totalActiveTenants: number; totalRentDue: number | string };

export default async function PropertyPage({ params }: PageProps<"/dashboard/properties/[id]">) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const back = `/dashboard/properties/${id}`;

  const [user, property, overview, flats] = await Promise.all([
    getCurrentUser(),
    api<{ property: OwnerProperty }>(`/properties/${id}`, { returnTo: back })
      .then((r) => r.property)
      .catch((e) => (e instanceof ApiError && e.status === 404 ? null : Promise.reject(e))),
    api<Overview>(`/properties/${id}/overview`, { returnTo: back }),
    api<Paginated & { flats: Flat[] }>(`/properties/${id}/flats`, { query: { limit: 100, offset: 0, sortBy: "unit_number", sortOrder: "ASC" }, returnTo: back }).catch(
      (e) => (e instanceof ApiError && e.status === 404 ? null : Promise.reject(e)),
    ),
  ]);
  // Another company's property (or a deleted one) is reported as not found.
  if (!property || !flats || property.company_id !== user?.company_id) notFound();

  const isAdmin = user?.role === "admin";
  const amenities = toStringArray(property.amenities);
  const address = [property.address, property.city, property.state, property.zipcode].filter(Boolean).join(", ");
  const slots = FLAT_TYPES.map((t) => ({ type: t, left: unitsLeft(property, t) })).filter((s) => s.left > 0);

  return (
    <div className="grid gap-10">
      <Link href="/dashboard/properties" className="caps inline-flex w-fit items-center gap-1.5 text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" aria-hidden /> Properties
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow">{property.is_managed ? "Managed property" : "Property"}</p>
          <h1 className="mt-2 font-display text-3xl font-medium text-primary sm:text-4xl">{property.name}</h1>
          <span className="gold-rule mt-3" aria-hidden />
          <p className="mt-3 flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-4 shrink-0" aria-hidden /> {address}
          </p>
        </div>
        {isAdmin && (
          <div className="flex shrink-0 gap-2">
            <PropertyActions property={property} />
          </div>
        )}
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Flats" value={overview.totalFlats} icon={Building2} />
        <StatCard label="Vacant flats" value={overview.totalVacantFlats} icon={DoorOpen} tone="green" />
        <StatCard label="Active tenants" value={overview.totalActiveTenants} icon={Users} tone="blue" href={`/dashboard/tenants?propertyId=${property.id}`} />
        <StatCard label="Rent due" value={formatRupees(overview.totalRentDue)} icon={IndianRupee} tone="red" href={`/dashboard/rent?paid=false&propertyId=${property.id}`} />
      </section>

      <section className="grid gap-5">
        <div>
          <h2 className="font-display text-2xl font-medium text-primary">Photos</h2>
          <span className="gold-rule mt-3" aria-hidden />
        </div>
        <PhotoManager
          photos={property.photos ?? []}
          uploadPath={`/properties/upload-photo/${property.id}`}
          deleteBase={`/properties/${property.id}/photos`}
        />
      </section>

      <section className="grid gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-medium text-primary">Flats</h2>
            <span className="gold-rule mt-3" aria-hidden />
            <p className="mt-3 text-sm text-muted-foreground">
              {slots.length ? `Units left to add: ${slots.map((s) => `${s.left} × ${s.type}`).join(", ")}` : "All unit slots are used. Edit the property to add more."}
            </p>
          </div>
          <AddFlatButton property={property} isAdmin={isAdmin} />
        </div>
        <Table head={["Unit", "Title", "Type", "Area", "Photos", "Status", ""]} empty={!flats.flats.length && <TableEmpty>No flats yet. Add the first one.</TableEmpty>}>
          {flats.flats.map((f) => (
            <tr key={f.id}>
              <Td className="font-semibold">{f.unit_number}</Td>
              <Td>{f.title}</Td>
              <Td>{f.type}</Td>
              <Td className="text-muted-foreground">{formatArea(f.area_sqft) ?? "—"}</Td>
              <Td className="text-muted-foreground">{f.photos?.length ?? 0}</Td>
              <Td>
                <Status value={f.flat_status ?? "available"} />
              </Td>
              <Td>
                <FlatRowActions property={property} flat={f} isAdmin={isAdmin} />
              </Td>
            </tr>
          ))}
        </Table>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl font-medium text-primary">Details</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Total area</dt>
              <dd className="font-medium">{formatArea(property.area_sqft) ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Parking</dt>
              <dd className="font-medium">{property.parking ? "Available" : "Not available"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Map location</dt>
              <dd className="font-medium">{property.latitude && property.longitude ? "Set" : <StatusBadge tone="warning">Not set</StatusBadge>}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Managed</dt>
              <dd className="font-medium">{property.is_managed ? "Yes" : "No"}</dd>
            </div>
          </dl>
          {property.description && <p className="mt-5 border-t pt-4 text-sm leading-relaxed whitespace-pre-line text-foreground/80">{property.description}</p>}
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl font-medium text-primary">Amenities</h2>
          {amenities.length ? (
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {amenities.map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="size-4 text-gold-strong" aria-hidden /> {a}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No amenities added.</p>
          )}
        </div>
      </section>
    </div>
  );
}
