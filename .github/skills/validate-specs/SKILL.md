---
name: validate-specs
description: "Validate all chip spec YAML files against the JSON Schema. Use when: adding a new chip, updating spec fields, fixing validation errors, checking specs before committing, running schema validation, verifying the index file."
argument-hint: "Optional: name of a specific file to investigate after running"
---

# Validate Chip Specs

## When to Use
- After adding or updating any YAML spec file
- After modifying `specs/_schema.json`
- When the user reports schema or validation errors
- Before committing or pushing changes

## Procedure

### 1. Run the validator
```bash
node scripts/validate-data.mjs
```
Exit code `0` = all valid. Exit code `1` = one or more errors.

### 2. Interpret errors

Each error line has the form:
```
✗ <file> [<chip-name>]
    <json-path> — <message>
    params: <details>
```

| Error message | Likely cause | Fix |
|---|---|---|
| `must be equal to one of the allowed values` | Enum mismatch (e.g. `HBM3e` vs `HBM3E`, wrong `programming_model`) | Match the exact value in `_schema.json` |
| `must have required property '...'` | Missing required field | Add the field to the YAML entry |
| `must be equal to constant` | Field has a fixed allowed value in the schema | Use the exact constant value |
| `additionalProperties` | Unknown field present | Remove or rename the field |

### 3. Fix and re-run
After editing the affected YAML file(s), re-run the validator to confirm all entries pass.

### 4. Keep the schema in sync
If a new field or enum value is legitimately needed (e.g. a new memory type), update `specs/_schema.json` first, then re-validate.

## Key files
- Validator script: [`scripts/validate-data.mjs`](../../../scripts/validate-data.mjs)
- Schema: [`specs/_schema.json`](../../../specs/_schema.json)
- Index: [`specs/_index.yaml`](../../../specs/_index.yaml)
