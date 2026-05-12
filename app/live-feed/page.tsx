"use client";

import { useState, useEffect, useRef } from "react";
import { telemetryEvents, type TelemetryEvent } from "@/data/events";
import { workflows } from "@/data/workflows";
import { Play, Pause, Gauge } from "lucide-react";
import { COLORS } from "@/lib/utils";

const typeColors: Record<string, string> = {
  APP_SWITCH: "#3B82F6",
  FORM_FILL: "#22C55E",
  SEARCH: "#D5002B",
  DATA_ENTRY: "#14B8A6",
  EMAIL_SEND: "#F59E0B",
  FILE_UPLOAD: "#A855F7",
  FILE_DOWNLOAD: "#A855F7",
  CLICK: "#6B7280",
  COPY_PASTE: "#EC4899",
  NAVIGATION: "#6B7280",
};

const onboarding = workflows[0];
const goldenSteps = onboarding.steps.filter((s) => s.type === "golden");

export default function LiveFeedPage() {
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visibleEvents, setVisibleEvents] = useState<TelemetryEvent[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => {
        const next = prev + 1;
        if (next >= telemetryEvents.length) return 0;
        return next;
      });
    }, 1200 / speed);
    return () => clearInterval(interval);
  }, [playing, speed]);

  useEffect(() => {
    if (currentIdx === 0 && visibleEvents.length > 0) {
      setVisibleEvents([telemetryEvents[0]]);
      return;
    }
    const evt = telemetryEvents[currentIdx];
    if (evt) {
      setVisibleEvents((prev) => [...prev.slice(-40), evt]);
    }
  }, [currentIdx]);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [visibleEvents]);

  const currentStep = telemetryEvents[currentIdx]?.workflowStep || 1;
  const totalEvents = telemetryEvents.length;

  return (
    <div className="h-[calc(100vh-48px)]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Live Feed</h1>
          <p className="text-sm text-gray-500 mt-0.5">Simulated Desktop Telemetry Capture</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlaying(!playing)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/5"
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
            {playing ? "Pause" : "Play"}
          </button>
          <div className="flex items-center gap-1.5">
            <Gauge size={14} className="text-gray-500" />
            {[1, 2, 5].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded text-[11px] ${speed === s ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 px-4 py-2 mb-4 flex items-center gap-6 text-xs" style={{ background: "#111827" }}>
        <span className="text-gray-500">Operator: <span className="text-white">Sarah Chen</span></span>
        <span className="text-gray-500">Workflow: <span className="text-white">Client Onboarding</span></span>
        <span className="text-gray-500">Step: <span className="text-white">{currentStep} of {goldenSteps.length}</span></span>
        <span className="text-gray-500">Events: <span className="text-white">{Math.min(currentIdx + 1, totalEvents)} / {totalEvents}</span></span>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: playing ? "#22C55E" : "#EF4444" }} />
          <span style={{ color: playing ? "#22C55E" : "#EF4444" }}>{playing ? "CAPTURING" : "PAUSED"}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4" style={{ height: "calc(100vh - 200px)" }}>
        <div className="col-span-2 rounded-xl border border-white/10 overflow-hidden flex flex-col" style={{ background: "#111827" }}>
          <div className="px-4 py-2 border-b border-white/5 flex items-center gap-6 text-[10px] text-gray-500 uppercase">
            <span className="w-16">Time</span>
            <span className="w-24">Type</span>
            <span className="w-24">Application</span>
            <span>Description</span>
          </div>
          <div ref={feedRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-1 font-mono">
            {visibleEvents.map((evt, i) => (
              <div
                key={`${evt.id}-${i}`}
                className="flex items-center gap-6 py-1 text-xs animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDuration: "0.2s" }}
              >
                <span className="w-16 text-gray-600 shrink-0">{evt.timestamp}</span>
                <span
                  className="w-24 shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium text-center"
                  style={{ background: `${typeColors[evt.type]}20`, color: typeColors[evt.type] }}
                >
                  {evt.type}
                </span>
                <span className="w-24 shrink-0 text-gray-500">{evt.app}</span>
                <span className="text-gray-300">{evt.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 p-4 overflow-y-auto" style={{ background: "#111827" }}>
          <div className="text-xs font-semibold text-white mb-3">Workflow Progress</div>
          <div className="space-y-1.5">
            {goldenSteps.map((step, i) => {
              const stepNum = i + 1;
              const isCurrent = stepNum === currentStep;
              const isPast = stepNum < currentStep;

              return (
                <div
                  key={step.id}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg transition-colors"
                  style={{
                    background: isCurrent ? "rgba(213,0,43,0.15)" : isPast ? "rgba(34,197,94,0.08)" : "transparent",
                    border: isCurrent ? "1px solid rgba(213,0,43,0.3)" : "1px solid transparent",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                    style={{
                      background: isPast ? COLORS.green : isCurrent ? COLORS.accent : "rgba(255,255,255,0.05)",
                      color: isPast || isCurrent ? "white" : "#6B7280",
                    }}
                  >
                    {isPast ? "\u2713" : stepNum}
                  </div>
                  <div>
                    <div className={`text-xs ${isCurrent ? "text-white font-medium" : isPast ? "text-gray-400" : "text-gray-600"}`}>
                      {step.name}
                    </div>
                    <div className="text-[9px] text-gray-600">{step.avgDuration}</div>
                  </div>
                  {isCurrent && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: COLORS.accent }} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-white/5">
            <div className="text-[10px] text-gray-500 uppercase mb-2">Event Type Legend</div>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(typeColors).slice(0, 8).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5 text-[9px]">
                  <div className="w-2 h-2 rounded" style={{ background: color }} />
                  <span className="text-gray-500">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
