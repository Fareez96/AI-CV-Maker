"use client";

import { useRef, useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";

interface FileUploadProps {
  onUpload: (content: string) => void;
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setLoading(true);

    try {
      let content = "";

      if (file.type === "text/plain") {
        content = await file.text();
      } else if (
        file.type === "application/pdf" ||
        file.name.endsWith(".pdf")
      ) {
        // For PDF, we'd need pdf-parse, but it's complex in browser
        // For now, show user to copy-paste PDF content
        setError("PDF files: Please copy and paste the text content instead");
        setLoading(false);
        return;
      } else if (
        file.type.includes("wordprocessingml") ||
        file.name.endsWith(".docx")
      ) {
        setError("DOCX files: Please copy and paste the text content instead");
        setLoading(false);
        return;
      } else {
        setError("Please use TXT files or copy-paste your CV content");
        setLoading(false);
        return;
      }

      if (!content.trim()) {
        throw new Error("File is empty");
      }

      onUpload(content);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to read file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-6 space-y-4">
      <h3 className="font-semibold">Upload Your CV</h3>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
      >
        <Upload className="w-8 h-8 mx-auto mb-3 text-primary" />
        <p className="font-medium">Click to upload or paste your CV</p>
        <p className="text-sm text-muted-foreground mt-1">TXT format recommended</p>
        <p className="text-xs text-muted-foreground mt-2">
          For PDF/DOCX: Copy and paste the text content below
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.pdf,.docx,.doc"
        onChange={handleFileChange}
        disabled={loading}
        className="hidden"
      />

      {error && (
        <div className="p-3 rounded-lg bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 text-xs">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Reading file...
        </div>
      )}
    </div>
  );
}
