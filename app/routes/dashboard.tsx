import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AppLayout } from "~/components/AppLayout";
import { useConfigurables } from "~/modules/configurables";

export async function loader({ request }: LoaderFunctionArgs) {
  if (!getUserFromRequest(request)) return redirect("/auth/login");
  return null;
}

const ACTIVITY_FEED = [
  { governor: "Omega-Praxis", color: "governor-praxis", event: "Blueprint generated for Enterprise SaaS onboarding", time: "2m ago" },
  { governor: "Lyra", color: "governor-lyra", event: "Audit trail verified — 47 integrity checks passed", time: "5m ago" },
  { governor: "ARAI", color: "governor-arai", event: "12 new leads qualified via LinkedIn outreach", time: "8m ago" },
  { governor: "Kael", color: "governor-kael", event: "Pipeline auto-healed after memory pressure event", time: "14m ago" },
  { governor: "Omega-Praxis", color: "governor-praxis", event: "SOPs drafted for client onboarding workflow", time: "22m ago" },
  { governor: "Lyra", color: "governor-lyra", event: "Compliance scan completed — 0 violations detected", time: "31m ago" },
  { governor: "ARAI", color: "governor-arai", event: "Revenue forecast updated: +18% Q3 projection", time: "45m ago" },
];

const INTEGRITY_ALERTS = [
  { level: "info", message: "47 integrity checks passed in the last hour", color: "text-emerald-500" },
  { level: "warning", message: "1 API key nearing expiry in 3 days", color: "text-primary" },
  { level: "info", message: "Compliance scan scheduled for 00:00 UTC", color: "text-muted-foreground" },
];

export default function DashboardPage() {
  const { config, loading } = useConfigurables();

  const governorNames = loading ? null : config?.governorNames;
  const architectName = governorNames?.architect ?? "Omega-Praxis";
  const integrityName = governorNames?.integrity ?? "Lyra";
  const stabilityName = governorNames?.stability ?? "Kael";
  const acquisitionName = governorNames?.acquisition ?? "ARAI";

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Page header */}
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Control Room</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Your sovereign AI operating system — live intelligence across all governors</p>
        </div>

        {/* Governor status cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="governor-praxis-bg rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{architectName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Architect Intelligence</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-primary mt-1" />
            </div>
            <p className="text-2xl font-black text-primary">99.7%</p>
            <p className="text-xs text-muted-foreground mt-1">Blueprint accuracy</p>
          </div>

          <div className="governor-lyra-bg rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{integrityName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Integrity Intelligence</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1" />
            </div>
            <p className="text-2xl font-black text-emerald-500">47</p>
            <p className="text-xs text-muted-foreground mt-1">Checks passed today</p>
          </div>

          <div className="governor-kael-bg rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{stabilityName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Stability Intelligence</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-blue-400 mt-1" />
            </div>
            <p className="text-2xl font-black text-blue-400">100%</p>
            <p className="text-xs text-muted-foreground mt-1">System uptime</p>
          </div>

          <div className="governor-arai-bg rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{acquisitionName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Acquisition Intelligence</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-rose-400 mt-1" />
            </div>
            <p className="text-2xl font-black text-rose-400">12</p>
            <p className="text-xs text-muted-foreground mt-1">Leads qualified today</p>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Activity Feed */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Live Feed</p>
                <h2 className="text-sm font-bold text-foreground">AI Activity</h2>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <div className="space-y-3">
              {ACTIVITY_FEED.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    item.color === "governor-praxis" ? "bg-primary" :
                    item.color === "governor-lyra" ? "bg-emerald-500" :
                    item.color === "governor-kael" ? "bg-blue-400" : "bg-rose-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{item.governor}</p>
                    <p className="text-sm text-foreground mt-0.5">{item.event}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Revenue Snapshot */}
            <div className="bg-card rounded-xl border border-border p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Revenue</p>
              <h2 className="text-sm font-bold text-foreground mb-4">Snapshot</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>MRR</span>
                    <span className="text-foreground font-medium">$24,800</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "68%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Active Clients</span>
                    <span className="text-foreground font-medium">38</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "76%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Pipeline Value</span>
                    <span className="text-foreground font-medium">$186K</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full" style={{ width: "42%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Resellers Active</span>
                    <span className="text-foreground font-medium">7</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: "35%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Integrity Alerts */}
            <div className="bg-card rounded-xl border border-border p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{integrityName}</p>
              <h2 className="text-sm font-bold text-foreground mb-4">Integrity Alerts</h2>
              <div className="space-y-3">
                {INTEGRITY_ALERTS.map((alert, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className={`text-sm mt-0.5 ${alert.color}`}>
                      {alert.level === "warning" ? "⚠" : "✓"}
                    </span>
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-card rounded-xl border border-border p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{stabilityName}</p>
              <h2 className="text-sm font-bold text-foreground mb-4">System Health</h2>
              <div className="space-y-2">
                {[
                  { label: "API Gateway", status: "Operational", ok: true },
                  { label: "Agent Runtime", status: "Operational", ok: true },
                  { label: "Webhook Relay", status: "Operational", ok: true },
                  { label: "DB Cluster", status: "Operational", ok: true },
                ].map((svc, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{svc.label}</span>
                    <span className={`flex items-center gap-1 ${svc.ok ? "text-emerald-500" : "text-destructive"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {svc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/consulting/new" className="bg-card border border-border hover:border-primary rounded-xl p-4 flex items-center gap-3 transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <span className="text-primary text-sm">◈</span>
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">New Engagement</p>
              <p className="text-xs text-muted-foreground">Start consulting</p>
            </div>
          </a>
          <a href="/whitelabel/new" className="bg-card border border-border hover:border-primary rounded-xl p-4 flex items-center gap-3 transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <span className="text-primary text-sm">◎</span>
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">New Reseller</p>
              <p className="text-xs text-muted-foreground">Onboard brand</p>
            </div>
          </a>
          <a href="/leads" className="bg-card border border-border hover:border-primary rounded-xl p-4 flex items-center gap-3 transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-rose-400/10 flex items-center justify-center group-hover:bg-rose-400/20 transition-colors">
              <span className="text-rose-400 text-sm">◉</span>
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Lead Pipeline</p>
              <p className="text-xs text-muted-foreground">ARAI outreach</p>
            </div>
          </a>
          <a href="/analytics" className="bg-card border border-border hover:border-primary rounded-xl p-4 flex items-center gap-3 transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center group-hover:bg-blue-400/20 transition-colors">
              <span className="text-blue-400 text-sm">▣</span>
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Analytics</p>
              <p className="text-xs text-muted-foreground">Revenue insights</p>
            </div>
          </a>
        </div>
      </div>
    </AppLayout>
  );
}
