import AuthForm from "@/components/auth-form";
import { Suspense } from "react";
import SignInContent from "@/components/sign-in-content";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/30 flex items-center justify-center p-4">
      <Suspense fallback={<div className="w-full max-w-md glass p-8">Loading...</div>}>
        <SignInContent />
      </Suspense>
    </div>
  );
}
