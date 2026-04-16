# chipset-specs

A structured repository of GPU and CPU specifications, optimized for querying by AI agents. Specs are organized into per-generation YAML files with a fast-lookup index, a JSON Schema for validation, and a set of Copilot agent skills for common workflows.

## Repository Structure

```
specs/
  _index.yaml              # Fast-lookup index — all chips, ~8 key metrics + spec_file pointer
  _schema.json             # JSON Schema for all spec file formats
  nvidia/gpus/
    ampere.yaml            # A100, DGX A100
    blackwell.yaml         # GB10, GB200_NVL72, DGX B200, RTX 5070
    hopper.yaml            # H100, GH200
    rubin.yaml             # VR200 (Vera Rubin Superchip)
    turing.yaml            # T4
  amd/gpus/
    cdna4.yaml             # MI350X, MI355X
    cdna3.yaml             # MI300X
  amd/cpus/
    epyc.yaml              # EPYC 7763 (Milan), 9654 (Genoa), 9965 (Turin)
  intel/cpus/
    xeon.yaml              # Xeon 8380 (Ice Lake), 8490H (Sapphire Rapids), 8570/8592+ (Emerald Rapids), 6980P (Granite Rapids)
  arm/cpus/
    agi.yaml               # AGI SP113012, SP113012S, SP113012A (Phoenix / Neoverse V3)
terminology/
  amd-nvidia.md            # AMD ↔ NVIDIA concept mapping table
comparisons/               # Pre-written side-by-side chip comparisons
scripts/
  validate-data.mjs        # Node.js validation script — runs AJV against all spec files
package.json               # Node dependencies (ajv, ajv-formats, js-yaml)
.github/skills/            # Copilot agent skills (see below)
```

## Available Chips

### NVIDIA GPUs

| Name | Generation | Type | Memory | TDP |
|------|-----------|------|--------|-----|
| GB10 | Blackwell | Desktop superchip | 128 GB LPDDR5x | 140 W |
| GB200_NVL72 | Blackwell | Datacenter rack (72 GPUs) | 13.8 TB HBM3e | 132 kW |
| DGX B200 | Blackwell | Datacenter server (8 GPUs) | 1,536 GB HBM3e | ~14.3 kW |
| RTX 5070 | Blackwell | Consumer GPU | 12 GB GDDR7 | 220 W |
| A100 | Ampere | Datacenter GPU | 80 GB HBM2e | 400 W |
| DGXA100 | Ampere | Datacenter server (8 GPUs) | 640 GB HBM2e | 6.5 kW |
| H100 SXM5 | Hopper | Datacenter GPU | 80 GB HBM3 | 700 W |
| GH200 | Hopper | Superchip | 624 GB unified (HBM3e + LPDDR5X) | 1.0 kW |
| VR200 | Rubin | Superchip | 2,150 GB unified (HBM4 + LPDDR5X) | 5.0 kW |
| T4 | Turing | Inference GPU | 16 GB GDDR6 | 70 W |

### AMD GPUs

| Name | Generation | Type | Memory | TDP |
|------|-----------|------|--------|-----|
| MI350X | CDNA 4 | Datacenter GPU (OAM) | 288 GB HBM3E | ~1,000 W |
| MI355X (8-Node Rack) | CDNA 4 | Datacenter rack (64 GPUs) | 18.4 TB HBM3E | ~100 kW |
| MI300X | CDNA 3 | Datacenter GPU (OAM) | 192 GB HBM3 | 750 W |

### AMD CPUs

| Name | Generation | Cores | Memory BW |
|------|-----------|-------|----------|
| EPYC 7763 | Milan (Zen 3) | 64 | 205 GB/s |
| EPYC 9654 | Genoa (Zen 4) | 96 | 461 GB/s |
| EPYC 9965 | Turin (Zen 5) | 192 | 576 GB/s |

### Intel CPUs

| Name | Generation | Cores | Memory BW | Notes |
|------|-----------|-------|----------|-------|
| Xeon 8380 | Ice Lake | 40 | 205 GB/s | |
| Xeon 8490H | Sapphire Rapids | 60 | 307 GB/s | |
| Xeon 8570 | Emerald Rapids | 56 | 358 GB/s | Used in NVIDIA DGX B200 (2× per system) |
| Xeon 8592+ | Emerald Rapids | 64 | 358 GB/s | |
| Xeon 6980P | Granite Rapids | 128 | 409 GB/s | |

### ARM CPUs

| Name | SKU | Generation | Cores | Memory BW | TDP |
|------|-----|-----------|-------|----------|-----|
| AGI SP113012 | SP113012 | Phoenix (Neoverse V3) | 136 | 845 GB/s | 300 W |
| AGI SP113012S | SP113012S | Phoenix (Neoverse V3) | 128 | 845 GB/s | 300 W |
| AGI SP113012A | SP113012A | Phoenix (Neoverse V3) | 64 | 845 GB/s | 300 W |

## Agent Skills

Five Copilot agent skills are available under `.github/skills/`:

| Skill | Description |
|-------|-------------|
| `chip-lookup` | Retrieve and query chip specs — filter by memory, performance, TDP, cost, generation, or architecture. |
| `chip-comparison` | Compare two or more chips side-by-side using spec files and pre-written comparison documents. |
| `chip-spec-update` | Add a new chip or update an existing chip's specifications. |
| `chip-terminology-translation` | Translate GPU concepts between AMD and NVIDIA terminology (CU↔SM, LDS↔Shared Memory, XGMI↔NVLink, etc.). |
| `validate-specs` | Validate all spec YAML files against the JSON Schema; interpret and fix AJV errors. |

## Validation

Run the validator to check all spec files against the JSON Schema:

```bash
npm run validate
# or
node scripts/validate-data.mjs
```

Exit code `0` = all valid. Exit code `1` = one or more errors, printed with file, chip name, and field path.

Dependencies: `ajv` (JSON Schema 2020-12), `ajv-formats`, `js-yaml`. Install with `npm install`.

## Design Notes

- **`specs/_index.yaml` first**: Always load the index for filter or list queries; it has ~8 key metrics per chip and a `spec_file` pointer. Load the full spec file only for deep-dive queries. The index carries a `schema_version` and `last_updated` date.
- **`specs/_schema.json`**: JSON Schema 2020-12 covering all entry types (`nvidia_gpu_entry`, `amd_gpu_entry`, `cpu_entry`). Use for validation and field discovery.
- **NVIDIA schema**: SM-based (`streaming_multiprocessors`, `cuda_cores_fp32_per_gpu`).
- **AMD schema**: CU-based (`compute_units`, `cu_execution_model`, `lds_per_cu`).
