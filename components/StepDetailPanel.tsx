import ClassificationBadge from "@/components/ClassificationBadge";
import type { WorkflowStep } from "@/data/workflows";
import { X, Clock, DollarSign, BarChart3, AlertTriangle } from "lucide-react";

interface Props {
  step: WorkflowStep | null;
  onClose: () => void;
}

export default function StepDetailPanel({ step, onClose }: Props) {
  if (!step) return null;

  return (
    <div
      className="fixed right-0 top-0 bottom-0 w-96 z-50 border-l border-white/10 overflow-y-auto"
      style={{ background: "#111827" }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-white">{step.name}</h3>
            <ClassificationBadge classification={step.classification} />
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-lg p-3 border border-white/5" style={{ background: "#1F2937" }}>
            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] uppercase mb-1">
              <Clock size={12} /> Avg Duration
            </div>
            <div className="text-sm font-semibold text-white">{step.avgDuration}</div>
          </div>
          <div className="rounded-lg p-3 border border-white/5" style={{ background: "#1F2937" }}>
            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] uppercase mb-1">
              <DollarSign size={12} /> Cost / Exec
            </div>
            <div className="text-sm font-semibold text-white">${step.costPerExec.toLocaleString()}</div>
          </div>
          <div className="rounded-lg p-3 border border-white/5" style={{ background: "#1F2937" }}>
            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] uppercase mb-1">
              <BarChart3 size={12} /> Confidence
            </div>
            <div className="text-sm font-semibold text-white">{(step.confidence * 100).toFixed(0)}%</div>
            <div className="mt-1.5 w-full h-1.5 rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${step.confidence * 100}%`,
                  background: step.confidence > 0.8 ? "#22C55E" : step.confidence > 0.6 ? "#F59E0B" : "#EF4444",
                }}
              />
            </div>
          </div>
          <div className="rounded-lg p-3 border border-white/5" style={{ background: "#1F2937" }}>
            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] uppercase mb-1">
              <AlertTriangle size={12} /> Deviation Rate
            </div>
            <div className="text-sm font-semibold text-white">{step.deviationRate}%</div>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs font-medium text-gray-400 uppercase">Status</div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: step.automated ? "#22C55E" : "#F59E0B" }}
            />
            <span className="text-sm text-gray-300">
              {step.automated ? "Automated" : "Manual"}
            </span>
          </div>
        </div>

        {step.deviations.length > 0 && (
          <div>
            <div className="text-xs font-medium text-gray-400 uppercase mb-2">Observed Deviations</div>
            <div className="space-y-2">
              {step.deviations.map((d, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#F59E0B" }} />
                  {d}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
