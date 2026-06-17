"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import * as pdfParse from "pdf-parse";
import * as mammoth from "mammoth";

interface CVUploadFormProps {
  onUpload: (title: string, content: string, fileType: string) => Promise<void>;
}

export default function CVUploadForm({ onUpload }: CVUploadFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const data = await pdfParse(Buffer.from(arrayBuffer));
    return data.text;
  };

  const extractTextFromDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);

    try {
      let content = "";
      const fileType = file.type;

      if (file.type === "application/pdf") {
        content = await extractTextFromPDF(file);
      } else if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword"
      ) {
        content = await extractTextFromDocx(file);
      } else if (file.type === "text/plain") {
        content = await file.text();
      } else {
        throw new Error(
          "Unsupported file type. Please use PDF, DOCX, or TXT."
        );
      }

      if (!content.trim()) {
        throw new Error("No text content found in the file");
      }

      const title = file.name.replace(/\.[^/.]+$/, "");
      await onUpload(title, content, fileType);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to process file";
      setError(message);
      console.error("[v0] File processing error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-6 space-y-4">
      <h3 className="font-semibold">Upload Your CV</h3>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
        <p className="text-sm font-medium">Click to upload</p>
        <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt"
        onChange={handleFileChange}
        disabled={loading}
        className="hidden"
      />

      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-xs">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing file...
        </div>
      )}
    </div>
  );
}
