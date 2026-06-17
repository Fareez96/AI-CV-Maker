"use client";

import { useCallback, useState, useEffect } from "react";
import {
  uploadCV,
  getCVs,
  optimizeCV_Action,
  getOptimizations,
  deleteCV,
} from "@/app/actions/cv";
import { authClient } from "@/lib/auth-client";
import CVUploadForm from "./cv-upload-form";
import CVList from "./cv-list";
import OptimizationResult from "./optimization-result";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { retryWithBackoff, handleError } from "@/lib/error-utils";

interface CV {
  id: string;
  title: string;
  fileType: string;
  createdAt: Date;
}

interface Optimization {
  id: string;
  optimizedContent: string;
  atsScore: string;
  keywords: string;
  suggestions: string;
  createdAt: Date;
}

export default function Dashboard({ user }: { user: { name?: string; email: string } }) {
  const router = useRouter();
  const [cvs, setCVs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCV, setSelectedCV] = useState<string | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizations, setOptimizations] = useState<Optimization[]>([]);
  const [selectedOptimization, setSelectedOptimization] = useState<Optimization | null>(null);

  // Load CVs on mount
  useEffect(() => {
    loadCVs();
  }, []);

  const loadCVs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await retryWithBackoff(() => getCVs());
      setCVs(data || []);
    } catch (err) {
      setError(handleError(err));
      console.error("[v0] Failed to load CVs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCVUpload = useCallback(
    async (title: string, content: string, fileType: string) => {
      try {
        setError(null);
        await retryWithBackoff(() =>
          uploadCV(title, content, fileType)
        );
        await loadCVs();
      } catch (err) {
        setError(handleError(err));
        console.error("[v0] Upload failed:", err);
      }
    },
    []
  );

  const handleOptimize = async (jobDescription: string) => {
    if (!selectedCV || !jobDescription.trim()) {
      setError("Please select a CV and enter a job description");
      return;
    }

    try {
      setOptimizing(true);
      setError(null);
      const result = await optimizeCV_Action(selectedCV, jobDescription);
      setSelectedOptimization({
        id: result.optimizationId,
        optimizedContent: result.optimizedContent,
        atsScore: result.atsScore.toString(),
        keywords: result.keywords || "",
        suggestions: result.suggestions || "",
        createdAt: new Date(),
      });
    } catch (err) {
      setError(handleError(err));
      console.error("[v0] Optimization failed:", err);
    } finally {
      setOptimizing(false);
    }
  };

  const handleDeleteCV = async (cvId: string) => {
    try {
      setError(null);
      await retryWithBackoff(() => deleteCV(cvId));
      await loadCVs();
      if (selectedCV === cvId) {
        setSelectedCV(null);
        setSelectedOptimization(null);
      }
    } catch (err) {
      setError(handleError(err));
      console.error("[v0] Delete failed:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/sign-in");
      router.refresh();
    } catch (err) {
      console.error("[v0] Sign out error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/30">
      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">CV Maker</h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {user.name || user.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="btn-ghost text-sm"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Error</p>
              <p className="text-sm text-red-200">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-xs mt-2 underline hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Upload & CV List */}
          <div className="lg:col-span-1 space-y-6">
            <CVUploadForm onUpload={handleCVUpload} />

            {loading ? (
              <div className="glass p-6 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Loading CVs...</p>
              </div>
            ) : (
              <CVList
                cvs={cvs}
                selectedCV={selectedCV}
                onSelect={setSelectedCV}
                onDelete={handleDeleteCV}
              />
            )}
          </div>

          {/* Right: Optimizer */}
          <div className="lg:col-span-2">
            {selectedOptimization ? (
              <OptimizationResult
                optimization={selectedOptimization}
                onNewOptimization={() => setSelectedOptimization(null)}
              />
            ) : (
              <div className="glass p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Optimize Your CV</h2>
                  <p className="text-muted-foreground text-sm">
                    Paste a job description to get AI-powered optimization and ATS
                    scoring
                  </p>
                </div>

                {!selectedCV ? (
                  <div className="p-6 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center">
                    <p className="text-sm text-blue-300">
                      Please select a CV from the left to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Job Description
                      </label>
                      <textarea
                        id="jobDescription"
                        placeholder="Paste the job description here..."
                        className="input-field w-full h-48 resize-none font-mono text-sm"
                        disabled={optimizing}
                      />
                    </div>
                    <button
                      onClick={() => {
                        const textarea = document.getElementById(
                          "jobDescription"
                        ) as HTMLTextAreaElement;
                        handleOptimize(textarea?.value || "");
                      }}
                      disabled={optimizing}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      {optimizing && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      {optimizing ? "Optimizing..." : "Optimize CV"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
