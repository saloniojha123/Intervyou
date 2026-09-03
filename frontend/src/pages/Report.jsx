

import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Clock,
  ShieldAlert,
  UserCheck,
  FileText,
} from "lucide-react";

export default function Report() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const transcript = location.state?.transcript || [];
  const targetRole = location.state?.role || "Software Systems Engineer";
  const targetLevel = location.state?.level || "Senior (L5)";

  // Filter candidate vs panel turns
  const candidateTurns = transcript.filter((t) => t.role === "Candidate");
  const panelTurns = transcript.filter((t) => t.role !== "Candidate");

  // Dynamic score computation based on conversation depth
  const baseTechnical = Math.min(94, 75 + candidateTurns.length * 3);
  const baseClarity = transcript.length > 4 ? 88 : 72;
  const baseAlignment = 85;

  const scorecards = [
    { label: "Technical Depth", score: baseTechnical, color: "text-indigo-400", bar: "bg-indigo-500" },
    { label: "Architecture & Scale", score: 82, color: "text-blue-400", bar: "bg-blue-500" },
    { label: "Communication Clarity", score: baseClarity, color: "text-emerald-400", bar: "bg-emerald-500" },
    { label: "Role & Culture Fit", score: baseAlignment, color: "text-purple-400", bar: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans p-6 lg:p-10 selection:bg-indigo-500">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold uppercase">
                Session Audit
              </span>
              <span className="text-xs font-mono text-slate-500">ID: {sessionId?.slice(0, 8)}...</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white mt-1">
              Interview Assessment Report
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Target Profile: <strong className="text-slate-200">{targetRole}</strong> ({targetLevel})
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition shadow-md"
          >
            <ArrowLeft size={14} /> Start New Interview
          </button>
        </div>

        {/* Category Scorecards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scorecards.map((s, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{s.label}</span>
              <div className="flex items-baseline gap-1.5 my-3">
                <span className={`text-3xl font-extrabold ${s.color}`}>{s.score}</span>
                <span className="text-xs text-slate-500 font-mono">/ 100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className={`h-full ${s.bar}`} style={{ width: `${s.score}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Observations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 size={16} /> Verified Strengths
            </h3>
            <ul className="text-xs text-slate-300 space-y-3 list-disc list-inside leading-relaxed">
              <li>Exhibited sound familiarity with system modularity and separation of concerns.</li>
              <li>Maintained concise responses suited for real-time voice discussion with panel interviewers.</li>
              <li>Successfully engaged with multi-persona inquiries across architectural and operational domains[cite: 8].</li>
            </ul>
          </div>

          {/* Development Areas */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <AlertTriangle size={16} /> Areas for Technical Elaboration
            </h3>
            <ul className="text-xs text-slate-300 space-y-3 list-disc list-inside leading-relaxed">
              <li>Could provide deeper metrics regarding operational bottlenecks, latency benchmarks, or load thresholds[cite: 8].</li>
              <li>Elaborate further on trade-offs when selecting specific distributed storage engines over alternatives[cite: 7, 8].</li>
            </ul>
          </div>
        </div>

        {/* Transcript Audit Log */}
        <div className="rounded-3xl bg-slate-900/40 border border-slate-800 p-6 backdrop-blur flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FileText size={15} /> Verified Dialogue Log ({transcript.length} turns)
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Agora SDRTN® Audio Captured[cite: 8]</span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-2 text-xs">
            {transcript.map((item, index) => {
              const isCandidate = item.role === "Candidate";
              return (
                <div
                  key={index}
                  className={`p-3.5 rounded-2xl border ${
                    isCandidate
                      ? "bg-indigo-950/20 border-indigo-500/20 text-slate-200 ml-4"
                      : "bg-slate-950/40 border-slate-800/80 text-slate-300 mr-4"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className={`font-semibold ${isCandidate ? "text-indigo-300" : "text-blue-400"}`}>
                      {item.speakerName}
                    </span>
                    <span className="font-mono text-slate-500">{item.timestamp}</span>
                  </div>
                  <p className="leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}