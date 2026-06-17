"use client";

import { Download, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import PDFDownload from "./pdf-download";
import { useState } from "react";

interface Optimization {
  id: string;
  optimizedContent: string;
  atsScore: string;
  keywords: string;
  suggestions: string;
  createdAt: Date;
}

interface OptimizationResultProps {
  optimization: Optimization;
  onNewOptimization: () => void;
}

export default function OptimizationResult({
  optimization,
  onNewOptimization,
}: OptimizationResultProps) {
  const [downloading, setDownloading] = useState(false);

  const atsScore = parseInt(optimization.atsScore, 10);
  const scoreColor =
    atsScore >= 80 ? "text-green-400" : atsScore >= 60 ? "text-yellow-400" : "text-red-400";
  const scoreBg =
    atsScore >= 80 ? "bg-green-500/20" : atsScore >= 60 ? "bg-yellow-500/20" : "bg-red-500/20";

  return (
    <div className="glass p-8 space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={onNewOptimization}
          className="btn-ghost text-sm mb-4 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h2 className="text-2xl font-bold">Optimization Complete!</h2>
      </div>

      {/* ATS Score Card */}
      <div className={`p-6 rounded-lg border border-white/10 ${scoreBg}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">ATS Score</p>
            <p className={`text-4xl font-bold ${scoreColor}`}>{atsScore}%</p>
          </div>
          <div>
            {atsScore >= 80 ? (
              <CheckCircle className={`w-16 h-16 ${scoreColor}`} />
            ) : (
              <AlertCircle className={`w-16 h-16 ${scoreColor}`} />
            )}
          </div>
        </div>
      </div>

      {/* Keywords */}
      {optimization.keywords && (
        <div>
          <h3 className="font-semibold mb-3">Key Skills & Requirements</h3>
          <div className="flex flex-wrap gap-2">
            {optimization.keywords
              .split(",")
              .slice(0, 10)
              .map((keyword, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-xs text-primary"
                >
                  {keyword.trim()}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {optimization.suggestions && (
        <div>
          <h3 className="font-semibold mb-2">Feedback</h3>
          <p className="text-sm text-muted-foreground bg-card/50 p-4 rounded-lg border border-white/10">
            {optimization.suggestions}
          </p>
        </div>
      )}

      {/* Optimized Content Preview */}
      <div>
        <h3 className="font-semibold mb-2">Optimized CV Preview</h3>
        <div className="bg-card/50 p-4 rounded-lg border border-white/10 max-h-48 overflow-y-auto">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
            {optimization.optimizedContent.slice(0, 500)}...
          </p>
        </div>
      </div>

      {/* Download Button */}
      <PDFDownload
        content={optimization.optimizedContent}
        fileName="optimized-cv"
        downloading={downloading}
        setDownloading={setDownloading}
      />

      {/* New Optimization Button */}
      <button
        onClick={onNewOptimization}
        className="btn-secondary w-full"
      >
        Optimize Another CV
      </button>
    </div>
  );
}
