# AI Integration Architecture

> A standalone desktop tool for modeling AI integration in established organizations using **ArchiMate 3.2** and **Distributed Situation Awareness (DSA)** theory.
>
> DSR paper design artifact — *"Distributed Situation Awareness Breakdown: Why AI Agents Fail in Established Organizations"*

---

## What It Does

Organizations fail at AI integration not because of technology, but because of invisible organizational constraints: misaligned responsibilities, regulatory boundaries, and broken situation awareness between management and front-line workers.

This toolkit operationalizes that insight. It gives architects a structured way to model these constraints and responsibilities before deployment — and an automated compliance check to verify the model is complete.

---

## Screenshots

| Dashboard | Architecture Diagram | Compliance Check |
|-----------|---------------------|-----------------|
| Element cards with profile completion badges | ArchiMate 3-layer SVG, auto-inferred relationships | C1–C5 check results per AI Application |

---

## Quick Start

**Requirements:** Node.js 18+ and npm.

```bash
# 1. Clone
git clone https://github.com/ZhuYxuan-AHM/AI-Integration-Archimate.git
cd AI-Integration-Archimate

# 2. Install
npm install

# 3. Run
npm start
```

> **Important:** Run from the **system Terminal** (macOS Terminal.app), not the VS Code integrated terminal. VS Code sets `ELECTRON_RUN_AS_NODE=1` which prevents Electron from launching correctly.

### Load the Demo Model

After launch, click **Open** → select `examples/demo-midtex-manufacturing.archimate`.

This loads a complete model of a Malaysian manufacturing company's customer service AI integration, with all profiles filled and all 5 compliance checks passing.

---

## Features

### 1. Structured Element Modeling

Create and edit ArchiMate 3.2 elements across all layers:

| Layer | Elements |
|-------|----------|
| **Motivation** | Stakeholder, Driver, Goal, Principle, «AI Diagnostic Assessment» |
| **Business** | Business Function, Role, Actor, Process |
| **Application** | «AI Application», «AI Model» |
| **Constraint** | Organizational Constraint |

### 2. Eight Profile Schemas

Each element type has purpose-built profile forms grounded in DSA theory:

| Profile | Applies To | Theory Link |
|---------|-----------|-------------|
| **Responsibility** | «AI Application» | Accountability chain — C1 check |
| **Model Evaluation** | «AI Application» | Independent selection — C2/C3/C4 checks |
| **AI Compliance** | «AI Application» | Regulatory boundary — C5 check |
| **Cost** | «AI Application» | Operational sustainability |
| **Model Spec** | «AI Model» | Technical specification |
| **SA Score** | «AI Diagnostic Assessment» | Endsley (1995) L1/L2/L3 |
| **DSA Score** | «AI Diagnostic Assessment» | Stanton et al. (2006) breakdown type |
| **Boundary** | Constraint | Design space within constraint |

### 3. Automated Compliance Check (C1–C5)

Runs 5 structural checks on every «AI Application» element:

| Rule | Description |
|------|-------------|
| **C1** | Responsibility Profile complete — all 6 required fields filled |
| **C2** | ≥3 candidate AI models evaluated (independent evaluation principle) |
| **C3** | Client has selected a model (client fills this, not the architect) |
| **C4** | Client selection date is after evaluation date (logical order) |
| **C5** | AI Compliance Profile present with named Compliance Officer |

### 4. Architecture Diagram

Auto-generates an ArchiMate-style layered SVG from model elements:

- Four colored layer bands (Motivation / Business / Application / Constraints)
- Relationships inferred from profile data (candidate models, selected model, constraint scope)
- AI Application shows green ✓ / red ! dot for profile completion status
- Client-selected AI Model highlighted with accent border
- Export as **PNG** (2× retina resolution, for paper figures) or **SVG** (vector, for editing)

### 5. Workflow Guide

Seven-step guided workflow with live progress detection — each step checks the actual model state and offers a direct action button to navigate to what needs to be done next.

### 6. Export to .archimate

