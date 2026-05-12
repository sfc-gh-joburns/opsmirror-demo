export default function ClassificationBadge({ classification }: { classification: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    "RPA-Ready": { bg: "rgba(59,130,246,0.15)", text: "#3B82F6" },
    "Agent-Ready": { bg: "rgba(213,0,43,0.15)", text: "#D5002B" },
    Hybrid: { bg: "rgba(245,158,11,0.15)", text: "#F59E0B" },
    "Human-Only": { bg: "rgba(239,68,68,0.15)", text: "#EF4444" },
  };
  const c = colors[classification] || colors["Human-Only"];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium"
      style={{ background: c.bg, color: c.text }}
    >
      {classification}
    </span>
  );
}
