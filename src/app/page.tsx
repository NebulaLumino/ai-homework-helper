"use client";
import { useState } from "react";

export default function Home() {
  const [inputs, setInputs] = useState<Record<string, string>>({
    "subject": "",
    "grade_level": "",
    "topic": ""
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const promptText = "Homework Helper: " + inputs["subject"] + " | " + inputs["grade_level"] + " | " + inputs["topic"];
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setOutput(data.result || "No output received.");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-emerald-400 mb-4">Homework Helper</h1>
          <p className="text-gray-400">AI-powered family tool</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-2xl p-6 border border-emerald-500/40 space-y-4 mb-8">
          <div><label className="block text-sm font-medium text-gray-300 mb-1">Subject</label><input type="text" value={inputs["subject"]} onChange={e => handleChange("subject", e.target.value)} className="w-full px-4 py-2 bg-gray-900/80 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-1">Grade Level</label><input type="text" value={inputs["grade_level"]} onChange={e => handleChange("grade_level", e.target.value)} className="w-full px-4 py-2 bg-gray-900/80 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-1">Topic</label><input type="text" value={inputs["topic"]} onChange={e => handleChange("topic", e.target.value)} className="w-full px-4 py-2 bg-gray-900/80 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" /></div>
          <button
            type="submit"
            disabled={loading}
            className={"w-full py-3 px-6 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 mb-8">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {output && (
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-emerald-500/40">
            <h3 className={"text-emerald-400 font-semibold mb-4"}>Generated Output</h3>
            <pre className="whitespace-pre-wrap text-gray-300 text-sm font-mono">{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
