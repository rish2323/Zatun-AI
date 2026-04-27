"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [genre, setGenre] = useState("");
  const [character, setCharacter] = useState("");
  const [scene, setScene] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedDialogue, setCopiedDialogue] = useState(false);
  const [usageCount, setUsageCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("zatun_usage");
    if (stored) {
      const { count, timestamp } = JSON.parse(stored);
      const hoursPassed = (Date.now() - timestamp) / (1000 * 60 * 60);
      if (hoursPassed < 24) setUsageCount(count);
      else localStorage.removeItem("zatun_usage");
    }
  }, []);

  const handleGenerate = async () => {
    if (usageCount >= 3) { setShowPaywall(true); return; }
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
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem("zatun_usage", JSON.stringify({
        count: newCount,
        timestamp: Date.now()
      }));
    } catch {
      setOutput("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const splitOutput = (text: string) => {
    const notesIndex = text.toLowerCase().indexOf("notes for implementation");
    if (notesIndex === -1) return { dialogue: text, notes: "" };
    return {
      dialogue: text.slice(0, notesIndex).trim(),
      notes: text.slice(notesIndex).trim()
    };
  };

  const { dialogue, notes } = splitOutput(output);

  const cleanDialogue = dialogue
    .replace(/^\*\*\s*$/gm, "")
    .replace(/^##\s*/gm, "")
    .replace(/^#\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .trim();

const mergedDialogue = cleanDialogue
    .split("\n")
    .reduce((acc: string[], line: string, i: number, arr: string[]) => {
      const trimmed = line.trim();
      const prevLine = acc[acc.length - 1] || "";
      const isNameOnly = trimmed.match(/^[A-Z][A-Z\s\(\)'\.,-]+:$/);
      if (isNameOnly && i + 1 < arr.length) {
        acc.push(trimmed + " " + arr[i + 1].trim());
        arr[i + 1] = "";
      } else if (trimmed !== "") {
        acc.push(trimmed);
      }
      return acc;
    }, [])
    .join("\n");

  const cleanNotes = notes
    .replace(/^##\s*/gm, "")
    .replace(/^#\s*/gm, "")
    .replace(/\*\*/g, "")
    .replace(/^Notes for implementation:?\s*/i, "")
    .trim();

  const handleCopyAll = () => {
    navigator.clipboard.writeText(output);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyDialogue = () => {
    navigator.clipboard.writeText(cleanDialogue);
    setCopiedDialogue(true);
    setTimeout(() => setCopiedDialogue(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600;700;900&display=swap');
        .dialogue-text { font-family: 'Lora', Georgia, serif; line-height: 1.8; font-size: 0.95rem; }
        .dialogue-block { margin-bottom: 1.4rem; }
        .character-name { font-family: 'Inter', sans-serif; font-weight: 700; letter-spacing: 0.08em; font-size: 0.82rem; color: #ffffff; text-transform: uppercase; margin-bottom: 0.25rem; }
        .dialogue-line { font-family: 'Lora', Georgia, serif; color: #e4e4e7; line-height: 1.85; }
        .stage-direction { font-family: 'Lora', Georgia, serif; font-style: italic; color: rgba(161,161,170,0.55); font-size: 0.88rem; line-height: 1.7; margin: 0.5rem 0; display: block; }
        .scene-header { font-family: 'Inter', sans-serif; font-weight: 700; letter-spacing: 0.12em; font-size: 0.75rem; color: rgba(255,255,255,0.35); text-transform: uppercase; margin-bottom: 1.25rem; }
      `}</style>

      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #f97316, transparent)" }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6 border border-orange-500/30 bg-orange-500/10 text-orange-400">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            Built by Zatun — Gujarat's oldest game studio
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4 leading-tight">
            Write better
            <span style={{ background: "linear-gradient(135deg, #f97316, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> game dialogue</span>
            <br />in seconds
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
            AI-powered NPC writing for indie developers. No more blank page. No more generic lines.
          </p>
        </div>

        {/* Input Card — Image 1 style */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 mb-6" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 32px 64px rgba(0,0,0,0.4)" }}>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Game Genre</label>
              <input
                className="w-full bg-zinc-800/80 border border-zinc-700/50 rounded-xl px-4 py-3.5 text-white placeholder-zinc-500 outline-none transition-all focus:border-orange-500/50 focus:bg-zinc-800 text-sm"
                placeholder="e.g. Dark Fantasy, Sci-Fi, Horror, Cyberpunk"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Character</label>
              <input
                className="w-full bg-zinc-800/80 border border-zinc-700/50 rounded-xl px-4 py-3.5 text-white placeholder-zinc-500 outline-none transition-all focus:border-orange-500/50 focus:bg-zinc-800 text-sm"
                placeholder="e.g. A scarred veteran who lost his memory"
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Scene Context</label>
              <textarea
                className="w-full bg-zinc-800/80 border border-zinc-700/50 rounded-xl px-4 py-3.5 text-white placeholder-zinc-500 outline-none transition-all focus:border-orange-500/50 focus:bg-zinc-800 text-sm resize-none"
                placeholder="e.g. The player meets this character in a ruined tavern after a battle"
                rows={3}
                value={scene}
                onChange={(e) => setScene(e.target.value)}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: loading ? "#374151" : "linear-gradient(135deg, #f97316, #ec4899)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Writing your scene...
                </span>
              ) : "⚡ Generate Dialogue"}
            </button>

            <p className="text-center text-zinc-600 text-xs">
              {Math.max(0, 3 - usageCount)} free generation{3 - usageCount !== 1 ? "s" : ""} remaining
            </p>
          </div>
        </div>

        {/* Output */}
        {output && !showPaywall && (
          <div className="space-y-3 mb-6">
            {/* Dialogue Section */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8" style={{ boxShadow: "0 0 0 1px rgba(249,115,22,0.08), 0 32px 64px rgba(0,0,0,0.4)" }}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-400" />
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Scene Dialogue</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCopyDialogue} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-white transition-all">
                    {copiedDialogue ? "✓ Copied" : "Copy Dialogue"}
                  </button>
                  <button onClick={handleCopyAll} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-white transition-all">
                    {copiedAll ? "✓ Copied" : "Copy All"}
                  </button>
                  <button onClick={handleGenerate} disabled={loading} className="text-xs px-3 py-1.5 rounded-lg border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-all">
                    Regenerate
                  </button>
                </div>
              </div>

              <div className="dialogue-text">
                {cleanDialogue.split("\n").map((line, i) => {
                  const trimmed = line.trim();
                  if (!trimmed || trimmed === "**" || trimmed === "---" || trimmed === "##" || trimmed === "#") return null;

                  // Scene header — ALL CAPS, no colon
                  if (trimmed === trimmed.toUpperCase() && !trimmed.includes(":") && trimmed.length > 3 && !/^\[/.test(trimmed)) {
                    return <div key={i} className="scene-header">{trimmed}</div>;
                  }

                  // Stage direction [like this]
                  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                    return <span key={i} className="stage-direction">{trimmed}</span>;
                  }

                  // Character: dialogue
                  const colonIndex = trimmed.indexOf(":");
                  if (colonIndex !== -1 && colonIndex < 25) {
                    const name = trimmed.slice(0, colonIndex).replace(/\*/g, "").trim();
                    const speech = trimmed.slice(colonIndex + 1).trim();
                    if (name && speech) {
                      return (
                        <div key={i} className="dialogue-block">
                          <div className="character-name">{name}</div>
                          <div className="dialogue-line">{speech}</div>
                        </div>
                      );
                    }
                  }

                  // Regular line
                  return <div key={i} className="dialogue-line mb-3">{trimmed}</div>;
                })}
              </div>
            </div>

            {/* Notes Section */}
            {notes && (
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">For Developers — Implementation</span>
                </div>
                <div className="text-zinc-300 text-sm leading-relaxed">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-3 text-zinc-300">{children}</p>,
                      strong: ({ children }) => <strong className="text-purple-300 font-semibold">{children}</strong>,
                    }}
                  >
                    {cleanNotes}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Paywall */}
        {showPaywall && (
          <div className="rounded-2xl border border-orange-500/20 bg-white/5 backdrop-blur-sm p-8 text-center mb-6" style={{ boxShadow: "0 0 40px rgba(249,115,22,0.1)" }}>
            <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg, #f97316, #ec4899)" }}>
              ⚡
            </div>
            <h2 className="text-2xl font-black mb-2">You're on a roll</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-sm mx-auto">
              Unlock unlimited game dialogue, quest narratives, character backstories and more.
            </p>
            <button className="w-full py-4 rounded-xl font-bold text-white text-sm tracking-wide mb-3" style={{ background: "linear-gradient(135deg, #f97316, #ec4899)" }}>
              Get Pro — $7/month
            </button>
            <p className="text-zinc-600 text-xs">Cancel anytime · Used by indie devs worldwide</p>
          </div>
        )}

        <p className="text-center text-zinc-700 text-xs mt-6">
          Zatun AI · Powered by 19 years of game development
        </p>
      </div>
    </div>
  );
}