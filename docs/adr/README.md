# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for the Yes It's Ananias web application.

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision made along with its context and consequences.

## ADR Format

Each ADR follows this structure:

```markdown
# N. Title

Date: YYYY-MM-DD

## Status

[proposed | accepted | rejected | deprecated | superseded by ADR-XXXX]

## Context

What is the issue that we're seeing that is motivating this decision or change?

## Decision

What is the change that we're proposing and/or doing?

## Consequences

What becomes easier or more difficult to do because of this change?
```

## Creating a New ADR

1. Copy the template below
2. Create a new file: `docs/adr/NNNN-descriptive-title.md`
   - Use the next sequential number (check existing ADRs)
   - Use lowercase with hyphens for the title
3. Fill in all sections
4. Commit the ADR with your code changes

## ADR Index

- [ADR-0000](0000-use-architecture-decision-records.md) - Use Architecture Decision Records
- [ADR-0001](0001-implement-route-based-code-splitting.md) - Implement Route-Based Code Splitting
- [ADR-0002](0002-replace-fontawesome-with-inline-svg-icons.md) - Replace FontAwesome with Inline SVG Icons
- [ADR-0003](0003-optimize-custom-font-loading.md) - Optimize Custom Font Loading Strategy
- [ADR-0004](0004-improve-build-configuration.md) - Improve Build Configuration and Remove Redundancies

## Template

```markdown
# N. Title Here

Date: YYYY-MM-DD

## Status

Proposed

## Context

Describe the context and problem statement. What forces are at play? What are the constraints?

## Decision

What is the change we're proposing or have agreed to implement?

## Consequences

### Positive
- What becomes easier?
- What benefits do we gain?

### Negative
- What becomes more difficult?
- What are the costs or drawbacks?

### Neutral
- What changes but is neither positive nor negative?
```

## Resources

- [Architecture Decision Records homepage](https://adr.github.io/)
- [Michael Nygard's article on ADRs](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
