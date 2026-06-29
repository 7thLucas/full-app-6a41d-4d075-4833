import { useConfigurables } from "~/modules/configurables";
import { useAuth } from "~/modules/authentication";
import { useNavigate, useLocation, Form } from "react-router";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/consulting", label: "Consulting Engine", icon: "◈" },
  { href: "/leads", label: "Lead Engine", icon: "◉" },
  { href: "/whitelabel", label: "White-Label", icon: "◎" },
  { href: "/marketplace", label: "AI Marketplace", icon: "⊛" },
  { href: "/automations", label: "Automations", icon: "⊕" },
  { href: "/analytics", label: "Analytics", icon: "▣" },
  { href: "/billing", label: "Billing", icon: "◆" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { config, loading } = useConfigurables();
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const appName = loading ? "Big II Consulting AI OS" : (config?.appName ?? "Big II Consulting AI OS");
  const footerText = config?.footerText ?? "© DBII LLC · All Rights Reserved · Powered by DBII LLC";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 flex flex-col
          bg-sidebar-background border-r border-sidebar-border
          transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-black text-xs">B2</span>
          </div>
          <div className="min-w-0">
            <p className="text-sidebar-foreground font-black text-sm tracking-tight truncate">{appName}</p>
            <p className="text-muted-foreground text-xs truncate">AI Operating System</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.href || location.pathname.startsWith(item.href + "/");
            return (
              <a
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${active
                    ? "bg-sidebar-accent text-primary border-l-2 border-primary pl-[10px]"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }
                `}
              >
                <span className={`text-base ${active ? "text-primary" : "text-muted-foreground"}`}>{item.icon}</span>
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Governors status */}
        <div className="px-4 py-4 border-t border-sidebar-border space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground px-2 mb-2">Praxis Quadrant</p>
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Omega-Praxis</span>
            <span className="ml-auto text-xs text-primary">Active</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Lyra</span>
            <span className="ml-auto text-xs text-emerald-500">Active</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Kael</span>
            <span className="ml-auto text-xs text-blue-400">Active</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">ARAI</span>
            <span className="ml-auto text-xs text-rose-400">Active</span>
          </div>
        </div>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-sm font-bold">
                {user?.username?.[0]?.toUpperCase() ?? "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.username ?? "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</p>
            </div>
            <Form method="post" action="/auth/logout">
              <button
                type="submit"
                className="text-muted-foreground hover:text-primary transition-colors text-xs uppercase tracking-widest"
                title="Sign out"
              >
                ⏻
              </button>
            </Form>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-6 py-4 bg-navbar-background border-b border-border">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
          >
            ☰
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-border bg-background">
          <p className="text-xs text-center text-muted-foreground">{footerText}</p>
        </footer>
      </div>
    </div>
  );
}
