"use client";

import { useState, useCallback } from "react";
import { Loader2, Download, Copy, Check } from "lucide-react";
import { optimizeCV } from "@/app/actions/optimize";
import { CV_TEMPLATES, TemplateKey } from "@/lib/cv-templates";
import FileUpload from "./file-upload";
import ResultDisplay from "./result-display";

interface OptimizationState {
  optimizedCV: string;
  atsScore: number;
  keywords: string[];
  suggestions: string[];
  improvements: string[];
}

export default function CVOptimizer() {
  const [cvContent, setCVContent] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>("hybrid");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<OptimizationState | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCVUpload = useCallback((content: string) => {
    setCVContent(content);
    setError("");
  }, []);

  const handleOptimize = useCallback(async () => {
    if (!cvContent.trim()) {
      setError("Please upload your CV first");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please paste a job description");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await optimizeCV(cvContent, jobDescription, selectedTemplate);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to optimize CV");
    } finally {
      setLoading(false);
    }
  }, [cvContent, jobDescription, selectedTemplate]);

  const handleDownload = useCallback(() => {
    if (!result) return;

    const element = document.createElement("a");
    const file = new Blob([result.optimizedCV], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "optimized-cv.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [result]);

  const handleCopy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result.optimizedCV);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  return (
    <section className="container-lg py-20">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            AI-Powered CV Optimizer
          </h1>
          <p className="text-xl text-muted-foreground">
            Get ATS-optimized resumes tailored to job descriptions with 75%+ ATS score
          </p>
        </div>

        {!result ? (
          <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
            {/* Left: CV Upload & Job Description */}
            <div className="space-y-6">
              <FileUpload onUpload={handleCVUpload} />

              {/* Template Selection */}
              <div className="glass p-6 space-y-3">
                <label className="block text-sm font-semibold">CV Template</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(CV_TEMPLATES).map(([key, template]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTemplate(key as TemplateKey)}
                      className={`p-3 rounded-lg transition-all text-sm font-medium ${
                        selectedTemplate === key
                          ? "bg-primary text-primary-foreground"
                          : "bg-card/50 border border-white/10 hover:border-primary/50"
                      }`}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {CV_TEMPLATES[selectedTemplate].description}
                </p>
              </div>

              {/* Job Description */}
              <div className="glass p-6 space-y-3">
                <label className="block text-sm font-semibold">Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="input-field resize-none h-64"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* Optimize Button */}
              <button
                onClick={handleOptimize}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? "Optimizing..." : "Optimize CV"}
              </button>
            </div>

            {/* Right: Instructions & Template Preview */}
            <div className="space-y-6">
              <div className="glass p-6 space-y-4">
                <h3 className="font-semibold">How It Works</h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">1.</span>
                    <span>Upload your current CV (PDF, DOCX, or text)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">2.</span>
                    <span>Paste the job description you're applying for</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">3.</span>
                    <span>Choose your preferred CV template</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">4.</span>
                    <span>Click "Optimize CV" and get instant results</span>
                  </li>
                </ol>
              </div>

              <div className="glass p-6 space-y-3">
                <h3 className="font-semibold">What You Get</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-1">✓</span>
                    <span>ATS-optimized CV with 75%+ score</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-1">✓</span>
                    <span>Matched keywords from job description</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-1">✓</span>
                    <span>Specific improvement suggestions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-1">✓</span>
                    <span>Download as text or copy to clipboard</span>
                  </li>
                </ul>
              </div>

              <div className="glass p-6 space-y-3">
                <h3 className="font-semibold text-sm">Template Preview</h3>
                <pre className="bg-card/50 p-3 rounded text-xs overflow-auto max-h-40 text-muted-foreground">
                  {CV_TEMPLATES[selectedTemplate].format.substring(0, 300)}...
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <ResultDisplay
            result={result}
            onNewOptimization={() => setResult(null)}
            onDownload={handleDownload}
            onCopy={handleCopy}
            copied={copied}
          />
        )}
      </div>
    </section>
  );
}
