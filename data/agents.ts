export interface AgentExecution {
  date: string;
  count: number;
  successRate: number;
}

export interface Escalation {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  reason: string;
  context: string;
  status: "Pending" | "Resolved" | "In Review";
  resolvedBy?: string;
}

export interface Agent {
  id: string;
  name: string;
  workflowId: string;
  status: "Production" | "Shadow Mode" | "Canary";
  executions30d: number;
  successRate: number;
  avgDuration: string;
  escalationRate: number;
  driftScore: number;
  model: string;
  tools: { name: string; type: string; pct: number }[];
  executionHistory: AgentExecution[];
  spec: object;
}

const last30Days = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 2, 22);
  d.setDate(d.getDate() - (29 - i));
  return d.toISOString().slice(0, 10);
});

export const agents: Agent[] = [
  {
    id: "kyc-agent",
    name: "KYC Onboarding Agent",
    workflowId: "onboarding",
    status: "Production",
    executions30d: 423,
    successRate: 97.2,
    avgDuration: "18 min",
    escalationRate: 6.1,
    driftScore: 0.03,
    model: "claude-4-sonnet",
    tools: [
      { name: "Cortex Analyst", type: "cortex_analyst_text_to_sql", pct: 40 },
      { name: "Cortex Search", type: "cortex_search", pct: 35 },
      { name: "Execute SQL", type: "system_execute_sql", pct: 25 },
    ],
    executionHistory: last30Days.map((d, i) => ({
      date: d,
      count: 10 + Math.floor(Math.random() * 8),
      successRate: 95 + Math.random() * 4.5,
    })),
    spec: {
      models: { orchestration: "claude-4-sonnet" },
      instructions: { orchestration: "Execute KYC onboarding following the golden path. Escalate PEP hits and document failures to human review.", response: "Provide onboarding status summary with risk flags." },
      tools: [
        { tool_spec: { type: "cortex_analyst_text_to_sql", name: "client_data", description: "Query client and KYC data" } },
        { tool_spec: { type: "cortex_search", name: "compliance_playbook", description: "Search KYC/AML procedures and policies" } },
        { tool_spec: { type: "system_execute_sql", name: "execute_checks", description: "Run verification queries" } },
      ],
    },
  },
  {
    id: "credit-agent",
    name: "Credit Analysis Agent",
    workflowId: "credit",
    status: "Shadow Mode",
    executions30d: 89,
    successRate: 94.4,
    avgDuration: "2.1 hrs",
    escalationRate: 11.2,
    driftScore: 0.07,
    model: "claude-4-sonnet",
    tools: [
      { name: "Cortex Analyst", type: "cortex_analyst_text_to_sql", pct: 50 },
      { name: "Cortex Search", type: "cortex_search", pct: 25 },
      { name: "Execute SQL", type: "system_execute_sql", pct: 25 },
    ],
    executionHistory: last30Days.map((d) => ({
      date: d,
      count: 2 + Math.floor(Math.random() * 4),
      successRate: 91 + Math.random() * 6,
    })),
    spec: {
      models: { orchestration: "claude-4-sonnet" },
      instructions: { orchestration: "Perform credit analysis including financial spreading, industry assessment, and risk rating. Flag non-standard structures for human review.", response: "Credit recommendation with supporting analysis." },
      tools: [
        { tool_spec: { type: "cortex_analyst_text_to_sql", name: "credit_data", description: "Query financial, facility, and exposure data" } },
        { tool_spec: { type: "cortex_search", name: "credit_policies", description: "Search credit policies and precedent transactions" } },
        { tool_spec: { type: "system_execute_sql", name: "run_models", description: "Execute risk models and pricing calculations" } },
      ],
    },
  },
  {
    id: "payment-agent",
    name: "Payment Screening Agent",
    workflowId: "gts",
    status: "Production",
    executions30d: 735,
    successRate: 99.1,
    avgDuration: "4.2 sec",
    escalationRate: 2.8,
    driftScore: 0.01,
    model: "claude-4-sonnet",
    tools: [
      { name: "Cortex Analyst", type: "cortex_analyst_text_to_sql", pct: 30 },
      { name: "Cortex Search", type: "cortex_search", pct: 20 },
      { name: "Execute SQL", type: "system_execute_sql", pct: 50 },
    ],
    executionHistory: last30Days.map((d) => ({
      date: d,
      count: 20 + Math.floor(Math.random() * 12),
      successRate: 98 + Math.random() * 1.8,
    })),
    spec: {
      models: { orchestration: "claude-4-sonnet" },
      instructions: { orchestration: "Screen payments against sanctions lists, fraud patterns, and limits. Auto-approve clean payments. Route hits for human review.", response: "Payment screening result with confidence score." },
      tools: [
        { tool_spec: { type: "cortex_analyst_text_to_sql", name: "payment_data", description: "Query transaction and counterparty data" } },
        { tool_spec: { type: "cortex_search", name: "sanctions_lists", description: "Search sanctions and watchlists" } },
        { tool_spec: { type: "system_execute_sql", name: "execute_screening", description: "Run screening queries and limit checks" } },
      ],
    },
  },
];

