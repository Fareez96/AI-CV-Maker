"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { processAndUploadFile } from "@/app/actions/file";

interface CVUploadFormProps {
  onUpload: (id: string, title: string, content: string) => Promise<void>;
}

export default function CVUploadForm({ onUpload }: CVUploadFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { id, title, content } = await processAndUploadFile(
        file.name,
        buffer,
        file.type
      );

      await onUpload(id, title, content);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to process file";
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
