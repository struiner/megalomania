# agents.ledger

This directory is the append-only memory ledger for agents.

## Purpose

- It records **decisions, outcomes, and precedents**
- It does **not** define rules
- It does **not** grant authority

**AGENTS.md is the highest authority.**

## Structure

```
agents.ledger/
|- readme.md              # This file - usage guidelines
|- base.rules.json        # Extracted rules from AGENTS.md (derived, not authoritative)
|- index/                 # Binary indexes (derived, may be deleted)
|- decisions/             # Individual decision records
|- outcomes/              # Result records from implemented decisions
|- precedents/            # Historical decisions for reference
```


## Integration Guidelines

### Rule Management

1. **Rule Extraction Process**
   - Rules are automatically extracted from AGENTS.md sections
   - Each rule must reference its source section in AGENTS.md
   - Rule IDs must be unique and descriptive
   - Tags should follow consistent categorization

2. **Synchronization Protocol**
   - Weekly review by Project Manager
   - 48-hour update window after AGENTS.md changes
   - Validation check: all rule IDs must have AGENTS.md counterparts
   - Change log: each update must reference the triggering AGENTS.md section

3. **Authority Preservation**
   - Rules cannot grant authority not defined in AGENTS.md
   - Enforcement mechanisms must match AGENTS.md specifications
   - Veto authority remains with domain experts per AGENTS.md

### Decision Recording

When recording decisions in the ledger:

1. **Required Fields**
   - timestamp: ISO 8601 format
   - decision_id: unique identifier
   - domain: which agent/domain made the decision
   - rationale: written justification
   - precedents: references to similar past decisions
   - outcome_tracking: how success will be measured

2. **Decision Categories**
   - **Escalation decisions**: When agents escalate to Project Manager
   - **Domain boundary decisions**: Clarifications of ownership limits
   - **Architecture decisions**: Changes to system structure
   - **Fidelity stage decisions**: Promotions or demotions in scope

3. **Precedent Tracking**
   - Link similar decisions for pattern recognition
   - Track decision outcomes for future reference
   - Note any reversals or modifications

### Usage Workflow

1. **Before Making Decisions**
   - Check existing precedents in the ledger
   - Verify rule compliance using base.rules.json
   - Identify if decision requires escalation

2. **After Implementing Decisions**
   - Record decision with full rationale
   - Link to relevant rules and precedents
   - Set outcome tracking metrics

3. **For Future Reference**
   - Use search to find relevant precedents
   - Review rule enforcement patterns
   - Identify areas needing clarification

### Query Examples

Find all escalation decisions by Project Manager:
```
domain: "Project Manager" AND type: "escalation"
```

Find precedents for UI-related domain conflicts:
```
tags: ["ui", "domain"] AND type: "precedent"
```

Find decisions that violated determinism rules:
```
rule_violations: "DETERMINISTIC_RECONSTRUCTION"
```

## Binary Indexes

Binary indexes in `/index` are derived and may be deleted at any time. They exist for performance optimization only and do not affect the integrity of the ledger data.

## Validation Rules

The ledger system validates:

1. **Format Compliance**: All entries must follow the required schema
2. **Rule Reference Integrity**: Decisions must reference valid rules
3. **Domain Consistency**: Decisions must align with domain ownership
4. **Temporal Ordering**: Entries must maintain chronological order
5. **Authority Validation**: Decision-makers must have appropriate authority

## Error Handling

When inconsistencies are detected:

1. **Log the anomaly** in the ledger with detailed context
2. **Escalate immediately** to Project Manager for resolution
3. **Do not proceed** with implementation until resolved
4. **Document resolution** once found for future reference

## Performance Considerations

- Index queries for frequent access patterns
- Batch processing for large decision volumes
- Compression for long-term storage
- Backup verification for data integrity

## Integration with Development Workflow

1. **Pre-implementation**: Check precedents and rules
2. **During implementation**: Record significant decisions
3. **Post-implementation**: Document outcomes and learnings
4. **Review cycles**: Analyze patterns and update processes

When in doubt:
- Record the uncertainty
- Escalate to Project Manager
- Do not invent doctrine
- Always reference AGENTS.md as the ultimate authority
