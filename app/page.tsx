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

  const handleGenerate = async () => {
    if (usageCount >= 2) {
      setShowPaywall(true);
      return;
    }
    if (!genre || !character || !scene) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Zatun <span className="text-purple-500">AI</span>
        </h1>
        <p className="text-zinc-400 mt-2 text-sm">
          Game writing for indie developers — by a real studio
        </p>
      </div>

      {/* Input Card */}
      <div className="w-full max-w-xl bg-zinc-900 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
        <div>
          <label className="text-xs text-zinc-400 uppercase tracking-widest mb-1 block">
            Game Genre
          </label>
          <input
            className="w-full bg-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="e.g. Dark Fantasy, Sci-Fi, Horror"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400 uppercase tracking-widest mb-1 block">
            Character Description
          </label>
          <input
            className="w-full bg-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="e.g. A scarred veteran who lost his memory"
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400 uppercase tracking-widest mb-1 block">
            Scene Context
          </label>
          <textarea
            className="w-full bg-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-purple-600 resize-none"
            placeholder="e.g. The player meets this character in a ruined tavern after a battle"
            rows={3}
            value={scene}
            onChange={(e) => setScene(e.target.value)}
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 transition rounded-xl py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Generating..." : "⚡ Generate Dialogue"}
        </button>
        <p className="text-center text-zinc-600 text-xs">
          {2 - usageCount} free generation{2 - usageCount !== 1 ? "s" : ""} remaining
        </p>
      </div>

      {/* Output */}
      {output && !showPaywall && (
        <div className="w-full max-w-xl mt-6 bg-zinc-900 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm text-zinc-400 uppercase tracking-widest">
              Generated Dialogue
            </h2>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-purple-400 hover:text-purple-300"
            >
              Copy
            </button>
          </div>
          <p className="text-zinc-100 whitespace-pre-wrap leading-relaxed text-sm">
            {output}
          </p>
          <button
            onClick={handleGenerate}
            className="mt-4 w-full border border-zinc-700 hover:border-purple-500 transition rounded-xl py-2 text-sm text-zinc-400 hover:text-white"
          >
            Regenerate
          </button>
        </div>
      )}

      {/* Paywall */}
      {showPaywall && (
        <div className="w-full max-w-xl mt-6 bg-zinc-900 rounded-2xl p-6 shadow-xl text-center">
          <h2 className="text-xl font-bold mb-2">You've used your free generations</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Unlock unlimited game dialogue, quest narratives, character backstories and more.
          </p>
          <button className="w-full bg-purple-600 hover:bg-purple-700 transition rounded-xl py-3 font-semibold text-white">
            Get Pro — $9/month
          </button>
          <p className="text-zinc-600 text-xs mt-3">Cancel anytime</p>
        </div>
      )}

      <p className="text-zinc-700 text-xs mt-10">
        Built by Zatun — Gujarat's oldest game studio
      </p>
    </div>
  );
}