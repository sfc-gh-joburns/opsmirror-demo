"use client";

import KPICard from "@/components/KPICard";
import { workflows, getAllSteps } from "@/data/workflows";
import { agents, savingsTrend } from "@/data/agents";
import { GitBranch, Layers, Zap, Play, AlertTriangle, DollarSign } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { COLORS } from "@/lib/utils";

const allSteps = getAllSteps();

const classificationCounts = [
  { name: "Agent-Ready", value: allSteps.filter((s) => s.classification === "Agent-Ready").length, color: COLORS.agent },
  { name: "RPA-Ready", value: allSteps.filter((s) => s.classification === "RPA-Ready").length, color: COLORS.rpa },
  { name: "Hybrid", value: allSteps.filter((s) => s.classification === "Hybrid").length, color: COLORS.hybrid },
  { name: "Human-Only", value: allSteps.filter((s) => s.classification === "Human-Only").length, color: COLORS.human },
];

const automationByWorkflow = workflows.map((w) => {
  const steps = w.steps;
  return {
    name: w.name.length > 16 ? w.name.slice(0, 14) + "..." : w.name,
    "RPA-Ready": steps.filter((s) => s.classification === "RPA-Ready").length,
    "Agent-Ready": steps.filter((s) => s.classification === "Agent-Ready").length,
    Hybrid: steps.filter((s) => s.classification === "Hybrid").length,
    "Human-Only": steps.filter((s) => s.classification === "Human-Only").length,
  };
});

const bottleneckSteps = [...allSteps]
  .sort((a, b) => b.avgDurationMin - a.avgDurationMin)
  .slice(0, 5)
  .map((s) => ({
    name: s.name.length > 20 ? s.name.slice(0, 18) + "..." : s.name,
    duration: s.avgDurationMin,
    workflow: s.workflowName,
  }));

const totalExecs = agents.reduce((a, b) => a + b.executions30d, 0);
const avgEscalation = agents.reduce((a, b) => a + b.escalationRate, 0) / agents.length;
const automatedSteps = allSteps.filter((s) => s.automated).length;
const automationRate = Math.round((automatedSteps / allSteps.length) * 100);

const tooltipStyle = {
  contentStyle: { background: "#1F2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "#9CA3AF" },
};

export default function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Executive Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Workflow Digital Twin Overview</p>
      </div>

      <div className="grid grid-cols-6 gap-4 mb-6">
        <KPICard label="Workflows Mapped" value="3" icon={GitBranch} color={COLORS.accent} />
        <KPICard label="Steps Modeled" value={allSteps.length.toString()} icon={Layers} color={COLORS.purple} />
        <KPICard label="Automation Rate" value={`${automationRate}%`} icon={Zap} color={COLORS.green} sub={`${automatedSteps} of ${allSteps.length} steps`} />
        <KPICard label="Agent Executions (30d)" value={totalExecs.toLocaleString()} icon={Play} color={COLORS.accent} />
        <KPICard label="Escalation Rate" value={`${avgEscalation.toFixed(1)}%`} icon={AlertTriangle} color={COLORS.amber} />
        <KPICard label="Projected Savings" value="$4.2M" icon={DollarSign} color={COLORS.green} sub="Annual run-rate" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 p-5" style={{ background: "#111827" }}>
          <h3 className="text-sm font-semibold text-white mb-4">Automation Coverage by Workflow</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={automationByWorkflow} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 11 }} width={110} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="RPA-Ready" stackId="a" fill={COLORS.rpa} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Agent-Ready" stackId="a" fill={COLORS.agent} />
              <Bar dataKey="Hybrid" stackId="a" fill={COLORS.hybrid} />
              <Bar dataKey="Human-Only" stackId="a" fill={COLORS.human} radius={[0, 4, 4, 0]} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#9CA3AF" }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-white/10 p-5" style={{ background: "#111827" }}>
          <h3 className="text-sm font-semibold text-white mb-4">Step Classification Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={classificationCounts}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {classificationCounts.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-white/10 p-5" style={{ background: "#111827" }}>
          <h3 className="text-sm font-semibold text-white mb-4">Cumulative Cost Savings (12 Months)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={savingsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} tickFormatter={(v: number) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [`$${(v / 1000000).toFixed(2)}M`, "Savings"]} />
              <Line type="monotone" dataKey="savings" stroke={COLORS.green} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-white/10 p-5" style={{ background: "#111827" }}>
          <h3 className="text-sm font-semibold text-white mb-4">Top 5 Bottleneck Steps (Avg Duration)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={bottleneckSteps} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" tick={{ fill: "#9CA3AF", fontSize: 11 }} tickFormatter={(v: number) => v >= 60 ? `${(v / 60).toFixed(0)}h` : `${v}m`} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 11 }} width={130} />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [v >= 60 ? `${(v / 60).toFixed(1)} hours` : `${v} min`, "Avg Duration"]} />
              <Bar dataKey="duration" fill={COLORS.red} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
