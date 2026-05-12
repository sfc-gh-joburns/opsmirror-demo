"use client";

import { useState, useMemo } from "react";
import { getAllSteps } from "@/data/workflows";
import ClassificationBadge from "@/components/ClassificationBadge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { COLORS, formatCurrency } from "@/lib/utils";
import { ArrowUpDown, Filter, TrendingUp } from "lucide-react";

type SortKey = "roiScore" | "costPerExec" | "savings" | "confidence" | "name";

export default function BacklogPage() {
  const [sortBy, setSortBy] = useState<SortKey>("roiScore");
  const [sortAsc, setSortAsc] = useState(false);
  const [filterClass, setFilterClass] = useState<string>("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSteps = useMemo(() => {
    return getAllSteps()
      .filter((s) => s.classification !== "Human-Only" || s.confidence > 0.6)
      .map((s) => {
        const savingsRate = s.classification === "RPA-Ready" ? 0.92 : s.classification === "Agent-Ready" ? 0.85 : 0.6;
        const savings = Math.round(s.costPerExec * savingsRate);
        const roiScore = Math.round(savings * s.confidence * (1 - s.deviationRate / 100) * 100 / (s.costPerExec || 1));
        return { ...s, savings, roiScore: Math.min(roiScore, 99) };
      });
  }, []);

  const filtered = useMemo(() => {
    let items = [...allSteps];
    if (filterClass !== "All") items = items.filter((s) => s.classification === filterClass);
    items.sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      if (sortBy === "name") return dir * a.name.localeCompare(b.name);
      return dir * ((a as unknown as Record<string, number>)[sortBy] - (b as unknown as Record<string, number>)[sortBy]);
    });
    return items;
  }, [allSteps, filterClass, sortBy, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortAsc(!sortAsc);
    else { setSortBy(key); setSortAsc(false); }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const selectedItems = allSteps.filter((s) => selected.has(s.id));
  const totalSavings = selectedItems.reduce((a, b) => a + b.savings, 0);
  const totalCost = selectedItems.reduce((a, b) => a + b.costPerExec, 0);
  const fteImpact = (totalSavings / 120000).toFixed(1);
  const baseCTI = 44;
  const ctiReduction = selectedItems.length > 0 ? (totalSavings / (totalCost * 50 || 1)) * 3 : 0;
  const projectedCTI = Math.max(baseCTI - ctiReduction, 30).toFixed(1);

  const waterfallData = useMemo(() => {
    const sorted = [...allSteps].sort((a, b) => b.roiScore - a.roiScore).slice(0, 12);
    let cum = 0;
    return sorted.map((s) => {
      cum += s.savings;
      return { name: s.name.length > 15 ? s.name.slice(0, 13) + "..." : s.name, savings: s.savings, cumulative: cum };
    });
  }, [allSteps]);

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      className="text-left text-[10px] uppercase text-gray-500 font-medium px-3 py-2 cursor-pointer hover:text-gray-300"
      onClick={() => toggleSort(field)}
    >
      <span className="flex items-center gap-1">
        {label} <ArrowUpDown size={10} className={sortBy === field ? "text-white" : ""} />
      </span>
    </th>
  );

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Automation Backlog</h1>
          <p className="text-sm text-gray-500 mt-0.5">Ranked candidates by ROI score</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-500" />
          {["All", "RPA-Ready", "Agent-Ready", "Hybrid", "Human-Only"].map((c) => (
            <button
              key={c}
              onClick={() => setFilterClass(c)}
              className={`px-2.5 py-1 rounded text-[11px] border ${
                filterClass === c ? "border-white/20 bg-white/10 text-white" : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-white/10 p-4" style={{ background: "#111827" }}>
          <div className="text-[10px] uppercase text-gray-500 mb-1">Selected Savings</div>
          <div className="text-2xl font-bold text-white">{formatCurrency(totalSavings)}</div>
          <div className="text-[10px] text-gray-500">{selectedItems.length} steps selected</div>
        </div>
        <div className="rounded-xl border border-white/10 p-4" style={{ background: "#111827" }}>
          <div className="text-[10px] uppercase text-gray-500 mb-1">FTE Impact</div>
          <div className="text-2xl font-bold text-white">{fteImpact}</div>
          <div className="text-[10px] text-gray-500">headcount equivalent</div>
        </div>
        <div className="rounded-xl border border-white/10 p-4" style={{ background: "#111827" }}>
          <div className="text-[10px] uppercase text-gray-500 mb-1">CTI Ratio Impact</div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-white">{projectedCTI}%</div>
            <div className="text-sm" style={{ color: COLORS.green }}>from {baseCTI}%</div>
          </div>
          <div className="text-[10px] text-gray-500">projected after automation</div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="col-span-3 rounded-xl border border-white/10 p-5" style={{ background: "#111827" }}>
          <h3 className="text-sm font-semibold text-white mb-3">Cumulative Savings (Top 12 by ROI)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={waterfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 9 }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} tickFormatter={(v: number) => `$${v}`} />
              <Tooltip
                contentStyle={{ background: "#1F2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number, name: string) => [`$${v.toLocaleString()}`, name === "savings" ? "Step Savings" : "Cumulative"]}
              />
              <Bar dataKey="savings" fill={COLORS.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-2 rounded-xl border border-white/10 p-5" style={{ background: "#111827" }}>
          <h3 className="text-sm font-semibold text-white mb-3">What-If Scenario</h3>
          <p className="text-xs text-gray-500 mb-3">Select rows in the table to model automation impact</p>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Steps to automate</span>
              <span className="text-white font-medium">{selectedItems.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Current cost (annual)</span>
              <span className="text-white font-medium">{formatCurrency(totalCost * 260)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Projected savings</span>
              <span className="font-medium" style={{ color: COLORS.green }}>{formatCurrency(totalSavings * 260)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">FTE reduction</span>
              <span className="font-medium" style={{ color: COLORS.green }}>{fteImpact} FTEs</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between text-sm">
              <span className="text-gray-400">CTI ratio</span>
              <span className="flex items-center gap-2">
                <span className="text-gray-500 line-through">{baseCTI}%</span>
                <TrendingUp size={14} style={{ color: COLORS.green }} />
                <span className="font-bold" style={{ color: COLORS.green }}>{projectedCTI}%</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "#111827" }}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="w-10 px-3 py-2" />
              <SortHeader label="Step" field="name" />
              <th className="text-left text-[10px] uppercase text-gray-500 font-medium px-3 py-2">Workflow</th>
              <th className="text-left text-[10px] uppercase text-gray-500 font-medium px-3 py-2">Classification</th>
              <SortHeader label="Confidence" field="confidence" />
              <SortHeader label="Cost / Exec" field="costPerExec" />
              <SortHeader label="Savings" field="savings" />
              <SortHeader label="ROI Score" field="roiScore" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr
                key={s.id}
                className={`border-b border-white/5 hover:bg-white/5 cursor-pointer ${selected.has(s.id) ? "bg-white/5" : ""}`}
                onClick={() => toggleSelect(s.id)}
              >
                <td className="px-3 py-2.5">
                  <input type="checkbox" checked={selected.has(s.id)} readOnly className="rounded" />
                </td>
                <td className="px-3 py-2.5 text-sm text-white">{s.name}</td>
                <td className="px-3 py-2.5 text-xs text-gray-400">{s.workflowName}</td>
                <td className="px-3 py-2.5"><ClassificationBadge classification={s.classification} /></td>
                <td className="px-3 py-2.5 text-sm text-gray-300">{(s.confidence * 100).toFixed(0)}%</td>
                <td className="px-3 py-2.5 text-sm text-gray-300">${s.costPerExec.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-sm font-medium" style={{ color: COLORS.green }}>${s.savings.toLocaleString()}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${s.roiScore}%`, background: s.roiScore > 80 ? COLORS.green : s.roiScore > 50 ? COLORS.amber : COLORS.red }} />
                    </div>
                    <span className="text-xs text-gray-400">{s.roiScore}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
