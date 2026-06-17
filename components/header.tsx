"use client";

export default function Header() {
  return (
    <header className="border-b border-white/5 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
      <div className="container-lg py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI CV Maker
            </h1>
            <p className="text-sm text-muted-foreground">
              Free ATS-optimized resume generator
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm text-primary font-semibold">Target: 95%+ ATS</p>
            <p className="text-xs text-muted-foreground">Powered by Gemini AI</p>
          </div>
        </div>
      </div>
    </header>
  );
}
