# Architecture Frozen

**Date**: 2026-06-14
**Status**: APPROVED & LOCKED

The architecture of the AI Agency Operating System is officially frozen. This document establishes the immutable laws for further development.

## 1. Priority Matrix

All future decisions must adhere to this hierarchy:
1. **Reliability** (Zero errors, state consistency, checkpoint recovery)
2. **Conversion** (CRO-focused layouts, psychological triggers, performance data)
3. **Cost** (Optimized AI tokens, fewer API calls, selective regeneration)
4. **Features** (New bells and whistles come last)

## 2. Core Constraints

### The Schema Constraint
The database schema (`schema.prisma`) is finalized. 
- No more core entities will be added.
- We have fully accommodated: `ComponentRegistry`, `BlueprintSnapshot`, `ThemeSnapshot`, `GenerationCost`, `MerchantFeedback`, and `PromptVersion`.

### The Component Constraint
- Components (`ComponentRegistry`) must not be directly fetched from the filesystem unless caching misses or local dev overrides.
- Tags are JSON arrays (`industryTags`, `styleTags`, `searchKeywords`). Single string categories are banned.

### The Cost Constraint
- `GenerationCost` must be recorded for every generation attempt.
- Over-uploading components is strictly prohibited. The system must verify if an asset exists before uploading to Shopify.

### The Learning Constraint
- `MerchantFeedback` and store analytics must feed back into the AI Prompt or Component selection mechanisms.
- All prompts are version-controlled via `PromptVersion`.

## 3. Freeze Exception Protocol

You may ONLY break this freeze if a proposed change mathematically proves:
1. It reduces generation cost by >15% without impacting quality.
2. It improves component conversion rates based on a 100-store sample size.
3. It fixes a critical Shopify API deprecation.

Any other reason is instantly rejected.

## 4. Engineering Rules

### Deterministic First
AI may recommend.
AI may rank.
AI may generate blueprints.

AI must NOT directly:
- Modify Shopify themes
- Write production templates
- Publish themes
- Skip validators

All production changes must pass through deterministic engines.

### Recovery First
Every checkpoint must be resumable.
No stage may require restarting the entire generation process.
All stages must be idempotent.
Running the same stage twice must produce the same result.

### Validation First
No theme may enter Preview state unless:
- JSON validation passes
- Asset validation passes
- Component validation passes
- Health scoring completes

Validation failures trigger Repair Engine before regeneration.

### Cost Visibility
Every AI call must have:
- Prompt version
- Model used
- Token usage
- Cost
stored in GenerationCost.

Untracked AI usage is prohibited.

## 5. Definition of Success

A generation is successful only if:

1. Catalog analysis completes.
2. Blueprints are generated.
3. Components are selected.
4. Theme composes successfully.
5. Validation passes.
6. Preview URL is generated.
7. Theme Health Score >= 85.

Anything below this threshold is considered a failed generation.

## 6. Prohibited Patterns

The following are permanently prohibited:

- Direct AI-generated Liquid themes
- Direct AI-generated Shopify JSON templates
- Auto-publishing without merchant approval
- Full-store regeneration for minor edits
- Filesystem-only component retrieval
- Non-versioned prompts
- Untracked AI costs
- Bypassing validators
