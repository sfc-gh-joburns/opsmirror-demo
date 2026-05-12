import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color?: string;
  sub?: string;
}

export default function KPICard({ label, value, icon: Icon, color = "#D5002B", sub }: KPICardProps) {
  return (
    <div className="rounded-xl p-5 border border-white/10" style={{ background: "#111827" }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
      {sub && <div className="text-[10px] mt-1" style={{ color }}>{sub}</div>}
    </div>
  );
}
