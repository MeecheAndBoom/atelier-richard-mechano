import type { Locale } from "./i18n/config";

export const SITE = {
  name: "Atelier Richard Méchano",
  tagline: "Pièces détachées d’exception, prêtes à monter.",
  taglineEn: "Exceptional spare parts, ready to fit.",
  location: "Lyon, France",
  address: "24 Rue de l’Industrie, 69007 Lyon, France",
  phone: "+33 7 80 96 92 76",
  phoneHref: "+33780969276",
  email: "info@atelierrichardmechano.com",
  adminEmail: "info@atelierrichardmechano.com",
  hours: [
    { days: "Lundi – Vendredi", daysEn: "Monday – Friday", time: "8:30 – 18:00" },
    { days: "Samedi", daysEn: "Saturday", time: "9:00 – 12:30" },
    { days: "Dimanche", daysEn: "Sunday", time: "Fermé / Closed" },
  ],
  currency: "EUR",
} as const;

/* ── Catalog taxonomy ─────────────────────────────────────────── */

export const PART_CATEGORIES = [
  "Engine",
  "Transmission",
  "Electrical",
  "Brakes",
  "Body",
  "Suspension",
  "Fuel",
  "Cooling",
  "Interior",
  "Tools",
  "Gaskets",
  "Filters",
  "Rims",
  "Tires",
  "TailLights",
  "Headlights",
] as const;

export type PartCategory = (typeof PART_CATEGORIES)[number];

/** Human labels for taxonomy values (shown verbatim — brand names stay as-is). */
export const CATEGORY_LABELS: Record<PartCategory, { fr: string; en: string }> = {
  Engine: { fr: "Moteur", en: "Engine" },
  Transmission: { fr: "Transmission", en: "Transmission" },
  Electrical: { fr: "Électricité", en: "Electrical" },
  Brakes: { fr: "Freinage", en: "Brakes" },
  Body: { fr: "Carrosserie", en: "Body" },
  Suspension: { fr: "Suspension", en: "Suspension" },
  Fuel: { fr: "Alimentation", en: "Fuel" },
  Cooling: { fr: "Refroidissement", en: "Cooling" },
  Interior: { fr: "Habitacle", en: "Interior" },
  Tools: { fr: "Outillage", en: "Tools" },
  Gaskets: { fr: "Joints", en: "Gaskets" },
  Filters: { fr: "Filtres", en: "Filters" },
  Rims: { fr: "Jantes", en: "Rims" },
  Tires: { fr: "Pneus", en: "Tires" },
  TailLights: { fr: "Feux arrière", en: "Tail lights" },
  Headlights: { fr: "Phares", en: "Headlights" },
};

export function categoryLabel(category: string, locale: Locale = "fr"): string {
  const known = CATEGORY_LABELS[category as PartCategory];
  return known ? known[locale] : category;
}

export const PART_CONDITIONS = ["new", "refurb", "used"] as const;
export type PartCondition = (typeof PART_CONDITIONS)[number];

export const PRODUCT_STATUSES = ["live", "draft"] as const;

/* ── Taxonomy tile types (Categories admin) ───────────────────── */

export const TAXONOMY_TYPES = ["category", "make", "brand", "model"] as const;
export type TaxonomyType = (typeof TAXONOMY_TYPES)[number];

/* ── Orders ───────────────────────────────────────────────────── */

export const ORDER_STATUSES = [
  "Placed",
  "Awaiting Payment",
  "Payment Pending",
  "Awaiting Payment Proof",
  "Payment Proof Submitted",
  "Payment Received",
  "Preparing",
  "Ready for Pickup",
  "Out for Delivery",
  "Completed",
  "Cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** The customer-facing tracking stepper. */
export const TRACKING_STEPS: { status: OrderStatus; key: string }[] = [
  { status: "Placed", key: "placed" },
  { status: "Payment Received", key: "paymentReceived" },
  { status: "Preparing", key: "preparing" },
  { status: "Ready for Pickup", key: "ready" },
  { status: "Completed", key: "completed" },
];

export const PAYMENT_STATUSES = [
  "pending",
  "awaiting-proof",
  "proof-submitted",
  "received",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PROOF_METHODS = ["email", "upload"] as const;
export type ProofMethod = (typeof PROOF_METHODS)[number];

export type PaymentMethodId = "transfer" | "westernunion";

export const PAYMENT_METHODS: {
  id: PaymentMethodId;
  label: string;
  labelEn: string;
  hint: string;
  hintEn: string;
}[] = [
  {
    id: "transfer",
    label: "Virement bancaire",
    labelEn: "Bank Transfer",
    hint: "Coordonnées bancaires envoyées par e-mail, reçues sous 24 h.",
    hintEn: "Bank details sent by email, usually received within 24 hours.",
  },
  {
    id: "westernunion",
    label: "Western Union",
    labelEn: "Western Union",
    hint: "Coordonnées Western Union envoyées par e-mail après la commande.",
    hintEn: "Western Union details sent by email after you place your order.",
  },
];

export const DELIVERY_FEE = 9.9;
export const FREE_DELIVERY_THRESHOLD = 150;

/* ── Blog taxonomy ────────────────────────────────────────────── */

export const BLOG_CATEGORIES = [
  "Guides",
  "Entretien",
  "Atelier",
  "Actualités",
] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, { fr: string; en: string }> = {
  Guides: { fr: "Guides", en: "Guides" },
  Entretien: { fr: "Entretien", en: "Maintenance" },
  Atelier: { fr: "Atelier", en: "Workshop" },
  Actualités: { fr: "Actualités", en: "News" },
};

export function blogCategoryLabel(
  category: string,
  locale: Locale = "fr",
): string {
  const known = BLOG_CATEGORY_LABELS[category as BlogCategory];
  return known ? known[locale] : category;
}

/* ── Enquiry kinds ────────────────────────────────────────────── */

export const ENQUIRY_KINDS = ["contact", "quote", "affiliate", "review", "part"] as const;
export type EnquiryKind = (typeof ENQUIRY_KINDS)[number];
