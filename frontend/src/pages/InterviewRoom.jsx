


import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  Captions,
  Clock,
  Mic,
  MicOff,
  PhoneOff,
  Radio,
  Video,
  VideoOff,
  Volume2,
} from "lucide-react";
import { useAgoraClient } from "../hooks/useAgoraClient.js";
import { useAuth } from "../context/AuthContext.jsx";

const PANEL_PERSONAS = [
  {
    id: "tech",
    name: "Technical Lead",
    initials: "TL",
    role: "Architecture & Systems",
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: "hm",
    name: "Hiring Manager",
    initials: "HM",
    role: "Leadership & Strategy",
    color: "from-emerald-600 to-teal-700",
  },
  {
    id: "prod",
    name: "Product Lead",
    initials: "PL",
    role: "Trade-offs & Roadmaps",
    color: "from-amber-600 to-orange-700",
  },
  {
    id: "beh",
    name: "Behavioural Lead",
    initials: "BL",
    role: "Culture & Team Fit",
    color: "from-purple-600 to-pink-700",
  },
  {
    id: "cust",
    name: "Customer Advocate",
    initials: "CA",
    role: "User Empathy & Impact",
    color: "from-cyan-600 to-blue-700",
  },
];

export default function InterviewRoom() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth() || {};
  const user = auth.user || null;

  const {
    isMuted = false,
    audioVolume = 0,
    remoteSpeaking = false,
    remoteUsers = [],
    joinSession,
    toggleMic,
    leaveSession,
  } = useAgoraClient() || {};

  const [activeSpeakerId, setActiveSpeakerId] = useState("tech");
  const [camOn, setCamOn] = useState(true);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [transcript] = useState([
    {
      id: 1,
      speakerName: "Maya (Panel Lead)",
      role: "Panel",
      timestamp: "00:01",
      text: "Hello! I am Maya from your interview panel. To start off, could you please introduce yourself and discuss a recent technical project you built?",
    },
  ]);

  const localVideoRef = useRef(null);
  const streamRef = useRef(null);
  const transcriptBottomRef = useRef(null);
  const joinStartedRef = useRef(false);
  const endingRef = useRef(false);

  const rtc = location.state?.rtc;
  const rtcAppId = rtc?.appId;
  const rtcChannel = rtc?.channel || rtc?.channelName;
  const rtcToken = rtc?.token;
  const rtcUid = rtc?.uid;

  // Join Agora exactly once for this room.
  // Do not call leaveSession from this effect's cleanup. In React 18
  // development mode, effect cleanup can run while client.join() is pending.
  useEffect(() => {
    if (typeof joinSession !== "function") {
      console.error("[InterviewRoom] joinSession is unavailable");
      return undefined;
    }

    if (
      !rtcAppId ||
      !rtcChannel ||
      !rtcToken ||
      rtcUid === undefined ||
      rtcUid === null
    ) {
      console.warn("[InterviewRoom] RTC credentials are incomplete", {
        hasAppId: Boolean(rtcAppId),
        hasChannel: Boolean(rtcChannel),
        hasToken: Boolean(rtcToken),
        uid: rtcUid,
      });
      return undefined;
    }

    if (joinStartedRef.current) {
      return undefined;
    }

    joinStartedRef.current = true;
    let active = true;

    const connectToAgora = async () => {
      try {
        console.log("[InterviewRoom] Starting Agora join", {
          appId: rtcAppId,
          channel: rtcChannel,
          uid: rtcUid,
          tokenAvailable: Boolean(rtcToken),
        });

        await joinSession({
          appId: String(rtcAppId),
          channel: String(rtcChannel),
          token: String(rtcToken),
          uid: rtcUid,
        });

        if (active) {
          console.log("[InterviewRoom] Agora joined successfully");
        }
      } catch (error) {
        joinStartedRef.current = false;
        if (active) {
          console.error("[InterviewRoom] Agora join error:", error);
        }
      }
    };

    connectToAgora();

    return () => {
      active = false;
      // Intentionally no leaveSession() here; it can cancel an active join.
    };
  }, [rtcAppId, rtcChannel, rtcToken, rtcUid, joinSession]);

  // Start the webcam without opening a second microphone stream.
  useEffect(() => {
    let active = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.warn(
          "[InterviewRoom] Webcam initialization notice:",
          error?.message || error
        );
        setCamOn(false);
      }
    };

    startCamera();
    const timer = window.setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => {
      active = false;
      window.clearInterval(timer);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const formatTimer = (value) => {
    const mins = String(Math.floor(value / 60)).padStart(2, "0");
    const secs = String(value % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleEndInterview = async () => {
    if (endingRef.current) return;
    endingRef.current = true;

    try {
      console.log("[InterviewRoom] Ending interview");
      if (typeof leaveSession === "function") {
        await leaveSession();
      }
    } catch (error) {
      console.error("[InterviewRoom] Agora leave error:", error);
    } finally {
      navigate(`/report/${sessionId}`, {
        state: {
          transcript,
          role: location.state?.role,
          level: location.state?.level,
        },
      });
    }
  };

  const toggleCam = () => {
    const track = streamRef.current?.getVideoTracks?.()[0];
    if (!track) return;

    track.enabled = !track.enabled;
    setCamOn(track.enabled);
  };

  const activeSpeaker =
    PANEL_PERSONAS.find((persona) => persona.id === activeSpeakerId) ||
    PANEL_PERSONAS[0];
  const hasRemoteUsers = Array.isArray(remoteUsers) && remoteUsers.length > 0;
  const safeTranscript = Array.isArray(transcript) ? transcript : [];
  const latestMessage =
    safeTranscript.length > 0
      ? safeTranscript[safeTranscript.length - 1]?.text || ""
      : "";

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0f172a] font-sans text-slate-100 select-none">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/70 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400">
            <Radio size={13} className="animate-pulse" /> Live Panel
          </span>
          <span className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300">
            Speaking: <strong className="text-blue-400">{activeSpeaker.name}</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
            <AlertCircle size={13} />
            <span>AI Evaluation Session: Automated Turn-Taking Active</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1 font-mono text-xs text-slate-300">
            <Clock size={13} className="text-slate-500" />
            <span>{formatTimer(seconds)}</span>
          </div>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden p-6 lg:grid-cols-12">
        <div className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-950/50 p-6 backdrop-blur-xl lg:col-span-8">
          <div className="my-auto grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
              <div className={`flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr ${activeSpeaker.color} text-3xl font-extrabold text-white shadow-2xl transition-all duration-300`}>
                {activeSpeaker.initials}
              </div>
              <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                <Volume2 size={12} className={remoteSpeaking ? "animate-pulse" : ""} />
                {remoteSpeaking ? "Speaking" : hasRemoteUsers ? "Connected" : "Agent Ready"}
              </div>
              <div className="absolute bottom-3 left-3 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-1 text-xs font-semibold text-slate-200">
                {activeSpeaker.name} ({activeSpeaker.role})
              </div>
            </div>

            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover -scale-x-100"
              />
              {!camOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-xs text-slate-500">
                  <VideoOff size={24} className="mb-2" /> Camera is off
                </div>
              )}
              <div className="absolute bottom-3 left-3 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-1 text-xs font-semibold text-slate-200">
                You ({user?.name || "Candidate"})
              </div>
            </div>
          </div>

          {captionsOn && (
            <div className="mx-auto my-2 max-w-xl rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-center text-xs text-slate-300 shadow backdrop-blur">
              &quot;{latestMessage || "Listening for candidate response..."}&quot;
            </div>
          )}

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-6 items-center gap-1">
                {[6, 12, 18, 14, 8, 16, 20, 10, 14, 22, 16].map((height, index) => (
                  <span
                    key={index}
                    className={`w-1 rounded-full transition-all duration-75 ${
                      !isMuted && audioVolume > 5 ? "bg-blue-400" : "bg-slate-700"
                    }`}
                    style={{
                      height: !isMuted
                        ? `${Math.max(4, (height * (audioVolume || 10)) / 30)}px`
                        : "4px",
                    }}
                  />
                ))}
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                {isMuted ? "Mic Muted" : "Agora SDRTN® Active"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={typeof toggleMic === "function" ? toggleMic : undefined}
                className={`rounded-xl border p-2.5 transition ${
                  isMuted
                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                    : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
                title={isMuted ? "Unmute Mic" : "Mute Mic"}
              >
                {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              <button
                type="button"
                onClick={toggleCam}
                className={`rounded-xl border p-2.5 transition ${
                  !camOn
                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                    : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
                title={camOn ? "Turn Camera Off" : "Turn Camera On"}
              >
                {!camOn ? <VideoOff size={16} /> : <Video size={16} />}
              </button>

              <button
                type="button"
                onClick={() => setCaptionsOn((current) => !current)}
                className={`rounded-xl border p-2.5 transition ${
                  captionsOn
                    ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                    : "border-slate-700 bg-slate-800 text-slate-500"
                }`}
                title={captionsOn ? "Hide Captions" : "Show Captions"}
              >
                <Captions size={16} />
              </button>

              <button
                type="button"
                onClick={handleEndInterview}
                disabled={endingRef.current}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <PhoneOff size={15} /> End Interview
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 overflow-hidden lg:col-span-4">
          <div className="shrink-0 rounded-3xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between border-b border-slate-800/80 px-1 pb-2 text-xs font-bold uppercase text-slate-400">
              <span>Coordinated Panel (5)</span>
              <span>Status</span>
            </div>

            <div className="space-y-2">
              {PANEL_PERSONAS.map((persona) => {
                const isCurrent = activeSpeakerId === persona.id;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => setActiveSpeakerId(persona.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-2.5 text-left transition ${
                      isCurrent
                        ? "border-blue-500/50 bg-blue-600/10 text-blue-400 shadow"
                        : "border-slate-800/80 bg-slate-950/40 text-slate-400 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${persona.color} text-[10px] font-bold text-white`}>
                        {persona.initials}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{persona.name}</p>
                        <p className="text-[10px] leading-none text-slate-500">{persona.role}</p>
                      </div>
                    </div>
                    {isCurrent ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" /> Live
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-600">Idle</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/50 p-4 backdrop-blur-xl">
            <div className="mb-3 border-b border-slate-800/80 px-1 pb-2 text-xs font-bold uppercase text-slate-400">
              Live Transcript
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1 text-xs">
              {safeTranscript.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-blue-400">{item.speakerName}</span>
                    <span className="font-mono text-slate-500">{item.timestamp}</span>
                  </div>
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-3 leading-relaxed text-slate-200">
                    {item.text}
                  </div>
                </div>
              ))}
              <div ref={transcriptBottomRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
