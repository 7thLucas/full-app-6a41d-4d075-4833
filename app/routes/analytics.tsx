import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AppLayout } from "~/components/AppLayout";
import { useConfigurables } from "~/modules/configurables";

export async function loader({ request }: LoaderFunctionArgs) {
  if (!getUserFromRequest(request)) return redirect("/auth/login");
  return null;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MRR_DATA = [8200, 9400, 11800, 13200, 15600, 17800, 19400, 21000, 22500, 23800, 24800, 26200];
const LEADS_DATA = [18, 24, 31, 28, 42, 38, 54, 61, 49, 67, 73, 88];

export default function AnalyticsPage() {
  const { config, loading } = useConfigurables();
  const acquisitionName = loading ? "ARAI" : (config?.governorNames?.acquisition ?? "ARAI");
  const stabilityName = loading ? "Kael" : (config?.governorNames?.stability ?? "Kael");

  const maxMrr = Math.max(...MRR_DATA);
  const maxLeads = Math.max(...LEADS_DATA);

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Analytics Dashboard</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Revenue & Performance</h1>
          <p className="text-sm text-muted-foreground mt-1">AI usage, revenue, client performance, and predictive insights</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Current MRR", value: "$26,200", change: "+5.6%", up: true },
            { label: "ARR Run Rate", value: "$314K", change: "+22%", up: true },
            { label: "Avg Deal Size", value: "$18,400", change: "+9.3%", up: true },
            { label: "Churn Rate", value: "1.2%", change: "-0.4%", up: true },
          ].map((kpi, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{kpi.label}</p>
              <p className="text-2xl font-black text-foreground">{kpi.value}</p>
              <p className={`text-xs mt-1 ${kpi.up ? "text-emerald-500" : "text-destructive"}`}>{kpi.change} vs last month</p>
            </div>
          ))}
        </div>

        {/* MRR chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Revenue</p>
          <h2 className="text-sm font-bold text-foreground mb-5">MRR Growth — 12 Months</h2>
          <div className="flex items-end gap-2 h-40">
            {MRR_DATA.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-primary/80 hover:bg-primary transition-colors cursor-pointer min-h-[4px]"
                  style={{ height: `${(val / maxMrr) * 100}%` }}
                  title={`${MONTHS[i]}: $${val.toLocaleString()}`}
                />
                <span className="text-xs text-muted-foreground hidden sm:block">{MONTHS[i].slice(0, 1)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leads chart */}
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{acquisitionName}</p>
            <h2 className="text-sm font-bold text-foreground mb-5">Leads Qualified — 12 Months</h2>
            <div className="flex items-end gap-2 h-28">
              {LEADS_DATA.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-rose-500/70 hover:bg-rose-500 transition-colors cursor-pointer min-h-[4px]"
                    style={{ height: `${(val / maxLeads) * 100}%` }}
                    title={`${MONTHS[i]}: ${val}`}
                  />
                  <span className="text-xs text-muted-foreground hidden sm:block">{MONTHS[i].slice(0, 1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Usage */}
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">AI Governor Usage</p>
            <h2 className="text-sm font-bold text-foreground mb-5">Invocations This Month</h2>
            <div className="space-y-4">
              {[
                { name: "Omega-Praxis", usage: 2847, pct: 42, color: "bg-primary" },
                { name: "ARAI", usage: 1923, pct: 28, color: "bg-rose-500" },
                { name: "Lyra", usage: 1204, pct: 18, color: "bg-emerald-500" },
                { name: "Kael", usage: 802, pct: 12, color: "bg-blue-400" },
              ].map((gov, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{gov.name}</span>
                    <span className="text-foreground font-medium">{gov.usage.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${gov.color} rounded-full`} style={{ width: `${gov.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Predictive insights */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{acquisitionName} · Predictive</p>
          <h2 className="text-sm font-bold text-foreground mb-4">Revenue Forecasts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="governor-arai-bg rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Q3 2026</p>
              <p className="text-xl font-black text-rose-400">$94K</p>
              <p className="text-xs text-muted-foreground mt-1">+18% vs Q2 · High confidence</p>
            </div>
            <div className="governor-arai-bg rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Q4 2026</p>
              <p className="text-xl font-black text-rose-400">$118K</p>
              <p className="text-xs text-muted-foreground mt-1">+25% vs Q3 · Moderate confidence</p>
            </div>
            <div className="governor-arai-bg rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">FY 2026 ARR</p>
              <p className="text-xl font-black text-rose-400">$385K</p>
              <p className="text-xs text-muted-foreground mt-1">Projected run rate · ARAI forecast</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
