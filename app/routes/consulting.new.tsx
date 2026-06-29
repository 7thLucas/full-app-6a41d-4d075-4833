import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AppLayout } from "~/components/AppLayout";
import { useState } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  if (!getUserFromRequest(request)) return redirect("/auth/login");
  return null;
}

export default function ConsultingNewPage() {
  const [form, setForm] = useState({ client: "", type: "Business Audit", scope: "", budget: "" });
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <AppLayout>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
              <span className="text-2xl text-emerald-500">✓</span>
            </div>
            <h2 className="text-2xl font-black text-foreground">Engagement Created</h2>
            <p className="text-sm text-muted-foreground">Omega-Praxis is analyzing the scope and preparing your initial blueprint. You'll receive deliverables within 24 hours.</p>
            <a href="/consulting" className="inline-block bg-primary text-primary-foreground font-bold px-6 py-2 rounded-lg text-sm uppercase tracking-widest hover:opacity-90 transition-opacity">
              View All Engagements
            </a>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl">
        <div className="mb-6">
          <a href="/consulting" className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">← Back</a>
          <h1 className="text-2xl font-black text-foreground tracking-tight mt-2">New Engagement</h1>
          <p className="text-sm text-muted-foreground mt-1">Start a new AI consulting engagement powered by Omega-Praxis</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Client Name</label>
            <input
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
              placeholder="Acme Corporation"
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Engagement Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Business Audit</option>
              <option>AI Roadmap</option>
              <option>SOP Package</option>
              <option>App Builder</option>
              <option>Full Consulting Retainer</option>
              <option>Execution Plan</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Engagement Scope</label>
            <textarea
              value={form.scope}
              onChange={(e) => setForm({ ...form, scope: e.target.value })}
              placeholder="Describe the client's business challenge, current pain points, and desired outcomes..."
              rows={4}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Budget Range</label>
            <select
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select budget</option>
              <option>Under $1,000</option>
              <option>$1,000 – $5,000</option>
              <option>$5,000 – $25,000</option>
              <option>$25,000 – $100,000</option>
              <option>$100,000+</option>
            </select>
          </div>
          <button
            onClick={() => setSubmitted(true)}
            disabled={!form.client || !form.scope}
            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Create Engagement
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
