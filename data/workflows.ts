export type StepClassification = "RPA-Ready" | "Agent-Ready" | "Hybrid" | "Human-Only";
export type StepType = "golden" | "deviation" | "anomalous";

export interface WorkflowStep {
  id: string;
  name: string;
  type: StepType;
  avgDuration: string;
  avgDurationMin: number;
  costPerExec: number;
  classification: StepClassification;
  confidence: number;
  deviationRate: number;
  deviations: string[];
  automated: boolean;
}

export interface WorkflowEdge {
  source: string;
  target: string;
  frequency: number;
}

export interface Workflow {
  id: string;
  name: string;
  avgTotalDuration: string;
  steps: WorkflowStep[];
  edges: WorkflowEdge[];
}

const onboarding: Workflow = {
  id: "onboarding",
  name: "Client Onboarding",
  avgTotalDuration: "4.2 hours",
  steps: [
    { id: "ob-1", name: "Receive Request", type: "golden", avgDuration: "5 min", avgDurationMin: 5, costPerExec: 8, classification: "RPA-Ready", confidence: 0.97, deviationRate: 2, deviations: ["Incomplete form resubmit"], automated: true },
    { id: "ob-2", name: "KYC Check", type: "golden", avgDuration: "18 min", avgDurationMin: 18, costPerExec: 85, classification: "RPA-Ready", confidence: 0.96, deviationRate: 5, deviations: ["Manual data entry fallback", "System timeout retry"], automated: true },
    { id: "ob-3", name: "ID Verification", type: "golden", avgDuration: "12 min", avgDurationMin: 12, costPerExec: 45, classification: "Agent-Ready", confidence: 0.91, deviationRate: 8, deviations: ["Document quality rejection", "Manual photo match"], automated: true },
    { id: "ob-4", name: "PEP/Sanctions Screen", type: "golden", avgDuration: "8 min", avgDurationMin: 8, costPerExec: 35, classification: "Agent-Ready", confidence: 0.88, deviationRate: 12, deviations: ["False positive review", "Enhanced Due Diligence trigger", "Sanctions list update delay"], automated: true },
    { id: "ob-4a", name: "Enhanced Due Diligence", type: "deviation", avgDuration: "2.5 hrs", avgDurationMin: 150, costPerExec: 420, classification: "Hybrid", confidence: 0.72, deviationRate: 100, deviations: ["Senior approval required", "External source verification"], automated: false },
    { id: "ob-5", name: "Risk Assessment", type: "golden", avgDuration: "15 min", avgDurationMin: 15, costPerExec: 55, classification: "Agent-Ready", confidence: 0.89, deviationRate: 6, deviations: ["Model override", "Manual risk uplift"], automated: true },
    { id: "ob-6", name: "Credit Check", type: "golden", avgDuration: "10 min", avgDurationMin: 10, costPerExec: 40, classification: "RPA-Ready", confidence: 0.95, deviationRate: 3, deviations: ["Bureau timeout"], automated: true },
    { id: "ob-7", name: "Account Setup", type: "golden", avgDuration: "20 min", avgDurationMin: 20, costPerExec: 65, classification: "RPA-Ready", confidence: 0.94, deviationRate: 4, deviations: ["Duplicate account check"], automated: true },
    { id: "ob-8", name: "Documentation Collection", type: "golden", avgDuration: "35 min", avgDurationMin: 35, costPerExec: 95, classification: "Hybrid", confidence: 0.78, deviationRate: 22, deviations: ["Document re-request loop", "Missing mandatory docs", "Client non-response follow-up"], automated: false },
    { id: "ob-8a", name: "Document Re-request", type: "deviation", avgDuration: "1.5 hrs", avgDurationMin: 90, costPerExec: 180, classification: "Human-Only", confidence: 0.65, deviationRate: 100, deviations: ["Multiple chase cycles", "Alternative document acceptance"], automated: false },
    { id: "ob-9", name: "Compliance Review", type: "golden", avgDuration: "25 min", avgDurationMin: 25, costPerExec: 110, classification: "Agent-Ready", confidence: 0.85, deviationRate: 10, deviations: ["Policy exception request", "Escalation to compliance head"], automated: true },
    { id: "ob-10", name: "Approval Routing", type: "golden", avgDuration: "15 min", avgDurationMin: 15, costPerExec: 30, classification: "RPA-Ready", confidence: 0.98, deviationRate: 2, deviations: ["Approval delegation"], automated: true },
    { id: "ob-10a", name: "Manual Override", type: "anomalous", avgDuration: "45 min", avgDurationMin: 45, costPerExec: 200, classification: "Human-Only", confidence: 0.55, deviationRate: 100, deviations: ["Senior management bypass", "Risk acceptance sign-off"], automated: false },
    { id: "ob-11", name: "Account Activation", type: "golden", avgDuration: "8 min", avgDurationMin: 8, costPerExec: 20, classification: "RPA-Ready", confidence: 0.99, deviationRate: 1, deviations: ["System sync delay"], automated: true },
    { id: "ob-12", name: "Welcome Pack", type: "golden", avgDuration: "5 min", avgDurationMin: 5, costPerExec: 12, classification: "RPA-Ready", confidence: 0.99, deviationRate: 1, deviations: [], automated: true },
    { id: "ob-13", name: "System Provisioning", type: "golden", avgDuration: "12 min", avgDurationMin: 12, costPerExec: 35, classification: "RPA-Ready", confidence: 0.96, deviationRate: 3, deviations: ["Entitlement mismatch"], automated: true },
    { id: "ob-14", name: "Relationship Assignment", type: "golden", avgDuration: "10 min", avgDurationMin: 10, costPerExec: 25, classification: "Human-Only", confidence: 0.60, deviationRate: 15, deviations: ["Portfolio rebalance", "RM capacity check"], automated: false },
  ],
  edges: [
    { source: "ob-1", target: "ob-2", frequency: 100 },
    { source: "ob-2", target: "ob-3", frequency: 100 },
    { source: "ob-3", target: "ob-4", frequency: 100 },
    { source: "ob-4", target: "ob-5", frequency: 88 },
    { source: "ob-4", target: "ob-4a", frequency: 12 },
    { source: "ob-4a", target: "ob-5", frequency: 12 },
    { source: "ob-5", target: "ob-6", frequency: 100 },
    { source: "ob-6", target: "ob-7", frequency: 100 },
    { source: "ob-7", target: "ob-8", frequency: 100 },
    { source: "ob-8", target: "ob-9", frequency: 78 },
    { source: "ob-8", target: "ob-8a", frequency: 22 },
    { source: "ob-8a", target: "ob-8", frequency: 22 },
    { source: "ob-9", target: "ob-10", frequency: 90 },
    { source: "ob-9", target: "ob-10a", frequency: 10 },
    { source: "ob-10a", target: "ob-11", frequency: 10 },
    { source: "ob-10", target: "ob-11", frequency: 90 },
    { source: "ob-11", target: "ob-12", frequency: 100 },
    { source: "ob-12", target: "ob-13", frequency: 100 },
    { source: "ob-13", target: "ob-14", frequency: 100 },
  ],
};

