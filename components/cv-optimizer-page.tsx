"use client";

import { useState } from "react";
import { optimizeCV } from "@/app/actions/optimize";
import { Loader2, Download, Copy, Check } from "lucide-react";

export default function CVOptimizerPage() {
  const [cvText, setCvText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleOptimize = async () => {
    if (!cvText.trim() || !jobDesc.trim()) {
      setError("Please enter both CV and job description");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const optimization = await optimizeCV(cvText, jobDesc);
      setResult(optimization);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Optimization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.optimizedCV);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([result.optimizedCV], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "optimized-cv.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/20 py-12">
      <div className="container-lg">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-foreground">
            AI CV Maker
          </h1>
          <p className="text-xl text-muted-foreground">
            Get 95%+ ATS Score Instantly
          </p>
          <p className="text-sm text-primary mt-2">
            Free AI-powered CV optimization tailored to any job
          </p>
        </div>

        {!result ? (
          // Input Section
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mb-8">
            {/* CV Input */}
            <div className="glass p-6 rounded-2xl">
              <label className="block text-sm font-semibold mb-3">
                Your CV
              </label>
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste your current CV here..."
                className="input-field h-64 resize-none"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Copy and paste your resume text
              </p>
            </div>

            {/* Job Description Input */}
            <div className="glass p-6 rounded-2xl">
              <label className="block text-sm font-semibold mb-3">
                Job Description
              </label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the job posting here..."
                className="input-field h-64 resize-none"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Full job description for optimal matching
              </p>
            </div>
          </div>
        ) : null}

        {error && (
          <div className="max-w-4xl mx-auto bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-300 text-sm">
            {error}
          </div>
        )}

        {!result ? (
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleOptimize}
              disabled={loading || !cvText.trim() || !jobDesc.trim()}
              className="btn-primary w-full py-4 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                  Optimizing CV...
                </>
              ) : (
                "Optimize CV"
              )}
            </button>
          </div>
        ) : (
          // Results Section
          <div className="max-w-4xl mx-auto">
            {/* ATS Score */}
            <div className="glass p-8 rounded-2xl mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Optimization Results</h2>
                <button
                  onClick={() => setResult(null)}
                  className="btn-secondary text-sm"
                >
                  Optimize Again
                </button>
              </div>

              {/* Score Display */}
              <div className="mb-8">
                <div className="flex items-end gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      ATS Score
                    </p>
                    <div className="text-5xl font-bold">
                      <span
                        className={
                          result.atsScore >= 95
                            ? "text-success"
                            : result.atsScore >= 85
                              ? "text-blue-400"
                              : "text-yellow-400"
                        }
                      >
                        {result.atsScore}%
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="h-3 bg-card rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          result.atsScore >= 95
                            ? "bg-success"
                            : result.atsScore >= 85
                              ? "bg-blue-400"
                              : "bg-yellow-400"
                        }`}
                        style={{ width: `${result.atsScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {result.atsScore >= 95 && (
                  <p className="text-sm text-success">
                    ✓ Perfect! Highly optimized for ATS systems.
                  </p>
                )}
              </div>

              {/* Keywords */}
              {result.keywords.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold mb-3">Matched Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.slice(0, 12).map((keyword: string, i: number) => (
                      <span
                        key={i}
                        className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {result.improvements.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Suggestions</h3>
                  <ul className="space-y-2">
                    {result.improvements.map((imp: string, i: number) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex gap-2"
                      >
                        <span className="text-accent">•</span>
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Optimized CV Display */}
            <div className="glass p-8 rounded-2xl mb-8">
              <h3 className="text-xl font-bold mb-4">Optimized CV</h3>
              <div className="bg-card/50 p-6 rounded-lg mb-6 max-h-96 overflow-auto font-mono text-sm">
                {result.optimizedCV}
              </div>

              {/* Download/Copy Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleCopy}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy to Clipboard
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download as Text
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="max-w-4xl mx-auto mt-16 text-center text-muted-foreground text-sm">
          <p>
            No registration required. Your CV is never stored. 100% free and
            private.
          </p>
        </div>
      </div>
    </div>
  );
}