Generates valid ArchiMate 3.2 XML. Open in the free [Archi tool](https://www.archimatetool.com/) for professional visualization, viewpoints, and diagram publishing.

### 7. EN / 中文 Interface

Full bilingual support — toggle between English and Chinese interfaces at any time. All UI text, form labels, element types, and messages switch completely.

---

## Theoretical Foundation

This toolkit implements two core principles from the paper:

**Principle 1 — AI as Tool (not Responsible Agent)**
AI Applications may only be connected to Business Roles via `UsedBy` relationships. AI cannot be assigned to Business Processes as an autonomous executor. All AI outputs require human review. Responsibility remains with the human role.

**Principle 2 — Organization as Constraint (not a Variable)**
Organizational structures, regulatory boundaries, and responsibility chains are pre-existing constraints that define the design space — not variables to optimize away. The `Boundary` profile captures what architects *can* do within each constraint (the design space), not just what is forbidden.

**DSA Theory grounding:**
- *Endsley (1995)*: SA levels — L1 Perception (PA), L2 Comprehension (CA), L3 Projection (PrA), scored 0–5
- *Stanton et al. (2006)*: DSA breakdown types — vertical (management vs. worker), horizontal (cross-department), temporal (decision vs. implementation)

The vertical DSA breakdown (low SA sharing between management and front-line workers) is the primary failure mechanism explaining why AI integration fails in established organizations. The SA Score and DSA Score profiles operationalize this diagnostic.

---

## Demo Model

`examples/demo-midtex-manufacturing.archimate`

**Scenario:** Midtex Manufacturing Co. — integrating AI into the Customer Service department for complaint handling and product inquiry assistance.

**What it demonstrates:**

- All element types across all four layers
- «Customer Service AI Bot» with all 4 profiles filled (Responsibility, Model Evaluation, Compliance, Cost)
- Three evaluated AI Model candidates: GPT-4o (selected), Claude-3-Sonnet (evaluated), Gemini-1.5-Pro (excluded — PDPA compliance gap)
- Four constraint elements with Boundary profiles explaining the design space within each constraint
- DSA Assessment: PA=3.8 / CA=2.1 / PrA=1.4 — vertical SA breakdown with sharing score of 31%
- 33 relationships (UsedBy, Influence, Composition, Assignment, etc.)
- **Compliance check: 5/5 rules pass (C1–C5)**

---

## File Structure

```
├── main.js                    Electron main process, IPC handlers, file dialogs
├── preload.js                 contextBridge — exposes electronAPI to renderer
├── renderer/
│   ├── index.html             App shell, data-i18n attributes
│   ├── app.css                Dark theme, component styles
│   ├── app.js                 UI controller, i18n (STRINGS + t()), all event handlers
│   ├── profiles-schema.js     8 profile schemas with EN/ZH labels
│   ├── compliance-checker.js  C1–C5 compliance rules
│   ├── archimate-generator.js ArchiMate 3.2 XML generator
│   └── diagram-renderer.js    SVG layered diagram + PNG/SVG export
├── examples/
│   └── demo-midtex-manufacturing.archimate   Complete demo model
└── package.json
```

---

## Build for Distribution

```bash
# macOS (DMG + ZIP)
npm run build:mac

# Windows (NSIS installer + portable)
npm run build:win

# Both platforms
npm run build:all
```

Output goes to `dist/`. Built with [electron-builder](https://www.electron.build/).

> Icon files (`assets/icon.icns` / `assets/icon.ico`) are required for distribution builds. The app runs without them in development.

---

## Technology

| Component | Technology |
|-----------|-----------|
| Desktop shell | Electron 39 |
| UI | Vanilla HTML/CSS/JS — no framework |
| Diagram | Pure SVG (generated programmatically) |
| File I/O | Electron IPC + Node.js `fs` |
| Export format | ArchiMate 3.2 XML |
| PNG export | SVG → HTML5 Canvas → Blob |

---

## Author

**Yuxuan Zhu** — PhD, Universiti Kebangsaan Malaysia (UKM)

Research: AI integration failure in established organizations through the lens of Distributed Situation Awareness theory.

---

## License

MIT
