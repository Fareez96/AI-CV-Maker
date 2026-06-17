"use client";

import { FileText, Trash2 } from "lucide-react";

interface CV {
  id: string;
  title: string;
  fileType: string;
  createdAt: Date;
}

interface CVListProps {
  cvs: CV[];
  selectedCV: string | null;
  onSelect: (cvId: string) => void;
  onDelete: (cvId: string) => void;
}

export default function CVList({
  cvs,
  selectedCV,
  onSelect,
  onDelete,
}: CVListProps) {
  if (cvs.length === 0) {
    return (
      <div className="glass p-6 text-center">
        <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
        <p className="text-sm text-muted-foreground">No CVs uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="glass p-6 space-y-2">
      <h3 className="font-semibold mb-3">Your CVs</h3>
      {cvs.map((cv) => (
        <div
          key={cv.id}
          className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between group ${
            selectedCV === cv.id
              ? "bg-primary/20 border-primary/50"
              : "bg-card/50 border-white/10 hover:bg-card/80"
          }`}
          onClick={() => onSelect(cv.id)}
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{cv.title}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(cv.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(cv.id);
            }}
            className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            title="Delete CV"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      ))}
    </div>
  );
}
