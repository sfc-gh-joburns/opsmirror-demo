# OpsMirror - Workflow Digital Twin

OpsMirror is an operational intelligence platform that captures, models, and visualizes enterprise workflows as interactive digital twins. It provides end-to-end visibility into how institutional banking processes actually execute in production, identifies automation opportunities, and monitors deployed AI agents that automate those processes.

## What the App Does

OpsMirror solves a core problem in enterprise operations: understanding what people actually do at their desks versus what the process documentation says they should do. It builds a "digital twin" of operational workflows by modeling every step, deviation, and exception path, then layers on automation classification, cost analysis, and live agent monitoring.

The platform covers three institutional banking workflows:

- **Client Onboarding** - 17 steps from initial request through KYC, sanctions screening, account setup, and relationship assignment (avg 4.2 hours)
- **Credit Origination** - 21 steps from client request through credit analysis, committee presentation, legal documentation, and facility setup (avg 12 days)
- **GTS Payments** - 13 steps from payment instruction through sanctions screening, fraud checks, FX conversion, and reconciliation (avg 45 sec auto / 12 min exceptions)

Each workflow step is classified into one of four automation categories:

| Classification | Meaning |
|---|---|
| **RPA-Ready** | Deterministic, rule-based steps suitable for traditional robotic process automation |
| **Agent-Ready** | Steps requiring judgment, context, or unstructured data handling - candidates for AI agent automation |
| **Hybrid** | Steps needing a combination of automation and human oversight |
| **Human-Only** | Steps that require human decision-making, negotiation, or regulatory sign-off |

## How It Works

### Architecture

OpsMirror is a Next.js 15 application using the App Router, deployed as a containerized service on Snowpark Container Services (SPCS). The UI is built with React 19, Tailwind CSS v4, Recharts for data visualization, and React Flow for interactive process map rendering.

All workflow data is currently embedded as TypeScript data modules (`data/workflows.ts`, `data/agents.ts`, `data/events.ts`), making the app fully self-contained with no external database dependencies.

### Pages

#### 1. Executive Dashboard (`/`)

The landing page provides a high-level operational summary:

- **KPI cards** showing total workflows mapped, steps modeled, automation rate, agent executions (30d), escalation rate, and projected annual savings
- **Automation Coverage by Workflow** - stacked bar chart showing the distribution of RPA-Ready, Agent-Ready, Hybrid, and Human-Only steps across each workflow
- **Step Classification Distribution** - donut chart of all steps by automation classification
- **Cumulative Cost Savings** - 12-month trend line showing projected savings ramp from $120K to $4.2M
- **Top 5 Bottleneck Steps** - horizontal bar chart identifying the slowest steps across all workflows by average duration

#### 2. Process Maps (`/process-maps`)

Interactive digital twin visualization built on React Flow:

- Renders each workflow as a directed graph with golden path (happy path), deviation, and anomalous nodes
- Three overlay modes toggle how nodes are colored:
  - **Path Type** - green for golden path, amber for deviations, red for anomalous
  - **Automation** - color-coded by automation classification
  - **Time Heatmap** - opacity scales with step duration, highlighting bottlenecks
- Edge thickness represents transition frequency (percentage of executions that take each path)
- Clicking any step node opens a detail panel showing duration, cost per execution, confidence score, deviation rate, automation status, and observed deviation descriptions

#### 3. Automation Backlog (`/backlog`)

A prioritized, sortable table of all workflow steps ranked by ROI score:

- Each step has a computed ROI score based on cost per execution, automation savings rate, confidence, and deviation rate
- Sortable by step name, confidence, cost per execution, savings, or ROI score
- Filterable by automation classification
- **What-If Scenario panel** - select rows via checkboxes to model the impact of automating specific steps, showing projected savings (annualized), FTE reduction, and Cost-to-Income (CTI) ratio improvement
- **Cumulative Savings chart** - bar chart of the top 12 steps by ROI showing individual and cumulative savings potential

#### 4. Agent Factory (`/agent-factory`)

