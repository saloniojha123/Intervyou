import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import TranscriptFeed from "../components/TranscriptFeed.jsx";

/**
 * The backend's /end endpoint already returns the full report at the moment
 * the interview finishes (see InterviewRoom's handleEnd). For a page-refresh-safe
 * version, persist that report (e.g. in the Interview model / localStorage)
 * and fetch it here by sessionId instead of relying on route state alone.
 */
export default function Report() {
  const { sessionId } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    // Placeholder: in a full implementation, GET /api/interview/:sessionId/report
    // For now this page documents the expected shape from assessment.service.js.
    setReport({
      sessionId,
      summary: { totalExchanges: 0, finalDifficulty: "medium", flaggedMoments: 0 },
      flags: [],
      transcript: [],
    });
  }, [sessionId]);

  if (!report) return null;

  return (
    <div className="min-h-screen px-4 py-6 max-w-3xl mx-auto flex flex-col gap-5">
      <div className="flex items-center gap-2 text-brand-400">
        <CheckCircle2 size={20} />
        <h1 className="text-xl font-semibold text-slate-100">Interview Report</h1>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Exchanges" value={report.summary.totalExchanges} />
        <StatCard label="Final Difficulty" value={report.summary.finalDifficulty} />
        <StatCard label="Flagged Moments" value={report.summary.flaggedMoments} />
      </div>

      {report.flags.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-amber-400">
            <AlertTriangle size={16} />
            <h2 className="text-sm font-semibold">Flagged moments</h2>
          </div>
          <ul className="space-y-1 text-sm text-amber-200">
            {report.flags.map((f, i) => (
              <li key={i}>• {f.type}: {f.note}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-300">Full transcript</h2>
        <TranscriptFeed turns={report.transcript} />
      </div>

      <Link
        to="/"
        className="self-start rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-brand-400 hover:text-brand-300"
      >
        ← Start a new interview
      </Link>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center">
      <p className="text-lg font-semibold text-slate-100 capitalize">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
