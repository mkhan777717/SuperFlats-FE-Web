// Shapes of the JSON returned by superflats-backend (Sequelize models).
// DECIMAL columns come back as strings, so money fields are typed as string | number.

export type Role = "client" | "admin" | "agent";

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  role: Role;
  profile_image?: string | null;
  company_id?: number | null;
  created_at?: string;
}

export interface Photo {
  id: number;
  imageable_id: number;
  imageable_type: string;
  photo_url: string;
  name?: string | null;
  is_primary: boolean;
}

export interface Property {
  id: number;
  name: string;
  description?: string | null;
  address: string;
  city: string;
  state?: string;
  zipcode?: string;
  area_sqft?: string | number | null;
  parking?: boolean | null;
  amenities?: string[] | string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_managed?: boolean;
}

export interface Flat {
  id: number;
  title?: string;
  description?: string | null;
  unit_number?: string;
  type: string;
  area_sqft?: string | number | null;
  flat_status?: "available" | "occupied" | "maintenance";
  unique_amenities?: string[] | string | null;
  property: Property;
  photos?: Photo[];
}

export interface Listing {
  id: number;
  flat_id: number;
  lister_id: number;
  company_id: number;
  title: string;
  description?: string | null;
  monthly_rent: string | number;
  security_amount: string | number;
  security_type: "lease" | "deposit";
  status: "active" | "closed" | "pending";
  created_at?: string;
  flat: Flat;
  company?: { id: number; name: string } | null;
  lister?: Pick<User, "id" | "name" | "profile_image"> & Partial<User>;
}

export interface Paginated {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface ListingPage extends Paginated {
  listings: Listing[];
}

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Appointment {
  id: number;
  listing_id: number;
  user_id: number;
  company_id: number;
  employee_id?: number | null;
  scheduled_at: string;
  status: AppointmentStatus;
  feedback?: string | null;
  listing?: Omit<Listing, "flat"> & { flat?: Flat };
  employee?: Pick<User, "id" | "name" | "email" | "phone_number"> | null;
}

export interface AppointmentPage extends Paginated {
  appointments: Appointment[];
}

export interface AuthResponse extends User {
  accessToken: string;
  refreshToken: string;
}