Monitoring dashboard for three deployed AI agents that automate workflow steps:

- **KYC Onboarding Agent** (Production) - 423 executions/30d, 97.2% success rate, uses Cortex Analyst + Cortex Search + SQL execution
- **Credit Analysis Agent** (Shadow Mode) - 89 executions/30d, 94.4% success rate, running in parallel with human analysts
- **Payment Screening Agent** (Production) - 735 executions/30d, 99.1% success rate, 4.2 sec average duration

Each agent card shows execution trends (30d sparkline), tool usage breakdown, drift score, and a "View Spec" button that displays the agent's configuration (model, instructions, tools) as JSON.

Below the agent cards is an **Escalation Queue** showing recent cases where agents escalated to human review, including PEP matches, non-standard financials, sanctions flags, velocity alerts, and complex ownership structures. Each escalation is expandable to show full context.

#### 5. Live Feed (`/live-feed`)

A real-time simulation of desktop telemetry capture, replaying a recorded session of an operator (Sarah Chen) completing a client onboarding:

- Events stream in at configurable speed (1x, 2x, 5x) showing app switches, form fills, searches, data entry, file uploads, email sends, clicks, copy-paste actions, and navigation
- Right panel tracks workflow progress through the golden path steps with current step highlighted
- Each event is color-coded by type with a legend
- Play/pause controls allow stopping the feed to examine specific events

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.3 (App Router, standalone output) |
| UI | React 19, Tailwind CSS v4 |
| Charts | Recharts 2.15 |
| Process Maps | @xyflow/react 12.4 (React Flow) |
| Icons | Lucide React |
| Animations | Framer Motion 12.4 |
| Language | TypeScript 5 |
| Deployment | Docker (node:20-alpine), Snowpark Container Services |

## Project Structure

```
opsmirror-demo/
├── app/
│   ├── layout.tsx              # Root layout with sidebar
│   ├── page.tsx                # Executive Dashboard
│   ├── globals.css             # Theme variables and base styles
│   ├── agent-factory/page.tsx  # Agent monitoring
│   ├── backlog/page.tsx        # Automation backlog
│   ├── live-feed/page.tsx      # Telemetry replay
│   └── process-maps/page.tsx   # Interactive process maps
├── components/
│   ├── Sidebar.tsx             # Navigation sidebar
│   ├── KPICard.tsx             # Metric card component
│   ├── ClassificationBadge.tsx # Automation classification badge
│   └── StepDetailPanel.tsx     # Process map step detail drawer
├── data/
│   ├── workflows.ts            # Workflow definitions (steps, edges, metadata)
│   ├── agents.ts               # Agent configs, execution history, escalations
│   └── events.ts               # Telemetry event sequence
├── lib/
│   └── utils.ts                # Shared utilities and color constants
├── Dockerfile                  # Multi-stage Docker build
├── next.config.js              # Standalone output config
└── package.json
```

## Getting Started

### Local Development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3002`.

### Docker Build

```bash
docker build --platform linux/amd64 -t opsmirror:latest .
docker run -p 8080:8080 opsmirror:latest
```

### Deploy to Snowpark Container Services

1. Create an image repository and compute pool in your Snowflake account
2. Authenticate with the Snowflake container registry
3. Tag and push the image
4. Create the service:

```sql
CREATE SERVICE OPSMIRROR_SERVICE
  IN COMPUTE POOL <your_compute_pool>
  FROM SPECIFICATION $$
spec:
  containers:
  - name: opsmirror
    image: /<db>/<schema>/<repo>/opsmirror:latest
    env:
      HOSTNAME: "0.0.0.0"
      PORT: "8080"
      NODE_ENV: production
    readinessProbe:
      port: 8080
      path: /
  endpoints:
  - name: opsmirror-ui
    port: 8080
    public: true
$$
  MIN_INSTANCES = 1
  MAX_INSTANCES = 1;
```

5. Get the public URL:

```sql
SHOW ENDPOINTS IN SERVICE OPSMIRROR_SERVICE;
```
