"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";


export default function Home() {
  const [genre, setGenre] = useState("");
  const [character, setCharacter] = useState("");
  const [scene, setScene] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem("zatunFreeUses");
    if (stored) {
      setUsageCount(parseInt(stored));
    }
  }, []);

  const incrementUsage = () => {
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem("zatunFreeUses", newCount.toString());
  };

  const handleGenerate = async () => {
    if (usageCount >= 3) {
      setShowPaywall(true);
      return;
    }
    if (!genre || !character || !scene) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    setOutput("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genre, character, scene }),
      });
      const data = await response.json();
      setOutput(data.result);
      incrementUsage();
    } catch {
      setOutput("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isClient) {
    return <div className="min-h-screen bg-[#0a0a0f]" />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #f97316, transparent)" }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8 border border-orange-500/30 bg-orange-500/10 text-orange-400">
            Built by Zatun — Gujarat's oldest game studio
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4 leading-none">
            Write better{" "}
            <span style={{ background: "linear-gradient(135deg, #f97316, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              game dialogue
            </span>{" "}
            in seconds
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto">
            AI-powered NPC writing for indie developers. No more blank page. No more generic lines.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 32px 64px rgba(0,0,0,0.4)" }}>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">GAME GENRE</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:border-orange-500/50 focus:bg-white/10" 
                placeholder="e.g. Dark Fantasy, Sci-Fi, Horror, Cyberpunk" 
                value={genre} 
                onChange={(e) => setGenre(e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">CHARACTER</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:border-orange-500/50 focus:bg-white/10" 
                placeholder="e.g. A scarred veteran who lost his memory" 
                value={character} 
                onChange={(e) => setCharacter(e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">SCENE CONTEXT</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:border-orange-500/50 focus:bg-white/10 resize-none" 
                rows={3} 
                placeholder="e.g. The player meets this character in a ruined tavern after a battle" 
                value={scene} 
                onChange={(e) => setScene(e.target.value)} 
              />
            </div>

            <button 
              onClick={handleGenerate} 
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-lg tracking-wide transition-all disabled:opacity-60 flex items-center justify-center gap-2" 
              style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }}
            >
              {loading ? "Generating..." : "✨ Generate Dialogue"}
            </button>

            <p className="text-center text-zinc-500 text-sm">
              {Math.max(0, 3 - usageCount)} free generation{Math.max(0, 3 - usageCount) !== 1 ? "s" : ""} remaining
            </p>
          </div>
        </div>

        {output && !showPaywall && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-9">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs uppercase tracking-widest text-zinc-400">GENERATED DIALOGUE</span>
              <div className="flex gap-3">
                <button 
                  onClick={handleCopy} 
                  className="text-sm px-5 py-2 border border-white/20 rounded-xl hover:bg-white/5 transition"
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
                <button 
                  onClick={handleGenerate} 
                  className="text-sm px-5 py-2 border border-orange-500/30 text-orange-400 rounded-xl hover:bg-orange-500/10 transition"
                >
                  Regenerate
                </button>
              </div>
            </div>

            {/* Cleaner Markdown Output with better spacing */}
            <div className="prose prose-invert prose-zinc max-w-none text-[15.2px] leading-[1.75] tracking-[-0.005em]">
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          </div>
        )}

        {showPaywall && (
          <div className="mt-10 rounded-3xl border border-orange-500/20 bg-white/5 backdrop-blur-xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-3">Free generations finished</h2>
            <p className="text-zinc-400 mb-6">Get unlimited access for $9/month</p>
            <button className="w-full py-4 rounded-2xl font-bold text-white" style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }}>
              Upgrade to Pro
            </button>
          </div>
        )}

        <p className="text-center text-xs text-zinc-600 mt-16">
          Zatun AI • Powered by 19 years of real game development
        </p>
      </div>
    </div>
  );
}