"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, GitBranch, ListChecks, Bot, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/process-maps", label: "Process Maps", icon: GitBranch },
  { href: "/backlog", label: "Automation Backlog", icon: ListChecks },
  { href: "/agent-factory", label: "Agent Factory", icon: Bot },
  { href: "/live-feed", label: "Live Feed", icon: Radio },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 flex flex-col" style={{ background: "#1A0A1E" }}>
      <div className="h-1 w-full" style={{ background: "#D5002B" }} />
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ background: "#D5002B" }}>
            W
          </div>
          <div>
            <div className="text-sm font-semibold text-white tracking-wide">Westpac</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">OpsMirror</div>
          </div>
        </div>
        <div className="text-[9px] text-gray-600 mt-2 uppercase tracking-wider">Institutional Banking</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
              style={active ? { background: "rgba(213, 0, 43, 0.15)", borderLeft: "2px solid #D5002B" } : undefined}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-white/10">
        <div className="text-[10px] text-gray-600 uppercase tracking-widest">Powered by Snowflake</div>
      </div>
    </aside>
  );
}
