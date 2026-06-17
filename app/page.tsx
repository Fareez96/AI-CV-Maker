import { ErrorBoundary } from "@/components/error-boundary";
import { Suspense } from "react";
import DashboardContent from "@/components/dashboard-content";

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
        <DashboardContent />
      </Suspense>
    </ErrorBoundary>
  );
}
