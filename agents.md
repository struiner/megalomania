# AGENTS.md
# Megalomania (Codename: Anna)
# Global Agents & Project Charter

## 0. Authority Statement

This document is the **highest authority** governing all agents (human and AI).
If any other source conflicts with this file, this file prevails.

AGENTS.db may inform decisions but may not override, amend, or reinterpret this document.

---

## 1. Project Context (Binding)

Megalomania (codename **Anna**) is a deterministic, ledger-first grand-strategy
and economic simulation built with Angular/TypeScript.

All authoritative truth is emitted as immutable ledger events.
All state is derived.
All systems must be rebuildable from the ledger.

---

## 2. Core Invariants (Non-Negotiable)

The following invariants apply to *all* work:

- **Ledger-first world model**
- **Determinism above convenience**
- **Domain ownership**
- **Horizontal scalability**

Violation of any invariant requires escalation and written justification.

---

## 3. Agent Roles & Domain Ownership (Authoritative)

Each agent is the **single source of truth** for its domain.

Agents may not reinterpret other domains.

| Agent | Domain | Authority |
|------|-------|-----------|
| Project Manager | Coordination | Final authority on scope, sequencing, escalation |
| Game Designer | Vision & UI | Final authority on mechanics intent and ergonomics |
| Ledger Engineer | Ledger | Veto over determinism, integrity, rebuildability |
| World Generator | World | Final authority on world generation logic |
| Economy Engineer | Economy | Final authority on goods and markets |
| Frontend Developer | UI | Final authority on UI structure and flow |
| SDK & Modding Engineer | Extensibility | Final authority on APIs and mod hooks |
| QA & Test Engineer | Verification | Blocking authority on failing criteria |

---

## 4. Cross-Domain Rules

- Each agent owns exactly one domain.
- Cross-domain effects require escalation to Project Manager.
- Vetoes must cite violated invariants.
- Ambiguity must be documented and escalated.

---

## 5. Fidelity & Abstraction (Binding)

All work must target one fidelity stage:

1. Conceptual
2. Structural
3. Functional
4. Refinement

**Default to the lowest viable stage.**
Stop early if details are omitted.

Promotion requires explicit approval.

---

## 6. UI & Ergonomics (Binding)

UI work must comply with the UI & Ergonomics Charter.

Key rules:
- HUD is an instrument
- Center screen is sacred
- Max 8 primary actions
- UI owns no truth
- Pixel-grid aligned, 16-bit heritage

Deviation requires approval.

---

## 7. Task Specification Rules

All tasks must include:
- Summary
- Non-goals
- Target fidelity
- Agent assignments
- Deliverables
- Dependencies
- Open questions

Tasks may not invent mechanics or reinterpret TODOs.

---

## 8. Escalation Triggers

Escalate to Project Manager when:
- Multiple domains are affected
- Invariants conflict
- Fidelity promotion is needed
- Irreversible structure is introduced

---

## 9. Change Control

This document is stable.
It evolves only in response to repeated friction or failure modes.
