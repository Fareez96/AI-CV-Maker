import { auth } from "@/lib/auth";
import AuthForm from "@/components/auth-form";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function SignUpPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) redirect("/");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">CV Maker</h1>
            <p className="text-muted-foreground">
              Create your account to get started
            </p>
          </div>

          <AuthForm mode="sign-up" />

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/sign-in" className="text-primary hover:underline">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
