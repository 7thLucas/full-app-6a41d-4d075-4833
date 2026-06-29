import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { useActionData } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/dashboard");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try { await AuthService.forgotPassword(String(formData.get("email") ?? "")); } catch {}
  return { success: true, message: "If that email exists, a reset link has been sent. Check your inbox." };
}

export default function ForgotPasswordRoute() {
  const actionData = useActionData<{ success?: boolean; message?: string }>();

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
          <h1 className="text-3xl font-black text-foreground tracking-tight">Reset password</h1>
          <p className="mt-2 text-sm text-muted-foreground">We'll send a reset link to your email</p>
        </div>

        {actionData?.success && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 text-sm text-foreground">
            {actionData.message}
          </div>
        )}

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
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          <a href="/auth/login" className="text-primary font-medium hover:opacity-80 transition-opacity">
            Back to sign in
          </a>
        </p>
      </div>
    </div>
  );
}
