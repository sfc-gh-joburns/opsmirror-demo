export function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export function formatNumber(n: number) {
  return n.toLocaleString("en-US");
}

export function formatPercent(n: number) {
  return `${n.toFixed(1)}%`;
}

export const COLORS = {
  accent: "#D5002B",
  green: "#22C55E",
  amber: "#F59E0B",
  red: "#EF4444",
  purple: "#A855F7",
  blue: "#3B82F6",
  teal: "#14B8A6",
  rpa: "#3B82F6",
  agent: "#D5002B",
  hybrid: "#F59E0B",
  human: "#EF4444",
  westpacRed: "#D5002B",
};

export const CLASSIFICATION_COLORS: Record<string, string> = {
  "RPA-Ready": COLORS.rpa,
  "Agent-Ready": COLORS.agent,
  Hybrid: COLORS.hybrid,
  "Human-Only": COLORS.human,
};
