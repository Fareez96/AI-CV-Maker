"use client";

import { Copy, Download, RotateCcw, Check } from "lucide-react";

interface ResultDisplayProps {
  result: {
    optimizedCV: string;
    atsScore: number;
    keywords: string[];
    suggestions: string[];
    improvements: string[];
  };
  onNewOptimization: () => void;
  onDownload: () => void;
  onCopy: () => void;
  copied: boolean;
}

export default function ResultDisplay({
  result,
  onNewOptimization,
  onDownload,
  onCopy,
  copied,
}: ResultDisplayProps) {
  const scoreColor =
    result.atsScore >= 75
      ? "text-success"
      : result.atsScore >= 50
        ? "text-yellow-400"
        : "text-red-400";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ATS Score */}
      <div className="glass p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Optimization Complete!</h2>
          <div className="text-center">
            <div className={`text-5xl font-bold ${scoreColor}`}>
              {result.atsScore}%
            </div>
            <p className="text-sm text-muted-foreground">ATS Score</p>
          </div>
        </div>

        <div className="h-2 bg-card rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              result.atsScore >= 75
                ? "bg-success"
                : result.atsScore >= 50
                  ? "bg-yellow-400"
                  : "bg-red-400"
            }`}
            style={{ width: `${result.atsScore}%` }}
          />
        </div>

        {result.atsScore >= 75 && (
          <p className="text-sm text-success">
            ✓ Great! This CV has strong ATS compatibility.
          </p>
        )}
        {result.atsScore < 75 && result.atsScore >= 50 && (
          <p className="text-sm text-yellow-300">
            Review suggestions below to improve ATS score.
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Keywords & Suggestions */}
        <div className="glass p-6 space-y-4">
          <h3 className="font-semibold">Key Matched Skills</h3>
          <div className="flex flex-wrap gap-2">
            {result.keywords.slice(0, 10).map((keyword, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-primary/20 border border-primary/50 rounded-full text-sm text-primary"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Improvements */}
        <div className="glass p-6 space-y-4">
          <h3 className="font-semibold">Improvement Suggestions</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {result.improvements.slice(0, 3).map((improvement, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary">•</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Optimized CV */}
      <div className="glass p-6 space-y-4">
        <h3 className="font-semibold">Your Optimized CV</h3>
        <div className="bg-card/50 rounded-lg p-6 max-h-96 overflow-y-auto font-mono text-sm whitespace-pre-wrap text-muted-foreground">
          {result.optimizedCV}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={onCopy} className="btn-primary flex items-center gap-2">
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copy to Clipboard
            </>
          )}
        </button>
        <button onClick={onDownload} className="btn-secondary flex items-center gap-2">
          <Download className="w-5 h-5" />
          Download as Text
        </button>
        <button
          onClick={onNewOptimization}
          className="btn-secondary flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Optimize Another
        </button>
      </div>
    </div>
  );
}
