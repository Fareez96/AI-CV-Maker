"use client";

import { Download, Loader2 } from "lucide-react";
import { useCallback } from "react";
import { generatePDF } from "@/app/actions/pdf";

interface PDFDownloadProps {
  content: string;
  fileName: string;
  downloading: boolean;
  setDownloading: (value: boolean) => void;
}

export default function PDFDownload({
  content,
  fileName,
  downloading,
  setDownloading,
}: PDFDownloadProps) {
  const handleDownload = useCallback(async () => {
    try {
      setDownloading(true);

      // Call server action to generate PDF
      const pdfData = await generatePDF(content, fileName);
      
      // Convert to Uint8Array for Blob
      const pdfArray = new Uint8Array(
        pdfData instanceof Buffer ? pdfData : Buffer.from(pdfData)
      );
      
      // Create blob and download
      const blob = new Blob([pdfArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("[v0] PDF download error:", error);
      alert("Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  }, [content, fileName, setDownloading]);

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="btn-primary w-full flex items-center justify-center gap-2"
    >
      {downloading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {downloading ? "Generating PDF..." : "Download CV as PDF"}
    </button>
  );
}
