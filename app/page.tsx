import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Dashboard from "@/components/dashboard";
import { ErrorBoundary } from "@/components/error-boundary";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  return (
    <ErrorBoundary>
      <Dashboard user={session.user} />
    </ErrorBoundary>
  );
}
