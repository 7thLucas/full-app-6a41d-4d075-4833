import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AppLayout } from "~/components/AppLayout";
import { useConfigurables } from "~/modules/configurables";

export async function loader({ request }: LoaderFunctionArgs) {
  if (!getUserFromRequest(request)) return redirect("/auth/login");
  return null;
}

const INVOICES = [
  { id: "INV-2026-0047", date: "Jun 1, 2026", amount: "$999.00", status: "Paid", tier: "Unlimited" },
  { id: "INV-2026-0038", date: "May 1, 2026", amount: "$999.00", status: "Paid", tier: "Unlimited" },
  { id: "INV-2026-0029", date: "Apr 1, 2026", amount: "$499.00", status: "Paid", tier: "Enterprise" },
  { id: "INV-2026-0021", date: "Mar 1, 2026", amount: "$499.00", status: "Paid", tier: "Enterprise" },
  { id: "INV-2026-0014", date: "Feb 1, 2026", amount: "$199.00", status: "Paid", tier: "Professional" },
];

export default function BillingPage() {
  const { config, loading } = useConfigurables();
  const tiers = loading ? [] : (config?.whitelabelTiers ?? []);

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Billing</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Subscription & Billing</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your plan, usage, and payment history via PayPal</p>
        </div>

        {/* Current plan */}
        <div className="bg-card border border-primary/30 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Current Plan</p>
              <h2 className="text-2xl font-black text-foreground">Unlimited</h2>
              <p className="text-3xl font-black text-primary mt-1">$999<span className="text-base font-normal text-muted-foreground">/month</span></p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-emerald-500 font-medium">Active</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Unlimited portals", "Unlimited clients", "All governors", "Priority support"].map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-emerald-500">✓</span>
                {feat}
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
              Manage via PayPal
            </button>
            <button className="border border-border text-foreground font-medium px-4 py-2 rounded-lg text-xs uppercase tracking-widest hover:border-primary transition-colors">
              Downgrade Plan
            </button>
          </div>
        </div>

        {/* Usage */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Usage</p>
          <h2 className="text-sm font-bold text-foreground mb-4">This Billing Cycle</h2>
          <div className="space-y-3">
            {[
              { label: "AI Invocations", used: 6776, limit: "Unlimited", pct: 68 },
              { label: "Active Reseller Portals", used: 7, limit: "Unlimited", pct: 35 },
              { label: "Client Accounts", used: 38, limit: "Unlimited", pct: 20 },
              { label: "Automations", used: 6, limit: "Unlimited", pct: 30 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-foreground font-medium">{item.used.toLocaleString()} / {item.limit}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Payment Method</p>
          <h2 className="text-sm font-bold text-foreground mb-4">PayPal Business</h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">P</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">PayPal · christopher@dbii.llc</p>
              <p className="text-xs text-muted-foreground">Next billing: July 1, 2026</p>
            </div>
            <button className="ml-auto text-xs text-primary hover:opacity-80 transition-opacity uppercase tracking-widest">
              Update
            </button>
          </div>
        </div>

        {/* Invoice history */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">Invoice History</h2>
          </div>
          <div className="divide-y divide-border">
            {INVOICES.map((inv, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{inv.id}</p>
                  <p className="text-xs text-muted-foreground">{inv.date} · {inv.tier}</p>
                </div>
                <span className="text-sm font-bold text-foreground">{inv.amount}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                  {inv.status}
                </span>
                <button className="text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                  PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
