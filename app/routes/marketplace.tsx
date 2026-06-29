import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AppLayout } from "~/components/AppLayout";
import { useConfigurables } from "~/modules/configurables";
import { useState } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  if (!getUserFromRequest(request)) return redirect("/auth/login");
  return null;
}

const MARKETPLACE_ITEMS = [
  { name: "Lead Qualification Agent", category: "Acquisition", description: "ARAI-powered lead scoring and routing agent", price: "Free", installed: true, governor: "ARAI", color: "text-rose-400" },
  { name: "Compliance Auditor", category: "Integrity", description: "Lyra-driven automated compliance scanning", price: "$29/mo", installed: true, governor: "Lyra", color: "text-emerald-500" },
  { name: "SOP Generator", category: "Consulting", description: "Generate standard operating procedures from business context", price: "Free", installed: false, governor: "Omega-Praxis", color: "text-primary" },
  { name: "Revenue Forecast Model", category: "Analytics", description: "Predictive revenue modeling with ARAI intelligence", price: "$49/mo", installed: false, governor: "ARAI", color: "text-rose-400" },
  { name: "Uptime Guardian", category: "Stability", description: "Kael-powered 24/7 system monitoring and auto-healing", price: "Free", installed: true, governor: "Kael", color: "text-blue-400" },
  { name: "Email Sequence Builder", category: "Acquisition", description: "Multi-touch email campaign automation", price: "$19/mo", installed: false, governor: "ARAI", color: "text-rose-400" },
  { name: "Blueprint Architect", category: "Strategy", description: "Omega-Praxis system design and AI hierarchy planning", price: "$99/mo", installed: false, governor: "Omega-Praxis", color: "text-primary" },
  { name: "Audit Trail Logger", category: "Integrity", description: "Immutable audit logs with Lyra verification", price: "Free", installed: true, governor: "Lyra", color: "text-emerald-500" },
];

const CATEGORIES = ["All", "Acquisition", "Integrity", "Consulting", "Analytics", "Stability", "Strategy"];

export default function MarketplacePage() {
  const { config, loading } = useConfigurables();
  const [activeCategory, setActiveCategory] = useState("All");
  const [installedItems, setInstalledItems] = useState<Set<string>>(
    new Set(MARKETPLACE_ITEMS.filter((i) => i.installed).map((i) => i.name))
  );

  const enableMarketplace = loading ? true : (config?.enableMarketplace ?? true);

  const filtered = activeCategory === "All" ? MARKETPLACE_ITEMS : MARKETPLACE_ITEMS.filter((i) => i.category === activeCategory);

  function toggleInstall(name: string) {
    setInstalledItems((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">AI Marketplace</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Agents & Automations</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse, install, and deploy pre-built agents, automations, and templates</p>
        </div>

        {!enableMarketplace && (
          <div className="bg-muted border border-border rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">The AI Marketplace is currently disabled for this instance.</p>
          </div>
        )}

        {enableMarketplace && (
          <>
            {/* Stats */}
            <div className="flex gap-4 text-sm">
              <div className="bg-card border border-border rounded-lg px-4 py-2">
                <span className="text-muted-foreground">Installed: </span>
                <span className="font-bold text-foreground">{installedItems.size}</span>
              </div>
              <div className="bg-card border border-border rounded-lg px-4 py-2">
                <span className="text-muted-foreground">Available: </span>
                <span className="font-bold text-foreground">{MARKETPLACE_ITEMS.length}</span>
              </div>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-widest transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((item, i) => {
                const installed = installedItems.has(item.name);
                return (
                  <div key={i} className="bg-card border border-border rounded-xl p-5 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className={`text-xs uppercase tracking-widest mb-1 ${item.color}`}>{item.governor}</p>
                        <h3 className="text-sm font-bold text-foreground">{item.name}</h3>
                      </div>
                      {installed && (
                        <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full flex-shrink-0">Installed</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex-1 mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{item.price}</span>
                      <button
                        onClick={() => toggleInstall(item.name)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest transition-colors ${
                          installed
                            ? "border border-border text-muted-foreground hover:border-destructive hover:text-destructive"
                            : "bg-primary text-primary-foreground hover:opacity-90"
                        }`}
                      >
                        {installed ? "Uninstall" : "Install"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
