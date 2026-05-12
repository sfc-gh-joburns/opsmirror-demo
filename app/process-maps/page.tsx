"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeTypes,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { workflows, type Workflow, type WorkflowStep } from "@/data/workflows";
import StepDetailPanel from "@/components/StepDetailPanel";
import ClassificationBadge from "@/components/ClassificationBadge";

const TYPE_COLORS: Record<string, string> = {
  golden: "#22C55E",
  deviation: "#F59E0B",
  anomalous: "#EF4444",
};

const CLASS_BORDER: Record<string, string> = {
  "RPA-Ready": "#3B82F6",
  "Agent-Ready": "#D5002B",
  Hybrid: "#F59E0B",
  "Human-Only": "#EF4444",
};

function StepNode({ data }: { data: { step: WorkflowStep; overlay: string } }) {
  const s = data.step;
  const borderColor = data.overlay === "automation" ? CLASS_BORDER[s.classification] : TYPE_COLORS[s.type];
  const bgOpacity = data.overlay === "time" ? Math.min(0.3 + (s.avgDurationMin / 500) * 0.7, 1) : 0.15;

  return (
    <>
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
      <div
        className="px-3 py-2 rounded-lg cursor-pointer min-w-[140px] text-center transition-all hover:scale-105"
        style={{
          background: `rgba(${data.overlay === "time" ? "213,0,43" : borderColor === "#22C55E" ? "34,197,94" : borderColor === "#F59E0B" ? "245,158,11" : borderColor === "#EF4444" ? "239,68,68" : "213,0,43"}, ${bgOpacity})`,
          border: `2px solid ${borderColor}`,
        }}
      >
        <div className="text-xs font-medium text-white leading-tight">{s.name}</div>
        <div className="text-[10px] text-gray-400 mt-0.5">{s.avgDuration}</div>
        {s.automated && (
          <div className="text-[9px] mt-0.5" style={{ color: "#D5002B" }}>AUTOMATED</div>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
    </>
  );
}

const nodeTypes: NodeTypes = { step: StepNode as unknown as NodeTypes[string] };

function layoutNodes(wf: Workflow, overlay: string): { nodes: Node[]; edges: Edge[] } {
  const goldenSteps = wf.steps.filter((s) => s.type === "golden");
  const deviationSteps = wf.steps.filter((s) => s.type !== "golden");
  const posMap = new Map<string, { x: number; y: number }>();
  const goldenIds = new Set(goldenSteps.map((s) => s.id));

  goldenSteps.forEach((s, i) => {
    posMap.set(s.id, { x: i * 200, y: 200 });
  });

  deviationSteps.forEach((s) => {
    const inEdge = wf.edges.find((e) => e.target === s.id);
    if (inEdge && posMap.has(inEdge.source)) {
      const parent = posMap.get(inEdge.source)!;
      posMap.set(s.id, { x: parent.x + 100, y: parent.y + 120 });
    } else {
      posMap.set(s.id, { x: 0, y: 350 });
    }
  });

  const stepMap = new Map(wf.steps.map((s) => [s.id, s]));

  const nodes: Node[] = wf.steps.map((s) => ({
    id: s.id,
    type: "step",
    position: posMap.get(s.id) || { x: 0, y: 0 },
    data: { step: s, overlay },
  }));

  const edges: Edge[] = wf.edges.map((e, i) => ({
    id: `e-${i}`,
    source: e.source,
    target: e.target,
    animated: !goldenIds.has(e.source) || !goldenIds.has(e.target),
    style: {
      stroke: goldenIds.has(e.source) && goldenIds.has(e.target)
        ? "rgba(34,197,94,0.5)"
        : "rgba(245,158,11,0.4)",
      strokeWidth: Math.max(1, e.frequency / 30),
    },
    label: `${e.frequency}%`,
    labelStyle: { fill: "#6B7280", fontSize: 9 },
    labelBgStyle: { fill: "#111827", fillOpacity: 0.8 },
  }));

  return { nodes, edges };
}

export default function ProcessMapsPage() {
  const [activeWf, setActiveWf] = useState(0);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [overlay, setOverlay] = useState<"type" | "automation" | "time">("type");

  const wf = workflows[activeWf];
  const { nodes, edges } = useMemo(() => layoutNodes(wf, overlay), [wf, overlay]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const step = wf.steps.find((s) => s.id === node.id);
      if (step) setSelectedStep(step);
    },
    [wf]
  );

  return (
    <div className="h-[calc(100vh-48px)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Process Maps</h1>
          <p className="text-sm text-gray-500 mt-0.5">Digital Twin Visualization</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {(["type", "automation", "time"] as const).map((o) => (
              <button
                key={o}
                onClick={() => setOverlay(o)}
                className={`px-3 py-1.5 text-xs capitalize ${overlay === o ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
              >
                {o === "type" ? "Path Type" : o === "automation" ? "Automation" : "Time Heatmap"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {workflows.map((w, i) => (
          <button
            key={w.id}
            onClick={() => { setActiveWf(i); setSelectedStep(null); }}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              i === activeWf ? "bg-white/10 text-white border border-white/20" : "text-gray-500 hover:text-white border border-transparent"
            }`}
          >
            {w.name}
            <span className="ml-2 text-[10px] text-gray-500">{w.steps.length} steps</span>
          </button>
        ))}
      </div>

      <div className="flex gap-3 mb-3 text-[10px] text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2" style={{ borderColor: "#22C55E", background: "rgba(34,197,94,0.15)" }} />
          Golden Path
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2" style={{ borderColor: "#F59E0B", background: "rgba(245,158,11,0.15)" }} />
          Deviation
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2" style={{ borderColor: "#EF4444", background: "rgba(239,68,68,0.15)" }} />
          Anomalous
        </div>
        <div className="ml-4 text-gray-600">Avg Duration: {wf.avgTotalDuration}</div>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "#0B0F1A", height: "calc(100vh - 240px)" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.3}
          maxZoom={2}
        >
          <Background color="rgba(255,255,255,0.03)" gap={20} />
          <Controls
            showInteractive={false}
            style={{ background: "#1F2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
          />
        </ReactFlow>
      </div>

      <StepDetailPanel step={selectedStep} onClose={() => setSelectedStep(null)} />
    </div>
  );
}
