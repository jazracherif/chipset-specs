---
name: chip-lookup
description: "Retrieve and query chip specifications from the repository's YAML spec files. Use when: looking up GPU or CPU specs, filtering chips by memory, performance, TDP, cost, generation, or architecture, finding which chips meet certain requirements, listing available chips."
argument-hint: "chip name, vendor, or filter criteria (e.g. 'GB200', 'AMD EPYC', 'HBM3e GPUs over 300 GB')"
---

# Chip Lookup

Retrieves and presents chip specifications from the repository's YAML databases.

## Spec Files

### Index (load first)

| File | Contents |
|------|----------|
| [`specs/_index.yaml`](../../specs/_index.yaml) | All chips — ~8 key metrics each + `spec_file` pointer. **Always load this first** for filter/list queries. |
| [`specs/_schema.json`](../../specs/_schema.json) | JSON Schema — consult for full field vocabulary and required fields per entry type. |

### Full Specs (load on demand)

| File | Chips |
|------|-------|
| [`specs/nvidia/gpus/blackwell.yaml`](../../specs/nvidia/gpus/blackwell.yaml) | GB10, GB200 NVL72, RTX 5070 |
| [`specs/nvidia/gpus/hopper.yaml`](../../specs/nvidia/gpus/hopper.yaml) | H100 (SXM5 & PCIe), GH200 |
| [`specs/nvidia/gpus/rubin.yaml`](../../specs/nvidia/gpus/rubin.yaml) | VR200 (Vera Rubin Superchip) |
| [`specs/nvidia/gpus/turing.yaml`](../../specs/nvidia/gpus/turing.yaml) | T4 |
| [`specs/amd/gpus/cdna4.yaml`](../../specs/amd/gpus/cdna4.yaml) | MI350X, MI355X 8-Node Rack |
| [`specs/amd/gpus/cdna3.yaml`](../../specs/amd/gpus/cdna3.yaml) | MI300X |
| [`specs/amd/cpus/epyc.yaml`](../../specs/amd/cpus/epyc.yaml) | EPYC 7763 (Milan), 9654 (Genoa), 9965 (Turin) |
| [`specs/intel/cpus/xeon.yaml`](../../specs/intel/cpus/xeon.yaml) | Xeon 8490H (Sapphire), 8592+ (Emerald), 6980P (Granite) |

### Terminology

| File | Contents |
|------|----------|
| [`terminology/amd-nvidia.md`](../../terminology/amd-nvidia.md) | AMD ↔ NVIDIA concept mapping (CU/SM, LDS/Shared Memory, XGMI/NVLink, etc.) |

## Procedure

1. **Load [`specs/_index.yaml`](../../specs/_index.yaml) first** for any filter or list query (e.g. "GPUs with over 200 GB memory", "all Blackwell chips").
   - Each entry has `memory_gb`, `memory_bw_tbs`, `fp16_tflops`, `fp32_tflops`, `tdp_w`/`tdp_kw`, and a `spec_file` pointer.

2. **For deep-dive queries** on a specific chip, follow the `spec_file` link from `_index.yaml` to load the full spec.

3. **Cross-vendor terminology**: If the user asks about an AMD concept using NVIDIA terminology (or vice versa), consult [`terminology/amd-nvidia.md`](../../terminology/amd-nvidia.md) to translate before answering.

## Key Fields in `_index.yaml`

- `memory_gb` — total memory capacity (HBM or GDDR)
- `memory_bw_tbs` — memory bandwidth in TB/s (use `memory_bw_gbs` for smaller GPUs)
- `fp16_tflops` / `fp32_tflops` — peak performance
- `tdp_w` / `tdp_kw` — power draw
- `cost_usd_range` — estimated cost range (where available)
- `spec_file` — path to the full spec YAML

## Key Fields in Full Spec Files (GPUs)

**NVIDIA** (`specs/nvidia/gpus/*.yaml`): `streaming_multiprocessors`, `cuda_cores_fp32_per_gpu`, `memory_specifications`, `compute_performance`, `advanced_features`

**AMD** (`specs/amd/gpus/*.yaml`): `compute_units`, `cu_execution_model`, `memory_specifications`, `compute_performance`, `advanced_features`

## Key Fields in Full Spec Files (CPUs)

**AMD & Intel** (`specs/amd/cpus/*.yaml`, `specs/intel/cpus/*.yaml`): `max_cores`, `memory_channels`, `memory_type`, `memory_bandwidth_gbs`, `best_simd`, `simd_width_bits`, `avx_fp_units`, `peak_fp32_tflops`, `peak_fp32_clock_ghz`

## Output Format

For multi-chip results, use a markdown table. For single-chip results, use a structured list grouped by category (core specs, memory, compute, power, cost).
Always cite the `source` URL when available.
