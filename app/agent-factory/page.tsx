"use client";

import { useState } from "react";
import { agents, escalations } from "@/data/agents";
import { COLORS } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { Bot, Shield, Clock, AlertTriangle, TrendingUp, ChevronDown, ChevronUp, Eye } from "lucide-react";

const statusColors: Record<string, { bg: string; text: string }> = {
  Production: { bg: "rgba(34,197,94,0.15)", text: "#22C55E" },
  "Shadow Mode": { bg: "rgba(245,158,11,0.15)", text: "#F59E0B" },
  Canary: { bg: "rgba(213,0,43,0.15)", text: "#D5002B" },
};

const escStatusColors: Record<string, { bg: string; text: string }> = {
  Pending: { bg: "rgba(239,68,68,0.15)", text: "#EF4444" },
  "In Review": { bg: "rgba(245,158,11,0.15)", text: "#F59E0B" },
  Resolved: { bg: "rgba(34,197,94,0.15)", text: "#22C55E" },
};

export default function AgentFactoryPage() {
  const [specModal, setSpecModal] = useState<string | null>(null);
  const [expandedEsc, setExpandedEsc] = useState<string | null>(null);

  const openAgent = specModal ? agents.find((a) => a.id === specModal) : null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Agent Factory</h1>
        <p className="text-sm text-gray-500 mt-0.5">Deployed agents and monitoring</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {agents.map((agent) => {
          const sc = statusColors[agent.status];
          return (
            <div key={agent.id} className="rounded-xl border border-white/10 p-5" style={{ background: "#111827" }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(213,0,43,0.15)" }}>
                    <Bot size={20} style={{ color: "#D5002B" }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{agent.name}</div>
                    <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: sc.bg, color: sc.text }}>{agent.status}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase">Executions (30d)</div>
                  <div className="text-lg font-bold text-white">{agent.executions30d.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase">Success Rate</div>
                  <div className="text-lg font-bold" style={{ color: agent.successRate > 97 ? COLORS.green : COLORS.amber }}>{agent.successRate}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase">Avg Duration</div>
                  <div className="text-sm font-medium text-white">{agent.avgDuration}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase">Escalation Rate</div>
                  <div className="text-sm font-medium" style={{ color: agent.escalationRate > 10 ? COLORS.red : agent.escalationRate > 5 ? COLORS.amber : COLORS.green }}>{agent.escalationRate}%</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-[10px] text-gray-500 uppercase mb-2">Execution Trend (30d)</div>
                <ResponsiveContainer width="100%" height={60}>
                  <LineChart data={agent.executionHistory}>
                    <Line type="monotone" dataKey="count" stroke={COLORS.accent} strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mb-4">
                <div className="text-[10px] text-gray-500 uppercase mb-2">Tool Usage</div>
                <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                  {agent.tools.map((t, i) => (
                    <div key={i} className="h-full" style={{ width: `${t.pct}%`, background: i === 0 ? COLORS.accent : i === 1 ? COLORS.purple : COLORS.green }} />
                  ))}
                </div>
                <div className="flex gap-3 mt-1.5">
                  {agent.tools.map((t, i) => (
                    <div key={i} className="flex items-center gap-1 text-[9px] text-gray-500">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? COLORS.accent : i === 1 ? COLORS.purple : COLORS.green }} />
                      {t.name} {t.pct}%
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[10px] text-gray-500">Drift: <span className={agent.driftScore < 0.05 ? "text-green-400" : "text-amber-400"}>{agent.driftScore}</span></div>
                <button
                  onClick={() => setSpecModal(agent.id)}
                  className="flex items-center gap-1 text-[10px] px-2 py-1 rounded border border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <Eye size={10} /> View Spec
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-white/10 p-5" style={{ background: "#111827" }}>
        <h3 className="text-sm font-semibold text-white mb-4">Escalation Queue</h3>
        <div className="space-y-2">
          {escalations.map((esc) => {
            const sc = escStatusColors[esc.status];
            const expanded = expandedEsc === esc.id;
            return (
              <div key={esc.id} className="rounded-lg border border-white/5" style={{ background: "#1F2937" }}>
                <div
                  className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-white/5"
                  onClick={() => setExpandedEsc(expanded ? null : esc.id)}
                >
                  <div className="text-xs text-gray-500 w-32 shrink-0">{esc.timestamp}</div>
                  <div className="text-xs text-gray-400 w-48 shrink-0">{esc.agentName}</div>
                  <div className="text-sm text-white flex-1">{esc.reason}</div>
                  <span className="text-[10px] px-2 py-0.5 rounded shrink-0" style={{ background: sc.bg, color: sc.text }}>{esc.status}</span>
                  {expanded ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                </div>
                {expanded && (
                  <div className="px-4 pb-3 border-t border-white/5 pt-3">
                    <div className="text-xs text-gray-400 leading-relaxed">{esc.context}</div>
                    {esc.resolvedBy && (
                      <div className="text-[10px] text-gray-600 mt-2">Resolved by: {esc.resolvedBy}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {specModal && openAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setSpecModal(null)}>
          <div className="rounded-xl border border-white/10 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" style={{ background: "#111827" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">{openAgent.name} - Agent Spec</h3>
              <button onClick={() => setSpecModal(null)} className="text-gray-500 hover:text-white text-sm">Close</button>
            </div>
            <pre className="text-xs text-gray-300 bg-black/30 rounded-lg p-4 overflow-x-auto">
              {JSON.stringify(openAgent.spec, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
