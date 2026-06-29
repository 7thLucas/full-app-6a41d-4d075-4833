import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { useLoaderData, useActionData } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/dashboard");
  const token = new URL(request.url).searchParams.get("token");
  if (!token) return redirect("/auth/forgot-password");
  return { token };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try {
    await AuthService.resetPassword({
      token: String(formData.get("token") ?? ""),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    });
    return redirect("/auth/login");
  } catch (error: any) {
    return { error: error.message ?? "Reset failed. The link may have expired." };
  }
}

export default function ResetPasswordRoute() {
  const loaderData = useLoaderData<{ token: string }>();
  const actionData = useActionData<{ error?: string }>();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-sm">B2</span>
          </div>
          <span className="text-foreground font-black text-lg tracking-tight">Big II Consulting AI OS</span>
        </div>

        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">New password</h1>
          <p className="mt-2 text-sm text-muted-foreground">Choose a strong password for your account</p>
        </div>

        {actionData?.error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 text-sm text-destructive">
            {actionData.error}
          </div>
        )}

        <form method="post" className="space-y-4">
          <input type="hidden" name="token" value={loaderData?.token ?? ""} />
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">New Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Confirm Password</label>
            <input
              name="confirmPassword"
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
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
