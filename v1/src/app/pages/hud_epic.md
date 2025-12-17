# Epic Task Specification

## Gameplay HUD & Interface Foundations (Semi‑Recursive)

This document defines an **Epic Task** for Megalomania. An epic task is a *bounded initiative* whose primary outcome is:

* A coherent architectural and UX foundation
* A **set of well-scoped child tasks** (task specs)
* Initial implementation where appropriate

An epic task may **generate further tasks recursively**, but it must do so deliberately and visibly.

This epic is designed to be **executable by Codex under Project Manager coordination**.

---

## 1. Epic Summary

**Epic name:** Gameplay HUD & Interface Foundations

**Purpose:**
Establish a coherent, ergonomic, retro‑pixel‑aligned foundation for the in‑game HUD and core interface surfaces, such that future UI work can proceed safely, consistently, and incrementally.

This epic addresses *structure and direction*, not full feature completeness.

---

## 2. Authority & Governing Documents

This epic is governed by:

* Global Agents Framework (`agents.md`)
* UI & HUD Ergonomics Charter
* Level of Detail & Abstraction Charter

All child tasks MUST explicitly reference these documents.

---

## 3. Epic Scope

### 3.1 In Scope

* Bottom HUD layout and composition
* HUD interaction affordances (buttons, minimap, panes)
* UI routing and dialog entry points
* Visual hierarchy and pixel‑integrity enforcement
* Creation of reusable HUD subcomponents

---

### 3.2 Explicitly Out of Scope

* New gameplay mechanics
* Ledger or economy schema changes
* Backend API expansion
* Visual polish beyond structural fidelity

---

## 4. Agents & Responsibilities

### Project Manager (Epic Owner)

* Decompose the epic into child task specifications
* Ensure tasks are sequenced correctly
* Enforce scope and fidelity level

---

### Game Designer

* Define player‑facing intent of HUD elements
* Validate tone, nostalgia, and ergonomics

---

### Frontend Developer

* Implement UI components at **Structural or early Functional fidelity**
* Avoid premature polish or abstraction

---

### Architecture Steward (Enforcement)

* Enforce charter compliance
* Prevent truth leakage or overengineering

---

### QA & Test Engineer

* Validate determinism, stability, and layout integrity

---

## 5. Epic Decomposition Strategy (Recursive)

The epic MUST be decomposed into **child task specifications** using the Reusable Task Spec Template.

Decomposition rules:

1. Each child task must:

   * Be executable independently
   * Target a single UI surface or concern

2. Child tasks may themselves:

   * Produce further sub‑tasks (with justification)
   * But may NOT exceed one additional recursion layer without human approval

3. Tasks must prefer **Structural fidelity** unless explicitly promoted

---

## 6. Initial Child Task Candidates (Seed Set)

These tasks are *expected*, but must still be formalized as individual task specs:

1. **Bottom HUD Layout Skeleton**

   * Grid structure, anchoring, sizing

2. **HUD Minimap Integration**

   * Pixel‑aligned map surface

3. **HUD Button Grid Component**

   * 2×4 action launcher

4. **HUD Info Pane Framework**

   * Left/right secondary panels

5. **HUD Routing & Dialog Wiring**

   * Navigation without logic

Each of these MUST become its own `task.md`.

---

## 7. Execution Phases

### Phase 1 — Planning (No Code)

* Project Manager generates child task specs
* Game Designer provides intent blurbs
* Architecture Steward reviews for violations

---

### Phase 2 — Skeleton Implementation

* Frontend Developer implements agreed tasks
* QA validates layout and routing stability

---

### Phase 3 — Review & Promotion

* Decide which components (if any) graduate to Functional fidelity
* Archive completed task specs

---

## 8. Recursion & Task Generation Rules

This epic MAY generate:

* Clarification tasks (design intent unclear)
* Cleanup tasks (placeholder removal)
* Integration tasks (wiring without logic)

It MUST NOT generate:

* Feature creep tasks
* Cross‑domain logic tasks
* Unbounded refactors

---

## 9. Review Gates

Before the epic is considered successful:

* [ ] All child tasks exist as specs
* [ ] HUD is structurally present and navigable
* [ ] UI & HUD Ergonomics Charter violations are resolved
* [ ] No gameplay truth exists in UI code

---

## 10. Exit Condition

This epic is complete when:

* The gameplay HUD exists as a stable foundation
* Future UI work can be expressed as small, independent tasks
* This epic document can be archived

---

## 11. Notes on Reuse

This epic specification is a **template** for future large initiatives.

Other suitable epics that may be requested and specified as a result of phase 1, 2 or 3 are:

* Ledger Foundations
* World Generation Pipeline
* Trade & Market Systems
* Modding & SDK Infrastructure
