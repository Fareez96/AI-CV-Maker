"use client";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-card/20 py-12 mt-20">
      <div className="container-lg space-y-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="font-semibold">AI CV Maker</h3>
            <p className="text-sm text-muted-foreground">
              Transform your resume with AI-powered optimization for maximum ATS compatibility.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">ATS Templates</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Chronological Format</li>
              <li>✓ Functional Format</li>
              <li>✓ Hybrid Format</li>
              <li>✓ Minimal Format</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ AI Job Analysis</li>
              <li>✓ CV Optimization</li>
              <li>✓ ATS Scoring</li>
              <li>✓ Instant Results</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-sm text-muted-foreground">
          <p>
            Made with ❤️ using Next.js 16 and Google Gemini AI
          </p>
          <p className="mt-2 text-xs">
            © 2026 AI CV Maker. No login required. Your data is never stored.
          </p>
        </div>
      </div>
    </footer>
  );
}
