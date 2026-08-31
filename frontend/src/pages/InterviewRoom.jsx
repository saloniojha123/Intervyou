import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Send, PhoneOff, Mic, MicOff } from "lucide-react";

import DisclosureBanner from "../components/DisclosureBanner.jsx";
import PersonaPanel from "../components/PersonaPanel.jsx";
import WaveformVisualizer from "../components/WaveformVisualizer.jsx";
import TranscriptFeed from "../components/TranscriptFeed.jsx";

import { useAgoraClient } from "../hooks/useAgoraClient.js";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const WS_URL =
  import.meta.env.VITE_WS_URL || "ws://localhost:5000/ws/session";

export default function InterviewRoom() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Agora information received from Home.jsx
  const rtc = location.state?.rtc;

  // Connect to Agora voice session
  const {
    joined,
    micActive,
    error: agoraError,
    toggleMic,
  } = useAgoraClient({
    appId: rtc?.appId,
    channelName: rtc?.channelName,
    token: rtc?.token,
    uid: rtc?.uid,
  });

  const wsRef = useRef(null);

  const [turns, setTurns] = useState([]);
  const [activePersonaId, setActivePersonaId] = useState(null);
  const [connected, setConnected] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  // -----------------------------
  // WebSocket connection
  // -----------------------------
  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");

      setConnected(true);

      ws.send(
        JSON.stringify({
          type: "join",
          sessionId,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "persona_response") {
          setActivePersonaId(msg.personaId);

          setTurns((prev) => [
            ...prev,
            {
              speaker: msg.personaName,
              text: msg.text,
            },
          ]);

          setSending(false);
        }

        if (msg.type === "error") {
          console.error("WebSocket error:", msg.message);
          setSending(false);
        }
      } catch (error) {
        console.error("Invalid WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket connection error:", error);
      setConnected(false);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [sessionId]);

  // -----------------------------
  // Send text answer
  // -----------------------------
  function sendAnswer() {
    const text = draft.trim();

    if (!text) return;

    if (
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    ) {
      console.error("WebSocket is not connected");
      return;
    }

    // Show candidate answer immediately
    setTurns((prev) => [
      ...prev,
      {
        speaker: "candidate",
        text,
      },
    ]);

    // Send answer to backend
    wsRef.current.send(
      JSON.stringify({
        type: "candidate_final_transcript",
        sessionId,
        text,
      })
    );

    setDraft("");
    setSending(true);
  }

  // -----------------------------
  // End interview
  // -----------------------------
  async function handleEnd() {
    try {
      await fetch(
        `${API_BASE}/api/interview/${sessionId}/end`,
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.error("Failed to end interview:", error);
    } finally {
      navigate(`/report/${sessionId}`);
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-3xl mx-auto flex flex-col gap-5">

      {/* AI disclosure */}
      <DisclosureBanner />

      {/* Interviewer personas */}
      <PersonaPanel
        activePersonaId={activePersonaId}
      />

      {/* -----------------------------
          VOICE / AGORA STATUS
      ------------------------------ */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">

        <WaveformVisualizer
          active={micActive || sending}
        />

        <div className="mt-4 flex items-center justify-center gap-3">

          {/* Microphone status */}
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs ${micActive
                ? "bg-green-500/10 text-green-400"
                : "bg-slate-800 text-slate-400"
              }`}
          >
            {micActive ? (
              <>
                <Mic size={15} />
                Microphone active
              </>
            ) : (
              <>
                <MicOff size={15} />
                Microphone inactive
              </>
            )}
          </div>

          {/* Agora status */}
          <div className="text-xs text-slate-500">
            {joined
              ? "Connected to Agora"
              : "Connecting to voice session..."}
          </div>

        </div>

        {/* Agora error */}
        {agoraError && (
          <p className="mt-3 text-center text-xs text-red-400">
            Microphone / Agora error:{" "}
            {agoraError.message || "Unable to connect"}
          </p>
        )}

        {/* WebSocket status */}
        <p className="mt-2 text-center text-xs text-slate-600">
          {connected
            ? "Interview session connected"
            : "Connecting to interview session..."}
        </p>

      </div>

      {/* -----------------------------
          TRANSCRIPT
      ------------------------------ */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex-1">

        <TranscriptFeed
          turns={turns}
        />

      </div>

      {/* -----------------------------
          CONTROLS
      ------------------------------ */}
      <div className="flex gap-2">

        {/* Text input */}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendAnswer();
            }
          }}
          placeholder={
            micActive
              ? "Speak your answer or type here..."
              : "Type your answer..."
          }
          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-brand-400"
        />

        {/* Microphone */}
        <button
          onClick={toggleMic}
          disabled={!joined}
          className={`flex items-center justify-center rounded-lg px-4 text-white ${micActive
              ? "bg-green-600 hover:bg-green-700"
              : "bg-slate-700 hover:bg-slate-600"
            } disabled:opacity-50`}
          title={micActive ? "Mute microphone" : "Unmute microphone"}
        >
          {micActive ? <Mic size={17} /> : <MicOff size={17} />}
        </button>

        {/* Send */}
        <button
          onClick={sendAnswer}
          disabled={
            sending ||
            !draft.trim() ||
            !connected
          }
          className="flex items-center justify-center rounded-lg bg-brand-500 px-4 text-white hover:bg-brand-600 disabled:opacity-60"
          title="Send answer"
        >
          <Send size={17} />
        </button>

        {/* End interview */}
        <button
          onClick={handleEnd}
          className="flex items-center justify-center rounded-lg bg-red-600/90 px-4 text-white hover:bg-red-600"
          title="End interview"
        >
          <PhoneOff size={17} />
        </button>

      </div>

    </div>
  );
}