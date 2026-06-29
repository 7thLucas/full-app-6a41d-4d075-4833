import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AppLayout } from "~/components/AppLayout";
import { useAuth } from "~/modules/authentication";
import { useConfigurables } from "~/modules/configurables";
import { useState } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  if (!getUserFromRequest(request)) return redirect("/auth/login");
  return null;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { config, loading } = useConfigurables();
  const [activeTab, setActiveTab] = useState("account");

  const tabs = ["account", "team", "integrations", "api"];
  const appName = loading ? "Big II Consulting AI OS" : (config?.appName ?? "Big II Consulting AI OS");

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Settings</p>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account, team, integrations, and API access</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs uppercase tracking-widest font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Account tab */}
        {activeTab === "account" && (
          <div className="space-y-4 max-w-lg">
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-foreground">Account Details</h2>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Username</label>
                <input
                  defaultValue={user?.username ?? ""}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email</label>
                <input
                  defaultValue={user?.email ?? ""}
                  type="email"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                Save Changes
              </button>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-foreground">Change Password</h2>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button className="border border-border text-foreground font-medium px-4 py-2 rounded-lg text-xs uppercase tracking-widest hover:border-primary transition-colors">
                Update Password
              </button>
            </div>
          </div>
        )}

        {/* Team tab */}
        {activeTab === "team" && (
          <div className="space-y-4 max-w-2xl">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-sm font-bold text-foreground">Team Members</h2>
                <button className="bg-primary text-primary-foreground font-bold px-3 py-1.5 rounded-lg text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                  Invite
                </button>
              </div>
              <div className="divide-y divide-border">
                {[
                  { name: "Christopher Burress", email: "chris@dbii.llc", role: "Admin", you: true },
                  { name: "Team Member", email: "team@dbii.llc", role: "Member", you: false },
                ].map((member, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary text-sm font-bold">{member.name[0]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{member.name} {member.you && <span className="text-xs text-muted-foreground">(you)</span>}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${member.role === "Admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Integrations tab */}
        {activeTab === "integrations" && (
          <div className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Google OAuth", desc: "Single sign-on via Google", connected: true, icon: "G" },
                { name: "PayPal Business", desc: "Subscription & invoice billing", connected: true, icon: "P" },
                { name: "Slack", desc: "Team notifications & alerts", connected: false, icon: "S" },
                { name: "Zapier", desc: "Third-party workflow automation", connected: false, icon: "Z" },
                { name: "Salesforce", desc: "CRM data sync", connected: false, icon: "SF" },
                { name: "SMTP Email", desc: "Transactional email delivery", connected: true, icon: "@" },
              ].map((int, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-foreground font-black text-sm">{int.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{int.name}</p>
                    <p className="text-xs text-muted-foreground">{int.desc}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    int.connected ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                  }`}>
                    {int.connected ? "Connected" : "Connect"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API tab */}
        {activeTab === "api" && (
          <div className="space-y-4 max-w-2xl">
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-foreground">API Keys</h2>
              <p className="text-xs text-muted-foreground">Use these keys to integrate {appName} with external systems. Keep them secret — they provide full API access.</p>
              <div className="space-y-3">
                {[
                  { name: "Production Key", key: "b2ai_live_••••••••••••••••••••••••••5a3f", created: "Jan 12, 2026" },
                  { name: "Development Key", key: "b2ai_test_••••••••••••••••••••••••••9d2e", created: "Mar 8, 2026" },
                ].map((k, i) => (
                  <div key={i} className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-foreground">{k.name}</p>
                      <button className="text-xs text-destructive uppercase tracking-widest hover:opacity-80">Revoke</button>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground">{k.key}</p>
                    <p className="text-xs text-muted-foreground mt-1">Created {k.created}</p>
                  </div>
                ))}
              </div>
              <button className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                Generate New Key
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
