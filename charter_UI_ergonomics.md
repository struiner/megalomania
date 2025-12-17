# UI & Ergonomics Charter

## Megalomania (Codename: Anna)

This document defines the **ergonomic, aesthetic, and interaction principles** governing all user interface and HUD work in Megalomania.

It is a **binding charter**, not a suggestion list.
All UI-related task specifications and implementations MUST defer to this document.

The charter exists to:

* Give Codex and human contributors a shared definition of *“good UI”*
* Prevent UI drift, clutter, and overengineering
* Ensure long-term visual and ergonomic coherence as systems scale

---

## 1. Interface Philosophy

### 1.1 The HUD Is an Instrument

The HUD is an **operational instrument**, not a dashboard of curiosities.

It exists to:

* Orient the player in space and situation
* Provide deliberate access to management and information
* Stay out of the way of the world simulation

The HUD must **never compete** with the game world for attention.

---

### 1.2 World First, Interface Second

* The game world is the primary visual subject
* The interface frames the world; it does not decorate it
* If the player is unsure where to look, the UI has failed

The center of the screen is **sacred** and must remain as uncluttered as possible.

---

## 2. Attention Hierarchy (Non-Negotiable)

All UI elements must respect a clear attention hierarchy:

### 2.1 Primary Attention

* Spatial orientation
* Movement and positioning
* Immediate situational awareness

**Rule:** Primary attention is never obstructed by UI chrome.

---

### 2.2 Secondary Attention

* Player actions
* Management entry points
* High-level state indicators

These elements must be:

* Visually grouped
* Stable in position
* Learnable through repetition

---

### 2.3 Peripheral Attention

* Statistics
* Counts
* Historical summaries

Peripheral elements must:

* Be readable at a glance
* Never demand focus
* Never animate aggressively

---

## 3. Spatial Biases & Layout Laws

These biases apply to *all* layouts unless explicitly overridden.

### 3.1 Bottom HUD Is Heavy and Stable

* The bottom HUD is visually grounded
* It anchors the player’s sense of control
* Its layout must not shift dynamically

Stability beats cleverness.

---

### 3.2 Horizontal Over Vertical

* Prefer horizontal grouping over vertical stacks
* Vertical motion is visually disruptive in a simulation context

---

### 3.3 Symmetry by Default

* Symmetry is the default state
* Asymmetry must have a **semantic reason**

If asymmetry cannot be explained in words, it is not allowed.

---

## 4. Density & Restraint

### 4.1 Less Is Correct

* Empty space is a feature
* The absence of UI is preferable to marginal UI

A UI element must justify its existence.

---

### 4.2 Visibility Limits

* No more than **8 primary interactive elements** visible at once in the HUD
* Additional actions must live behind dialogs or secondary views

---

### 4.3 Icons Before Text, Text Before Numbers

* Icons provide recognition
* Text provides clarity
* Numbers provide precision

Never lead with raw numbers.

---

## 5. Interaction Rules

### 5.1 One Action, One Result

* Every button does exactly one thing
* Buttons open dialogs or navigate routes — never both

---

### 5.2 No Hidden Gestures

* No swipe-only, hover-only, or timing-based interactions
* All actions must be discoverable through explicit affordances

---

### 5.3 Shallow Modal Depth

* Maximum modal stack depth: **2**
* If deeper navigation is needed, switch to full views

---

### 5.4 Time Respect

* The HUD never pauses the simulation implicitly
* Time control is explicit and centralized

---

## 6. Visual Tone & Aesthetic Direction

### 6.1 Retro Pixel Heritage (Foundational)

The visual language of Megalomania is rooted in **16-bit–era pixel art traditions**.

Inspirations include (non-exhaustive):

* *Patrician* (economic clarity, map readability)
* *Masters of Magic* (fantastical scope, strategic framing)
* *Secret of Mana* (warm pixel art, lively yet restrained animation)
* *New World Computing titles* (clear iconography, dense information without clutter)
* *Colonization* (map-centric play, strong economic feedback)

The UI must feel **crafted, deliberate, and slightly timeless**, not modern-flat or hyper-polished.

---

### 6.2 Pixel Integrity Rules

* UI elements must align to the pixel grid
* Avoid sub-pixel positioning and smooth fractional scaling
* Prefer integer scaling factors (2×, 3×, 4×)

Blurry scaling or vector-perfect sharpness are both considered failures.

---

### 6.3 Functional, Not Ornamental

* Visual elements must serve function first
* Ornamentation is allowed only when it reinforces hierarchy or meaning
* Decorative elements should resemble **tools, ledgers, maps, and instruments**, not abstract shapes

---

### 6.4 Hanseatic Fantasy, Not High Fantasy

* Earthy, mercantile sensibility
* Fantastical elements feel *discovered*, not flamboyant
* Magic exists, but is treated as another system to be understood and exploited

This is a world of merchants, explorers, guilds, and chroniclers.

---

### 6.5 Motion Is Informational

* Animations indicate state change or causality
* Prefer stepped, frame-based motion over smooth interpolation
* Decorative motion is discouraged

If it moves, it must explain *why*.

---

### 6.2 Hanseatic, Not High-Fantasy

* Earthy, mercantile sensibility
* Solid forms over filigree
* Instruments over decorations

---

### 6.3 Motion Is Informational

* Animations indicate state change or causality
* Decorative motion is discouraged

If it moves, it must explain *why*.

---

## 7. Anti-Goals (Hard Constraints)

The following are explicitly forbidden:

* MMO-style hotbars
* Rapidly updating graphs in the HUD
* Floating tooltips that chase the cursor
* Micro-optimizing layouts for novelty
* UI elements that invent or mutate game state

---

## 8. Truth Ownership Enforcement

### 8.1 UI Does Not Own Truth

* UI displays **derived views only**
* UI never performs authoritative calculations
* UI never caches historical truth

---

### 8.2 Design Does Not Own Truth

* Design documents describe *intent*, not state
* No design artifact is authoritative over the ledger

---

## 9. Governance

**Primary owner:** Game Designer

**Enforcement:** Architecture Steward / Project Manager

Any UI task specification MUST:

* Reference this charter
* State explicitly if it deviates (and why)

Deviations require conscious approval.

---

## 10. Status of This Document

This charter is **authoritative and living**.

It should evolve slowly and deliberately.
Frequent changes indicate unclear vision and must be treated as a warning sign.
