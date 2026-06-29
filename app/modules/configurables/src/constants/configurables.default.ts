/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  // Base
  background: string;
  foreground: string;
  // Card
  card: string;
  cardForeground: string;
  // Popover
  popover: string;
  popoverForeground: string;
  // Primary
  primary: string;
  primaryForeground: string;
  // Secondary
  secondary: string;
  secondaryForeground: string;
  // Muted
  muted: string;
  mutedForeground: string;
  // Accent
  accent: string;
  accentForeground: string;
  // Destructive
  destructive: string;
  destructiveForeground: string;
  // Border / Input / Ring
  border: string;
  input: string;
  ring: string;
  // Charts
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
  // Navbar
  navbarBackground: string;
  // Sidebar
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

export type TFont = {
  headingFont: string;
  textFont: string;
};

export type TWhitelabelTier = {
  name: string;
  price: string;
  description: string;
};

export type TGovernorNames = {
  architect: string;
  integrity: string;
  stability: string;
  acquisition: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  tagline: string;
  companyName: string;
  footerText: string;
  heroHeading: string;
  heroSubheading: string;
  whitelabelTiers: TWhitelabelTier[];
  governorNames: TGovernorNames;
  enableWhitelabel: boolean;
  enableConsultingEngine: boolean;
  enableLeadEngine: boolean;
  enableMarketplace: boolean;
  consultingPriceRange: string;
  brandColor: TBrandColor;
  font: TFont;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Big II Consulting AI OS",
  logoUrl: "",
  tagline: "The Consulting AI Operating System",
  companyName: "DBII LLC",
  footerText: "© DBII LLC · All Rights Reserved · Privacy Policy · Powered by DBII LLC",
  heroHeading: "Sovereign AI Infrastructure for Enterprise",
  heroSubheading: "Stop bolting surface-level tools onto broken operations. Deploy a unified AI intelligence layer that plans, validates, maintains, and grows your business.",
  whitelabelTiers: [
    { name: "Starter", price: "49", description: "Entry-level reseller portal with core features" },
    { name: "Professional", price: "199", description: "Full consulting engine + lead gen for growing agencies" },
    { name: "Enterprise", price: "499", description: "Multi-tenant, SSO, priority support, custom integrations" },
    { name: "Unlimited", price: "999", description: "Unlimited clients, agents, and white-label instances" },
  ],
  governorNames: {
    architect: "Omega-Praxis",
    integrity: "Lyra",
    stability: "Kael",
    acquisition: "ARAI",
  },
  enableWhitelabel: true,
  enableConsultingEngine: true,
  enableLeadEngine: true,
  enableMarketplace: true,
  consultingPriceRange: "$97 – $100K+ per engagement",
  brandColor: {
    // Base
    background:        "#0F1E3C",
    foreground:        "#F8FAFC",
    // Card
    card:              "#162040",
    cardForeground:    "#F8FAFC",
    // Popover
    popover:           "#162040",
    popoverForeground: "#F8FAFC",
    // Primary
    primary:           "#C8901A",
    primaryForeground: "#FFFFFF",
    // Secondary
    secondary:           "#1a2d54",
    secondaryForeground: "#F8FAFC",
    // Muted
    muted:           "#1a2d54",
    mutedForeground: "#94A3B8",
    // Accent
    accent:           "#C8901A",
    accentForeground: "#FFFFFF",
    // Destructive
    destructive:           "#EF4444",
    destructiveForeground: "#FFFFFF",
    // Border / Input / Ring
    border: "#1E3460",
    input:  "#1E3460",
    ring:   "#C8901A",
    // Charts
    chart1: "#C8901A",
    chart2: "#059669",
    chart3: "#3B82F6",
    chart4: "#EF4444",
    chart5: "#8B5CF6",
    // Navbar
    navbarBackground: "#FFFFFF",
    // Sidebar
    sidebarBackground:        "#0F1E3C",
    sidebarForeground:        "#F8FAFC",
    sidebarPrimary:           "#C8901A",
    sidebarPrimaryForeground: "#FFFFFF",
    sidebarAccent:            "#1a2d54",
    sidebarAccentForeground:  "#F8FAFC",
    sidebarBorder:            "#1E3460",
    sidebarRing:              "#C8901A",
  },
  font: {
    headingFont: "Inter Tight",
    textFont: "Inter",
  },
};
