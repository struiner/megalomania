# Tech Tree Culture Tag Combobox – Design Meeting Outcomes

**Meeting Type:** UX / Systems design alignment  
**Phase:** Phase 2 close-out → Phase 3 preparation  
**Scope:** Culture tag selection, discovery, and assignment UX

---

## Decisions

### 1. Ease of Use Is a Primary Constraint
- Culture tag assignment must be:
  - Intuitive for first-time users
  - Fast for experienced designers
  - Safe to explore without unintended consequences
- Tag selection is treated as a **classification task**, not free-form data entry

---

### 2. Multi-Select Combobox Is Retained
- The multi-select combobox remains the primary interface
- ❌ No downgrade to flat checkbox-only UI
- ❌ No modal-only selection workflow
- Combobox must scale to large tag vocabularies

---

### 3. Tags Are Grouped by Namespace (Derived)
- Tags are grouped by existing namespaces:
  - `biome_*`
  - `settlement_*`
  - `guild_*`
- Grouping is **derived from identifiers**, not configured manually
- No new taxonomy or hierarchy introduced

---

### 4. Selected Tags Are First-Class Facts
- Selected tags are always visible as tokens/pills
- Tokens:
  - Grouped visually by namespace
  - Keyboard-focusable and removable
- Available tags are visually secondary and revealed on interaction

---

### 5. Context-Sensitive Ordering (Not Automation)
- Tags may be **re-ordered or surfaced** based on node context:
  - Matching biome
  - Settlement unlocks
  - Guild-related effects
- ❌ No automatic tag assignment
- ❌ No AI-driven recommendations
- Final selection always belongs to the designer

---

### 6. Usage & Conflict Feedback Is Inline
- Tag usage and conflicts are communicated inline:
  - Usage count or rarity indicator
  - Conflict warnings shown non-modally
- Blocking errors are reserved for true validation failures only

---

### 7. Tag Management Is a Separate Workflow
- Tag creation, editing, and deletion:
  - Lives in **Govern Culture Tags**
  - Is intentionally separate from assignment
- Combobox is strictly for *selection*, not management

---

### 8. Accessibility Is Non-Negotiable
- Full keyboard navigation required
- Screen reader support via correct ARIA roles
- Clear distinction between selected and available tags
- Checkbox-grid fallback remains available for:
  - Audits
  - Accessibility edge cases

---

### 9. Performance & Scalability Are Required
- Combobox must handle growing tag sets without degradation
- Virtualization and debounced search are expected patterns
- Namespace-first filtering preferred

---

## Tasks

### Combobox UX & Behavior
- [ ] Refine multi-select combobox interaction model
- [ ] Implement namespace-based grouping headers
- [ ] Ensure selected tags are always visible as tokens
- [ ] Support keyboard-based add/remove flows

---

### Contextual Ordering
- [ ] Define context signals (biome, effects, settlements)
- [ ] Implement context-sensitive sorting (non-automatic)
- [ ] Preserve deterministic tag identifiers and ordering

---

### Usage & Validation Feedback
- [ ] Add usage indicators (count / rarity)
- [ ] Surface conflicts inline during selection
- [ ] Integrate with existing validation pipeline

---

### Accessibility
- [ ] Validate ARIA roles (`combobox`, `listbox`, `option`)
- [ ] Ensure screen reader announcements on selection change
- [ ] Maintain checkbox-grid fallback and toggle

---

### Performance
- [ ] Add list virtualization if tag count exceeds threshold
- [ ] Debounce search/filter input
- [ ] Avoid full recomputation on each keystroke

---

## Considerations & Constraints

### Usability
- Selected tags must read as *facts*, not suggestions
- Visual noise must be tightly controlled
- Inline feedback preferred over modal dialogs

---

### Safety & Trust
- No implicit or automatic tag application
- Designer intent must always be explicit
- Conflicts should educate before blocking

---

### Determinism
- Tag identifiers remain canonical and enum-aligned
- UI ordering must not affect serialized output
- Validation behavior remains unchanged

---

### Extensibility
- Design must accommodate:
  - Additional tag namespaces in the future
  - Bulk assignment (Phase 3)
  - Canvas-driven tag assignment
- No schema changes required for future enhancements

---

## Summary

- Multi-select combobox remains the primary interface
- Ease of use, clarity, and accessibility are foundational
- Tag grouping and behavior are derived from the existing model
- Assignment and management are intentionally separated
- The system scales without introducing new abstractions

**Guiding Principle:**
> Make culture tags feel like meaningful constraints,  
> not checkboxes to get through.
