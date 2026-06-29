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

const TIERS = [
  { name: "Starter", price: "$49/mo", features: ["1 branded portal", "Up to 10 clients", "Core AI governors", "PayPal billing"] },
  { name: "Professional", price: "$199/mo", features: ["5 branded portals", "Up to 50 clients", "Full consulting engine", "Lead gen module", "Custom domain"] },
  { name: "Enterprise", price: "$499/mo", features: ["20 branded portals", "Unlimited clients", "SSO/SAML", "Priority support", "Custom integrations"] },
  { name: "Unlimited", price: "$999/mo", features: ["Unlimited portals", "Unlimited clients", "All features", "Dedicated success manager", "White-glove onboarding"] },
];

const MOCK_RESELLERS = [
  { name: "Apex Consulting Co.", domain: "apex-ai.app", tier: "Professional", status: "Live", clients: 23, mrr: "$4,800" },
  { name: "Summit Agency AI", domain: "summitagency.io", tier: "Enterprise", status: "Live", clients: 61, mrr: "$14,200" },
  { name: "BluePeak Solutions", domain: "bluepeak.ai", tier: "Starter", status: "Setup", clients: 4, mrr: "$980" },
];

function OnboardingWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    brandName: "", domain: "", primaryColor: "#2563eb", aiName: "", tier: "Professional", paypalConnected: false,
  });

  const totalSteps = 4;

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">White-Label Wizard</p>
            <h2 className="text-lg font-black text-foreground">New Reseller Portal</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">✕</button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <div className="flex gap-2 mb-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i + 1 <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Step {step} of {totalSteps}</p>
        </div>

        {/* Step content */}
        <div className="px-6 py-5 space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-foreground">Brand Setup</h3>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Brand Name</label>
                <input
                  value={form.brandName}
                  onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  placeholder="Apex Consulting Co."
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Custom Domain</label>
                <input
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  placeholder="yourapp.ai"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">AI Governor Name</label>
                <input
                  value={form.aiName}
                  onChange={(e) => setForm({ ...form, aiName: e.target.value })}
                  placeholder="e.g. ARIA, NOVA, ZETA"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Brand Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.primaryColor}
                    onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                    className="h-10 w-16 rounded border border-border bg-background cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground">{form.primaryColor}</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-foreground">Select Tier</h3>
              <div className="space-y-2">
                {TIERS.map((tier) => (
                  <button
                    key={tier.name}
                    onClick={() => setForm({ ...form, tier: tier.name })}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      form.tier === tier.name ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">{tier.name}</span>
                      <span className={`text-sm font-black ${form.tier === tier.name ? "text-primary" : "text-muted-foreground"}`}>{tier.price}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                      {tier.features.map((f) => (
                        <span key={f} className="text-xs text-muted-foreground">• {f}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-foreground">Connect PayPal</h3>
              <p className="text-sm text-muted-foreground">Connect a PayPal Business account to receive payments from clients under this branded portal.</p>
              <div className="bg-background border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-black text-sm">P</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">PayPal Business</p>
                    <p className="text-xs text-muted-foreground">Subscription + usage billing</p>
                  </div>
                </div>
                {form.paypalConnected ? (
                  <div className="flex items-center gap-2 text-emerald-500 text-sm">
                    <span>✓</span>
                    <span>PayPal connected successfully</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setForm({ ...form, paypalConnected: true })}
                    className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Connect PayPal Account
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-foreground">Portal Preview</h3>
              <div className="bg-background border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: form.primaryColor }} />
                  <div>
                    <p className="text-sm font-bold text-foreground">{form.brandName || "Your Brand"}</p>
                    <p className="text-xs text-muted-foreground">{form.domain || "yourbrand.ai"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-card rounded-lg p-2">
                    <p className="text-muted-foreground">Tier</p>
                    <p className="text-foreground font-bold">{form.tier}</p>
                  </div>
                  <div className="bg-card rounded-lg p-2">
                    <p className="text-muted-foreground">AI Name</p>
                    <p className="text-foreground font-bold">{form.aiName || "AI Governor"}</p>
                  </div>
                  <div className="bg-card rounded-lg p-2">
                    <p className="text-muted-foreground">PayPal</p>
                    <p className={form.paypalConnected ? "text-emerald-500 font-bold" : "text-destructive font-bold"}>
                      {form.paypalConnected ? "Connected" : "Not connected"}
                    </p>
                  </div>
                  <div className="bg-card rounded-lg p-2">
                    <p className="text-muted-foreground">Status</p>
                    <p className="text-primary font-bold">Ready to deploy</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Your reseller portal will be live within minutes. No dev work. No technical setup.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {step > 1 ? "Back" : "Cancel"}
          </button>
          <button
            onClick={() => {
              if (step < totalSteps) setStep(step + 1);
              else onClose();
            }}
            className="bg-primary text-primary-foreground font-bold px-6 py-2 rounded-lg text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            {step === totalSteps ? "Go Live" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WhitelabelPage() {
  const { config, loading } = useConfigurables();
  const [showWizard, setShowWizard] = useState(false);

  const tiers = loading ? TIERS.map((t) => ({ name: t.name, price: t.price.replace("$", "").replace("/mo", ""), description: t.features.join(", ") }))
    : (config?.whitelabelTiers ?? TIERS.map((t) => ({ name: t.name, price: t.price.replace("$", "").replace("/mo", ""), description: t.features.join(", ") })));

  return (
    <AppLayout>
      {showWizard && <OnboardingWizard onClose={() => setShowWizard(false)} />}
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">White-Label System</p>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Reseller Portals</h1>
            <p className="text-sm text-muted-foreground mt-1">Deploy branded AI operating system instances for resellers — minutes, not months</p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex-shrink-0"
          >
            + New Reseller
          </button>
        </div>

        {/* Active resellers */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">Active Portals</h2>
          </div>
          <div className="divide-y divide-border">
            {MOCK_RESELLERS.map((reseller, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-black text-xs">{reseller.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{reseller.name}</p>
                  <p className="text-xs text-muted-foreground">{reseller.domain}</p>
                </div>
                <div className="hidden md:flex items-center gap-6 text-xs">
                  <div>
                    <p className="text-muted-foreground">Tier</p>
                    <p className="text-foreground font-medium">{reseller.tier}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Clients</p>
                    <p className="text-foreground font-medium">{reseller.clients}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">MRR</p>
                    <p className="text-foreground font-medium">{reseller.mrr}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  reseller.status === "Live" ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                }`}>
                  {reseller.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tiers */}
        <div>
          <h2 className="text-sm font-bold text-foreground mb-4">Wholesale Tiers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((tier, i) => (
              <div key={i} className={`rounded-xl border p-4 ${i === 2 ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{tier.name}</p>
                <p className="text-2xl font-black text-foreground">${tier.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                {tier.description && <p className="text-xs text-muted-foreground mt-2">{tier.description}</p>}
                <button className={`w-full mt-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-opacity ${
                  i === 2 ? "bg-primary text-primary-foreground hover:opacity-90" : "border border-border text-foreground hover:border-primary"
                }`}>
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