const creditOrig: Workflow = {
  id: "credit",
  name: "Credit Origination",
  avgTotalDuration: "12 days",
  steps: [
    { id: "cr-1", name: "Client Request", type: "golden", avgDuration: "30 min", avgDurationMin: 30, costPerExec: 50, classification: "RPA-Ready", confidence: 0.95, deviationRate: 3, deviations: ["Incomplete request"], automated: true },
    { id: "cr-2", name: "Relationship Check", type: "golden", avgDuration: "20 min", avgDurationMin: 20, costPerExec: 65, classification: "Agent-Ready", confidence: 0.90, deviationRate: 5, deviations: ["New-to-bank pathway"], automated: true },
    { id: "cr-3", name: "Indicative Terms", type: "golden", avgDuration: "1.5 hrs", avgDurationMin: 90, costPerExec: 280, classification: "Hybrid", confidence: 0.82, deviationRate: 15, deviations: ["Bespoke structure request", "Pricing exception"], automated: false },
    { id: "cr-4", name: "Credit Analysis", type: "golden", avgDuration: "4 hrs", avgDurationMin: 240, costPerExec: 520, classification: "Agent-Ready", confidence: 0.87, deviationRate: 8, deviations: ["Data quality issue", "Model override"], automated: true },
    { id: "cr-5", name: "Financial Spreading", type: "golden", avgDuration: "3 hrs", avgDurationMin: 180, costPerExec: 340, classification: "Agent-Ready", confidence: 0.91, deviationRate: 6, deviations: ["Non-standard financials", "Currency conversion"], automated: true },
    { id: "cr-6", name: "Industry Assessment", type: "golden", avgDuration: "2 hrs", avgDurationMin: 120, costPerExec: 260, classification: "Agent-Ready", confidence: 0.86, deviationRate: 10, deviations: ["Emerging sector gap", "Analyst disagreement"], automated: true },
    { id: "cr-7", name: "Collateral Valuation", type: "golden", avgDuration: "2.5 hrs", avgDurationMin: 150, costPerExec: 380, classification: "Hybrid", confidence: 0.79, deviationRate: 18, deviations: ["External valuer required", "Collateral re-valuation", "Novel asset type"], automated: false },
    { id: "cr-7a", name: "Collateral Re-valuation", type: "deviation", avgDuration: "3 days", avgDurationMin: 4320, costPerExec: 1200, classification: "Human-Only", confidence: 0.58, deviationRate: 100, deviations: ["Independent valuer dispute", "Market volatility adjustment"], automated: false },
    { id: "cr-8", name: "Risk Rating", type: "golden", avgDuration: "1 hr", avgDurationMin: 60, costPerExec: 180, classification: "Agent-Ready", confidence: 0.92, deviationRate: 5, deviations: ["Rating model calibration"], automated: true },
    { id: "cr-9", name: "Pricing Model", type: "golden", avgDuration: "1.5 hrs", avgDurationMin: 90, costPerExec: 290, classification: "Agent-Ready", confidence: 0.88, deviationRate: 12, deviations: ["Competitive match override", "Cross-sell discount"], automated: true },
    { id: "cr-10", name: "Term Sheet Draft", type: "golden", avgDuration: "2 hrs", avgDurationMin: 120, costPerExec: 310, classification: "Agent-Ready", confidence: 0.85, deviationRate: 8, deviations: ["Non-standard clause request"], automated: true },
    { id: "cr-11", name: "Internal Review", type: "golden", avgDuration: "1 hr", avgDurationMin: 60, costPerExec: 200, classification: "Human-Only", confidence: 0.62, deviationRate: 20, deviations: ["Senior reviewer unavailable", "Major revision required"], automated: false },
    { id: "cr-12", name: "Credit Committee Prep", type: "golden", avgDuration: "3 hrs", avgDurationMin: 180, costPerExec: 450, classification: "Agent-Ready", confidence: 0.84, deviationRate: 7, deviations: ["Additional analysis requested"], automated: true },
    { id: "cr-13", name: "Committee Presentation", type: "golden", avgDuration: "45 min", avgDurationMin: 45, costPerExec: 350, classification: "Human-Only", confidence: 0.55, deviationRate: 25, deviations: ["Committee deferral", "Conditional approval", "Rejection"], automated: false },
    { id: "cr-13a", name: "Committee Deferral", type: "deviation", avgDuration: "5 days", avgDurationMin: 7200, costPerExec: 1800, classification: "Human-Only", confidence: 0.50, deviationRate: 100, deviations: ["Additional conditions imposed", "Restructure required"], automated: false },
    { id: "cr-14", name: "Approval / Conditions", type: "golden", avgDuration: "30 min", avgDurationMin: 30, costPerExec: 80, classification: "RPA-Ready", confidence: 0.94, deviationRate: 4, deviations: ["Conditions rework"], automated: true },
    { id: "cr-14a", name: "Conditions Rework", type: "deviation", avgDuration: "2 days", avgDurationMin: 2880, costPerExec: 950, classification: "Hybrid", confidence: 0.70, deviationRate: 100, deviations: ["Legal counsel involvement", "Client negotiation"], automated: false },
    { id: "cr-15", name: "Legal Documentation", type: "golden", avgDuration: "4 hrs", avgDurationMin: 240, costPerExec: 650, classification: "Hybrid", confidence: 0.76, deviationRate: 14, deviations: ["Bespoke legal drafting", "External counsel review"], automated: false },
    { id: "cr-16", name: "Facility Setup", type: "golden", avgDuration: "1 hr", avgDurationMin: 60, costPerExec: 120, classification: "RPA-Ready", confidence: 0.96, deviationRate: 2, deviations: ["System configuration error"], automated: true },
    { id: "cr-17", name: "Limit Loading", type: "golden", avgDuration: "30 min", avgDurationMin: 30, costPerExec: 55, classification: "RPA-Ready", confidence: 0.97, deviationRate: 1, deviations: [], automated: true },
    { id: "cr-18", name: "Drawdown Enablement", type: "golden", avgDuration: "20 min", avgDurationMin: 20, costPerExec: 40, classification: "RPA-Ready", confidence: 0.98, deviationRate: 1, deviations: [], automated: true },
  ],
  edges: [
    { source: "cr-1", target: "cr-2", frequency: 100 },
    { source: "cr-2", target: "cr-3", frequency: 100 },
    { source: "cr-3", target: "cr-4", frequency: 100 },
    { source: "cr-4", target: "cr-5", frequency: 100 },
    { source: "cr-5", target: "cr-6", frequency: 100 },
    { source: "cr-6", target: "cr-7", frequency: 100 },
    { source: "cr-7", target: "cr-8", frequency: 82 },
    { source: "cr-7", target: "cr-7a", frequency: 18 },
    { source: "cr-7a", target: "cr-8", frequency: 18 },
    { source: "cr-8", target: "cr-9", frequency: 100 },
    { source: "cr-9", target: "cr-10", frequency: 100 },
    { source: "cr-10", target: "cr-11", frequency: 100 },
    { source: "cr-11", target: "cr-12", frequency: 100 },
    { source: "cr-12", target: "cr-13", frequency: 100 },
    { source: "cr-13", target: "cr-14", frequency: 75 },
    { source: "cr-13", target: "cr-13a", frequency: 25 },
    { source: "cr-13a", target: "cr-12", frequency: 25 },
    { source: "cr-14", target: "cr-15", frequency: 86 },
    { source: "cr-14", target: "cr-14a", frequency: 14 },
    { source: "cr-14a", target: "cr-14", frequency: 14 },
    { source: "cr-15", target: "cr-16", frequency: 100 },
    { source: "cr-16", target: "cr-17", frequency: 100 },
    { source: "cr-17", target: "cr-18", frequency: 100 },
  ],
};