export const escalations: Escalation[] = [
  { id: "esc-1", timestamp: "2026-03-22 08:42", agentId: "kyc-agent", agentName: "KYC Onboarding Agent", reason: "PEP Match - Partial Name", context: "Client 'Henderson & Partners' triggered partial match on PEP list for 'James Henderson'. Agent found 3 possible matches with confidence 0.62. Requires human verification of identity documents against PEP database photographs.", status: "Pending" },
  { id: "esc-2", timestamp: "2026-03-22 07:15", agentId: "credit-agent", agentName: "Credit Analysis Agent", reason: "Non-Standard Financial Statements", context: "Client 'Pacific Infrastructure Fund' submitted IFRS 16 financials with non-standard lease treatment. Agent unable to reconcile operating vs. finance lease classifications. Financial spreading confidence dropped to 0.58.", status: "In Review", resolvedBy: "M. Thompson" },
  { id: "esc-3", timestamp: "2026-03-21 16:30", agentId: "payment-agent", agentName: "Payment Screening Agent", reason: "Sanctions - Country Risk", context: "Outbound payment of $2.4M to correspondent bank in jurisdiction with updated OFAC restrictions. Payment originated from verified client but routing passes through flagged corridor. Agent confidence: 0.45.", status: "Resolved", resolvedBy: "A. Rodriguez" },
  { id: "esc-4", timestamp: "2026-03-21 14:22", agentId: "kyc-agent", agentName: "KYC Onboarding Agent", reason: "Document Quality Failure", context: "ID verification scan returned low confidence (0.41) for uploaded passport image. Image appears to be a photograph of a printed copy. Agent requires original high-resolution scan.", status: "Resolved", resolvedBy: "S. Chen" },
  { id: "esc-5", timestamp: "2026-03-21 11:05", agentId: "credit-agent", agentName: "Credit Analysis Agent", reason: "Committee Deferral - Additional Analysis", context: "Credit committee deferred decision on 'Austral Mining Group' $180M facility. Committee requested updated commodity price sensitivity analysis and environmental liability assessment. Agent needs human guidance on scenario parameters.", status: "In Review", resolvedBy: "J. Williams" },
  { id: "esc-6", timestamp: "2026-03-21 09:18", agentId: "payment-agent", agentName: "Payment Screening Agent", reason: "Velocity Alert - Unusual Pattern", context: "Client 'Global Trade Corp' submitted 47 payments in 15 minutes totaling $18.2M. Normal pattern is 8-12 payments/hour. Agent flagged as potential payment fraud or compromised credentials.", status: "Resolved", resolvedBy: "K. Patel" },
  { id: "esc-7", timestamp: "2026-03-20 15:45", agentId: "kyc-agent", agentName: "KYC Onboarding Agent", reason: "Complex Ownership Structure", context: "Client 'Meridian Holdings SPV III' has 6-layer ownership structure spanning 4 jurisdictions. Agent identified beneficial owners but confidence on ultimate beneficial owner (UBO) determination is 0.53 due to nominee shareholder in BVI entity.", status: "Pending" },
  { id: "esc-8", timestamp: "2026-03-20 10:30", agentId: "credit-agent", agentName: "Credit Analysis Agent", reason: "Collateral Valuation Dispute", context: "Independent valuer assessment for 'Harbour City Development' property collateral came in 22% below internal model estimate. Agent unable to reconcile gap. Market comparable data suggests valuer may have used outdated comparables.", status: "Resolved", resolvedBy: "D. Nguyen" },
];

export const savingsTrend = [
  { month: "Apr 25", savings: 120000 },
  { month: "May 25", savings: 280000 },
  { month: "Jun 25", savings: 520000 },
  { month: "Jul 25", savings: 780000 },
  { month: "Aug 25", savings: 1100000 },
  { month: "Sep 25", savings: 1450000 },
  { month: "Oct 25", savings: 1850000 },
  { month: "Nov 25", savings: 2300000 },
  { month: "Dec 25", savings: 2750000 },
  { month: "Jan 26", savings: 3200000 },
  { month: "Feb 26", savings: 3700000 },
  { month: "Mar 26", savings: 4200000 },
];
