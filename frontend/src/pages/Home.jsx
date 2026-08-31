import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Home() {
  const navigate = useNavigate();
  const [resumeSummary, setResumeSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/interview/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeSummary }),
      });
      if (!res.ok) throw new Error("Failed to start interview");
      const data = await res.json();
      navigate(`/interview/${data.sessionId}`, { state: { rtc: data.rtc } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
            <Mic size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Intervyou</h1>
            <p className="text-sm text-slate-400">EchoSphere · Coordinated AI Interview Panel</p>
          </div>
        </div>

        <label className="mb-2 block text-sm font-medium text-slate-300">
          Quick resume / background summary (optional)
        </label>
        <textarea
          value={resumeSummary}
          onChange={(e) => setResumeSummary(e.target.value)}
          rows={4}
          placeholder="e.g. 3 years as a backend engineer, worked mostly with Node.js and distributed systems..."
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 outline-none focus:border-brand-400"
        />

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <button
          onClick={handleStart}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Mic size={16} />}
          {loading ? "Starting session..." : "Start Interview"}
        </button>

        <p className="mt-4 text-center text-xs text-slate-500">
          You'll be speaking with an AI interviewer panel — this is clearly disclosed at all times.
        </p>
      </div>
    </div>
  );
}
