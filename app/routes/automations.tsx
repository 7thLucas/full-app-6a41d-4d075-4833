import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AppLayout } from "~/components/AppLayout";
import { useState } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  if (!getUserFromRequest(request)) return redirect("/auth/login");
  return null;
}

const AUTOMATIONS = [
  { name: "New Lead → ARAI Qualification", trigger: "Lead created", action: "Score & route lead", status: "Active", runs: 247, governor: "ARAI" },
  { name: "Engagement Closed → Invoice", trigger: "Engagement status = Closed", action: "Generate & send PayPal invoice", status: "Active", runs: 38, governor: "Omega-Praxis" },
  { name: "Weekly Compliance Scan", trigger: "Every Monday 06:00 UTC", action: "Run Lyra audit report", status: "Active", runs: 12, governor: "Lyra" },
  { name: "System Alert → Kael Heal", trigger: "CPU > 85% for 5min", action: "Scale & restart pipeline", status: "Active", runs: 4, governor: "Kael" },
  { name: "New Reseller → Welcome Email", trigger: "Reseller portal created", action: "Send onboarding sequence", status: "Paused", runs: 7, governor: "ARAI" },
  { name: "Lead Score < 30 → Archive", trigger: "Lead score updated", action: "Archive & tag cold", status: "Active", runs: 89, governor: "ARAI" },
];

export default function AutomationsPage() {
  const [automations, setAutomations] = useState(AUTOMATIONS);

  function toggleStatus(index: number) {
    setAutomations((prev) =>
      prev.map((a, i) => i === index ? { ...a, status: a.status === "Active" ? "Paused" : "Active" } : a)
    );
  }

  const governorColor = (g: string) => {
    if (g === "ARAI") return "text-rose-400";
    if (g === "Lyra") return "text-emerald-500";
    if (g === "Kael") return "text-blue-400";
    return "text-primary";
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Automation System</p>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Automations</h1>
            <p className="text-sm text-muted-foreground mt-1">Trigger-based, scheduled, conditional, cross-agent pipelines</p>
          </div>
          <button className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex-shrink-0">
            + New Automation
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Active</p>
            <p className="text-2xl font-black text-emerald-500">{automations.filter((a) => a.status === "Active").length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Total Runs</p>
            <p className="text-2xl font-black text-foreground">{automations.reduce((s, a) => s + a.runs, 0)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Paused</p>
            <p className="text-2xl font-black text-muted-foreground">{automations.filter((a) => a.status === "Paused").length}</p>
          </div>
        </div>

        {/* Automation list */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">All Automations</h2>
          </div>
          <div className="divide-y divide-border">
            {automations.map((auto, i) => (
              <div key={i} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs uppercase tracking-widest ${governorColor(auto.governor)}`}>{auto.governor}</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{auto.name}</p>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                      <span><strong>Trigger:</strong> {auto.trigger}</span>
                      <span className="hidden md:inline">→</span>
                      <span className="hidden md:inline"><strong>Action:</strong> {auto.action}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right text-xs">
                      <p className="text-muted-foreground">Runs</p>
                      <p className="text-foreground font-bold">{auto.runs}</p>
                    </div>
                    <button
                      onClick={() => toggleStatus(i)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        auto.status === "Active" ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                        auto.status === "Active" ? "translate-x-4.5" : "translate-x-1"
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trigger types */}
        <div>
          <h2 className="text-sm font-bold text-foreground mb-4">Trigger Types</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: "Trigger-Based", desc: "Event-driven actions on data changes", icon: "⚡" },
              { type: "Scheduled", desc: "Cron-style recurring automations", icon: "◷" },
              { type: "Conditional", desc: "If/then logic with rule chains", icon: "◊" },
              { type: "Cross-Agent", desc: "Multi-governor collaborative pipelines", icon: "⊛" },
            ].map((t, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4">
                <span className="text-xl text-primary">{t.icon}</span>
                <p className="text-xs font-bold text-foreground mt-2">{t.type}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
