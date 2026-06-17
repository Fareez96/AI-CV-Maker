"use client";

import React, { ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[v0] Error boundary caught:", error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null, errorCount: 0 });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="glass p-8 max-w-md w-full text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground text-sm">
              {this.state.error?.message ||
                "An unexpected error occurred. Please try again."}
            </p>
            <button
              onClick={this.reset}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
