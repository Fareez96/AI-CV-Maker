"use server";

import { auth } from "@/lib/auth";
import AuthForm from "@/components/auth-form";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function SignInContent() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) redirect("/");

  return (
    <div className="w-full max-w-md">
      <div className="glass p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">CV Maker</h1>
          <p className="text-muted-foreground">
            Optimize your resume with AI
          </p>
        </div>

        <AuthForm mode="sign-in" />

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a href="/sign-up" className="text-primary hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
