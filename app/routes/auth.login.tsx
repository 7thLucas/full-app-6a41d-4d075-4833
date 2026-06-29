import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getUserFromRequest, signJwt, buildAuthCookie } from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { useConfigurables } from "~/modules/configurables";
import { GoogleLoginButton } from "~/modules/authentication-google";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/dashboard");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try {
    const user = await AuthService.login({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    const token = signJwt({ sub: user.id, role: user.role, username: user.username, email: user.email });
    return redirect("/dashboard", { headers: { "Set-Cookie": buildAuthCookie(token, new URL(request.url).hostname) } });
  } catch (error: any) {
    return { error: error.message ?? "Invalid credentials" };
  }
}

export default function LoginRoute() {
  const { config, loading } = useConfigurables();
  const appName = loading ? "Big II Consulting AI OS" : (config?.appName ?? "Big II Consulting AI OS");
  const tagline = loading ? "The Consulting AI Operating System" : (config?.tagline ?? "The Consulting AI Operating System");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-card flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, var(--primary) 0%, transparent 60%), radial-gradient(circle at 80% 20%, #3B82F6 0%, transparent 50%)" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-sm">B2</span>
            </div>
            <span className="text-foreground font-black text-lg tracking-tight">{appName}</span>
          </div>
          <div className="space-y-6">
            <div className="governor-praxis-bg rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Omega-Praxis</p>
              <p className="text-sm text-foreground">Architect Intelligence — governing system logic and AI hierarchy</p>
            </div>
            <div className="governor-lyra-bg rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Lyra</p>
              <p className="text-sm text-foreground">Integrity Intelligence — compliance and audit trails</p>
            </div>
            <div className="governor-kael-bg rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Kael</p>
              <p className="text-sm text-foreground">Stability Intelligence — uptime and self-healing pipelines</p>
            </div>
            <div className="governor-arai-bg rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">ARAI</p>
              <p className="text-sm text-foreground">Acquisition Intelligence — lead gen and revenue expansion</p>
            </div>
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-xs text-muted-foreground">{tagline}</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-sm">B2</span>
            </div>
            <span className="text-foreground font-black text-lg tracking-tight">{appName}</span>
          </div>

          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Sign in</h1>
            <p className="mt-2 text-sm text-muted-foreground">Access your AI operating system</p>
          </div>

          <GoogleLoginButton redirectTo="/dashboard" label="Continue with Google" />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground tracking-widest">or</span>
            </div>
          </div>

          <form method="post" className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          </form>

          <div className="flex items-center justify-between text-sm">
            <a href="/auth/forgot-password" className="text-muted-foreground hover:text-primary transition-colors">
              Forgot password?
            </a>
            <a href="/auth/register" className="text-primary font-medium hover:opacity-80 transition-opacity">
              Create account
            </a>
          </div>

          <p className="text-center text-xs text-muted-foreground border-t border-border pt-6">
            {config?.footerText ?? "© DBII LLC · All Rights Reserved · Powered by DBII LLC"}
          </p>
        </div>
      </div>
    </div>
  );
}