const gtsPayments: Workflow = {
  id: "gts",
  name: "GTS Payments",
  avgTotalDuration: "45 sec (auto) / 12 min (exceptions)",
  steps: [
    { id: "gts-1", name: "Payment Instruction", type: "golden", avgDuration: "2 sec", avgDurationMin: 0.03, costPerExec: 0.5, classification: "RPA-Ready", confidence: 0.99, deviationRate: 1, deviations: ["Malformed instruction"], automated: true },
    { id: "gts-2", name: "Validation & Enrichment", type: "golden", avgDuration: "3 sec", avgDurationMin: 0.05, costPerExec: 1.2, classification: "RPA-Ready", confidence: 0.98, deviationRate: 3, deviations: ["Missing beneficiary details", "Account mismatch"], automated: true },
    { id: "gts-3", name: "Sanctions Screening", type: "golden", avgDuration: "5 sec", avgDurationMin: 0.08, costPerExec: 12, classification: "Agent-Ready", confidence: 0.88, deviationRate: 8, deviations: ["False positive hit", "Partial name match", "Country risk flag"], automated: true },
    { id: "gts-3a", name: "Sanctions Manual Review", type: "deviation", avgDuration: "25 min", avgDurationMin: 25, costPerExec: 180, classification: "Human-Only", confidence: 0.52, deviationRate: 100, deviations: ["True positive escalation", "Regulatory reporting"], automated: false },
    { id: "gts-4", name: "Fraud Check", type: "golden", avgDuration: "4 sec", avgDurationMin: 0.07, costPerExec: 8, classification: "Agent-Ready", confidence: 0.90, deviationRate: 5, deviations: ["Velocity alert", "Pattern anomaly"], automated: true },
    { id: "gts-5", name: "Limit Check", type: "golden", avgDuration: "2 sec", avgDurationMin: 0.03, costPerExec: 1.5, classification: "RPA-Ready", confidence: 0.97, deviationRate: 4, deviations: ["Limit breach escalation", "Temporary limit override"], automated: true },
    { id: "gts-5a", name: "Limit Breach Escalation", type: "deviation", avgDuration: "15 min", avgDurationMin: 15, costPerExec: 120, classification: "Hybrid", confidence: 0.75, deviationRate: 100, deviations: ["RM approval required", "Limit increase request"], automated: false },
    { id: "gts-6", name: "FX Conversion", type: "golden", avgDuration: "3 sec", avgDurationMin: 0.05, costPerExec: 2.5, classification: "RPA-Ready", confidence: 0.96, deviationRate: 2, deviations: ["Rate spike hold"], automated: true },
    { id: "gts-7", name: "Routing", type: "golden", avgDuration: "2 sec", avgDurationMin: 0.03, costPerExec: 1.0, classification: "RPA-Ready", confidence: 0.98, deviationRate: 3, deviations: ["Failed routing retry", "Alternate corridor"], automated: true },
    { id: "gts-7a", name: "Failed Routing Retry", type: "anomalous", avgDuration: "8 min", avgDurationMin: 8, costPerExec: 65, classification: "Agent-Ready", confidence: 0.82, deviationRate: 100, deviations: ["Correspondent bank timeout", "SWIFT network issue"], automated: true },
    { id: "gts-8", name: "Execution", type: "golden", avgDuration: "5 sec", avgDurationMin: 0.08, costPerExec: 3.0, classification: "RPA-Ready", confidence: 0.99, deviationRate: 1, deviations: [], automated: true },
    { id: "gts-9", name: "Confirmation", type: "golden", avgDuration: "3 sec", avgDurationMin: 0.05, costPerExec: 1.0, classification: "RPA-Ready", confidence: 0.99, deviationRate: 1, deviations: [], automated: true },
    { id: "gts-10", name: "Reconciliation", type: "golden", avgDuration: "8 sec", avgDurationMin: 0.13, costPerExec: 5.0, classification: "Agent-Ready", confidence: 0.87, deviationRate: 6, deviations: ["Break investigation", "Nostro mismatch"], automated: true },
  ],
  edges: [
    { source: "gts-1", target: "gts-2", frequency: 100 },
    { source: "gts-2", target: "gts-3", frequency: 100 },
    { source: "gts-3", target: "gts-4", frequency: 92 },
    { source: "gts-3", target: "gts-3a", frequency: 8 },
    { source: "gts-3a", target: "gts-4", frequency: 8 },
    { source: "gts-4", target: "gts-5", frequency: 100 },
    { source: "gts-5", target: "gts-6", frequency: 96 },
    { source: "gts-5", target: "gts-5a", frequency: 4 },
    { source: "gts-5a", target: "gts-6", frequency: 4 },
    { source: "gts-6", target: "gts-7", frequency: 100 },
    { source: "gts-7", target: "gts-8", frequency: 97 },
    { source: "gts-7", target: "gts-7a", frequency: 3 },
    { source: "gts-7a", target: "gts-8", frequency: 3 },
    { source: "gts-8", target: "gts-9", frequency: 100 },
    { source: "gts-9", target: "gts-10", frequency: 100 },
  ],
};

export const workflows: Workflow[] = [onboarding, creditOrig, gtsPayments];

export function getAllSteps() {
  return workflows.flatMap((w) =>
    w.steps.map((s) => ({ ...s, workflowId: w.id, workflowName: w.name }))
  );
}
