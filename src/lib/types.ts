export interface EventType {
  id: number;
  name: string;
  slug: string;
  packages: Package[];
}

export interface Package {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  eventTypeId: number;
  features: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface QuoteFormData {
  eventTypeId: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: string;
  eventLocation: string;
  guestCount: number;
  budgetMin: number;
  budgetMax: number;
  packageId: number;
  serviceIds: number[];
}

export interface Quote {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: string;
  eventLocation: string;
  guestCount: number;
  budgetMin: number;
  budgetMax: number;
  eventTypeId: number;
  eventType: EventType;
  packageId: number;
  package: Package;
  services: { service: Service }[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
