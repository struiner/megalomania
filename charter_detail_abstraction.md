# Level of Detail & Abstraction Charter

## Megalomania (Codename: Anna)

This charter defines **how complete, how detailed, and how abstract** work products should be at any given moment in the Megalomania project.

It exists to prevent:

* Overbuilt systems that calcify too early
* Underbuilt sketches that mislead contributors
* Exhausting, monolithic Codex outputs
* Premature certainty about evolving mechanics

This charter is **binding** for all agents and task specifications.

---

## 1. Core Principle

> **Correct shape beats complete implementation.**

A system that has the right *form* can be filled in later.
A system that is fully implemented with the wrong form is technical debt.

---

## 2. Stages of Fidelity

All work MUST implicitly or explicitly target one of the following stages.

### 2.1 Conceptual (Shape-Finding)

**Purpose:** Explore structure and boundaries.

Characteristics:

* Interfaces over implementations
* Pseudocode and stubs allowed
* Heavy use of comments and TODO markers
* No optimization

Acceptable outputs:

* Type definitions
* Interface contracts
* Sequence diagrams (textual)

Unacceptable outputs:

* Full algorithmic implementations
* Performance tuning

---

### 2.2 Structural (Skeleton)

**Purpose:** Establish correct relationships and data flow.

Characteristics:

* Minimal working implementations
* Deterministic but not optimized
* Explicit extension points

Acceptable outputs:

* Basic class/function implementations
* Hardcoded or mocked data where appropriate

Unacceptable outputs:

* Feature-complete logic
* Extensive edge-case handling

---

### 2.3 Functional (Playable / Usable)

**Purpose:** Enable real use and feedback.

Characteristics:

* Correct behavior for primary paths
* Incomplete secondary features allowed
* Instrumentation preferred over polish

Acceptable outputs:

* End-to-end flows
* Partial UIs

Unacceptable outputs:

* Premature abstraction layers
* Cosmetic polish without feedback

---

### 2.4 Refinement (Hardening)

**Purpose:** Improve robustness and clarity.

Characteristics:

* Error handling
* Edge cases addressed
* Performance considerations

Acceptable outputs:

* Validation
* Refactoring

Unacceptable outputs:

* Structural changes without justification

---

## 3. Abstraction Biases

### 3.1 Bias Toward Deletable Code

Prefer code that can be:

* Removed
* Replaced
* Rewritten

A good abstraction makes deletion easy.

---

### 3.2 Interfaces Before Factories

* Start with plain interfaces and functions
* Introduce factories only when lifecycle or configuration demands it

---

### 3.3 Explicit Over Clever

* Prefer boring, readable code
* Avoid metaprogramming unless unavoidable

If it cannot be explained in one paragraph, it is too clever.

---

## 4. Codex Output Constraints

When generating output, Codex MUST:

* Default to the **lowest viable fidelity stage**
* Stop early and explain what is intentionally omitted
* Ask for confirmation before moving to a higher stage

Large outputs must be chunked or summarized.

---

## 5. Human Review Heuristics

Before accepting work, reviewers should ask:

* Is this the right *stage* of completeness?
* Could this have been simpler?
* Would deleting half of this break the project?

If unsure, revert to a lower fidelity stage.

---

## 6. Anti-Patterns (Explicitly Forbidden)

* "Just in case" implementations
* Over-generalized frameworks
* Abstract base classes with one implementation
* Early optimization
* Copying patterns from unrelated domains

---

## 7. Governance

**Primary owner:** Project Manager

**Enforcement:** Architecture Steward

All task specifications MUST:

* Implicitly or explicitly state the target fidelity stage
* Reject work that exceeds the intended level of detail

---

## 8. Status of This Document

This charter is **authoritative and stable**.

It should evolve slowly and only in response to repeated friction or failure modes.
