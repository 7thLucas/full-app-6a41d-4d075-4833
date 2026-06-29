import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getUserFromRequest, signJwt, buildAuthCookie } from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { useActionData } from "react-router";
import { useConfigurables } from "~/modules/configurables";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/dashboard");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try {
    const user = await AuthService.register({
      username: String(formData.get("username") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    const token = signJwt({ sub: user.id, role: user.role, username: user.username, email: user.email });
    return redirect("/dashboard", { headers: { "Set-Cookie": buildAuthCookie(token, new URL(request.url).hostname) } });
  } catch (error: any) {
    return { error: error.message ?? "Registration failed" };
  }
}

export default function RegisterRoute() {
  const actionData = useActionData<{ error?: string }>();
  const { config, loading } = useConfigurables();
  const appName = loading ? "Big II Consulting AI OS" : (config?.appName ?? "Big II Consulting AI OS");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-sm">B2</span>
          </div>
          <span className="text-foreground font-black text-lg tracking-tight">{appName}</span>
        </div>

        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Join the AI operating system</p>
        </div>

        {actionData?.error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 text-sm text-destructive">
            {actionData.error}
          </div>
        )}

        <form method="post" className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Username</label>
            <input
              name="username"
              type="text"
              required
              placeholder="yourname"
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
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
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/auth/login" className="text-primary font-medium hover:opacity-80 transition-opacity">
            Sign in
          </a>
        </p>

        <p className="text-center text-xs text-muted-foreground border-t border-border pt-6">
          {config?.footerText ?? "© DBII LLC · All Rights Reserved · Powered by DBII LLC"}
        </p>
      </div>
    </div>
  );
}
