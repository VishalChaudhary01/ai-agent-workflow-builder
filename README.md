# AI Agent Workflow Builder

> A visual, node-based platform for building, orchestrating, and deploying multi-step AI agent workflows — no code required.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)

---

FlowAI is an n8n-inspired AI workflow builder where users visually compose chains of nodes — LLM agents, HTTP APIs, conditional branches, loops, and human approval gates — into executable pipelines. Each workflow is saved to the database and can be tested live via an integrated chat preview interface.
Think of it as a programmable AI middleware layer: instead of hardcoding prompt chains, users wire them visually and the backend execution engine runs them dynamically.

---

## Key Features

- **Visual canvas** — Node editor built on ReactFlow with auto-layout, minimap, and keyboard shortcuts
- **Multi-LLM support** — route to Gemini, GPT-4o, or Claude per agent node; swap models without touching code
- **Dynamic execution engine** — a TypeScript class that traverses the node graph at runtime, piping `lastOutput` between nodes
- **Template interpolation** — `{{city}}`, `{{input}}`, `{{userMessage}}` resolved from shared execution context in URL and body templates
- **Conditional branching** — IfElse nodes evaluate JavaScript expressions (via `new Function`) against live context variables
- **Loop support** — WhileNode drives iterative sub-graphs with configurable max-iteration safety caps
- **Live preview** — integrated chat UI that runs the full workflow on each message and streams the result back
- **JSON output mode** — agents can be set to emit structured JSON; the runner validates, strips markdown fences, and spreads fields into context automatically
-

---

## Execution Engine Deep Dive

The core of the project is `WorkflowRunner` — a stateful class that walks the node graph and executes each node in sequence.

## Node Types

- **startNode** — Entry point, seeds `lastOutput` with user message
- **agentNode** — Calls LLM with a system prompt, model, instruction, temperature, maxTokens, outputFormat
- **apiNode** — HTTP request with `{{template}}` URL/body, url, method, headers, body, responseField
- **ifElseNode** — Routes to IF or ELSE branch via JS expression, ifCondition
- **whileNode** — Loops a sub-graph while condition is true, condition
- **userApprovalNode** — Human-in-the-loop pause point, (Need to add webhook for user approval)
- **endNode** — Terminal node, stops execution

## Preview

<img width="1362" height="676" alt="Screenshot 2026-03-10 151111" src="https://github.com/user-attachments/assets/f8ac7c48-c5c8-4365-890a-d25e69ef3f5a" />
<img width="1360" height="621" alt="Screenshot 2026-03-10 151208" src="https://github.com/user-attachments/assets/0eb812c5-0107-4140-b1f6-165b8381ac6d" />
<img width="1362" height="628" alt="Screenshot 2026-03-10 160800" src="https://github.com/user-attachments/assets/f69be76d-6589-4b4c-bb70-54a475a4a1a5" />
