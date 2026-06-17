"use server";

import { auth } from "@/lib/auth";
import Dashboard from "@/components/dashboard";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function DashboardContent() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  return <Dashboard user={session.user} />;
}
