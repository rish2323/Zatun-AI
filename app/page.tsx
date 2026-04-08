"use client";
import { useState } from "react";

export default function Home() {
  const [genre, setGenre] = useState("");
  const [character, setCharacter] = useState("");
  const [scene, setScene] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (usageCount >= 2) { setShowPaywall(true); return; }
    if (!genre || !character || !scene) { alert("Please fill in all fields"); return; }
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
      setUsageCount((prev) => prev + 1);
    } catch {
      setOutput("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white" style={{fontFamily: "'Inter', sans-serif"}}>
      {/* Gradient background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20" style={{background: "radial-gradient(circle, #f97316, transparent)"}}/>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15" style={{background: "radial-gradient(circle, #8b5cf6, transparent)"}}/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5" style={{background: "radial-gradient(circle, #f97316, transparent)"}}/>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6 border border-orange-500/30 bg-orange-500/10 text-orange-400">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"/>
            Built by Zatun — Gujarat's oldest game studio
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4 leading-tight">
            Write better
            <span style={{background: "linear-gradient(135deg, #f97316, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}> game dialogue</span>
            <br />in seconds
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
            AI-powered NPC writing for indie developers. No more blank page. No more generic lines.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 mb-4" style={{boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 32px 64px rgba(0,0,0,0.4)"}}>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Game Genre</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 outline-none transition-all focus:border-orange-500/50 focus:bg-white/8 text-sm"
                placeholder="e.g. Dark Fantasy, Sci-Fi, Horror, Cyberpunk"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Character</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 outline-none transition-all focus:border-orange-500/50 focus:bg-white/8 text-sm"
                placeholder="e.g. A scarred veteran who lost his memory"
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Scene Context</label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 outline-none transition-all focus:border-orange-500/50 focus:bg-white/8 text-sm resize-none"
                placeholder="e.g. The player finds him alone in a burning library"
                rows={3}
                value={scene}
                onChange={(e) => setScene(e.target.value)}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              style={{background: loading ? "#374151" : "linear-gradient(135deg, #f97316, #ec4899)"}}
            >
              <span className="relative z-10">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Generating...
                  </span>
                ) : "⚡ Generate Dialogue"}
              </span>
            </button>

            <p className="text-center text-zinc-600 text-xs">
              {Math.max(0, 2 - usageCount)} free generation{2 - usageCount !== 1 ? "s" : ""} remaining
            </p>
          </div>
        </div>

        {/* Output */}
        {output && !showPaywall && (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 mb-4" style={{boxShadow: "0 0 0 1px rgba(249,115,22,0.1), 0 32px 64px rgba(0,0,0,0.4)"}}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400"/>
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Generated Dialogue</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all"
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-lg border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-all"
                >
                  Regenerate
                </button>
              </div>
            </div>
            <p className="text-zinc-200 whitespace-pre-wrap leading-relaxed text-sm">{output}</p>
          </div>
        )}

        {/* Paywall */}
        {showPaywall && (
          <div className="rounded-2xl border border-orange-500/20 bg-white/5 backdrop-blur-sm p-8 text-center" style={{boxShadow: "0 0 40px rgba(249,115,22,0.1)"}}>
            <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl" style={{background: "linear-gradient(135deg, #f97316, #ec4899)"}}>
              ⚡
            </div>
            <h2 className="text-2xl font-black mb-2">You're on a roll</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-sm mx-auto">
              Unlock unlimited game dialogue, quest narratives, character backstories and more.
            </p>
            <button className="w-full py-4 rounded-xl font-bold text-white text-sm tracking-wide mb-3" style={{background: "linear-gradient(135deg, #f97316, #ec4899)"}}>
              Get Pro — $9/month
            </button>
            <p className="text-zinc-600 text-xs">Cancel anytime · Used by indie devs worldwide</p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-zinc-700 text-xs mt-10">
          Zatun AI · Powered by 19 years of game development
        </p>
      </div>
    </div>
  )}
