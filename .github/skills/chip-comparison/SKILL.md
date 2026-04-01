---
name: chip-comparison
description: "Compare two or more chips side-by-side using repository spec files and existing comparison documents. Use when: comparing chips, asking which chip is better for a workload, analyzing tradeoffs between GPUs or CPUs, generating or referencing comparison tables."
argument-hint: "chips to compare, e.g. 'GB10 vs GB200' or 'AMD MI355X vs NVIDIA H100'"
---

# Chip Comparison

Generates or retrieves side-by-side comparisons of chips using existing comparison docs and spec files.

## Resources

| Resource | Purpose |
|----------|---------|
| [`comparisons/`](../../comparisons/) | Pre-written detailed comparisons (check here first) |
| [`specs/_index.yaml`](../../specs/_index.yaml) | All chips — key metrics + `spec_file` pointers (load for quick side-by-side) |
| [`specs/nvidia/gpus/blackwell.yaml`](../../specs/nvidia/gpus/blackwell.yaml) | GB10, GB200 NVL72, RTX 5070 — full NVIDIA Blackwell specs |
| [`specs/nvidia/gpus/hopper.yaml`](../../specs/nvidia/gpus/hopper.yaml) | H100, GH200 — full NVIDIA Hopper specs |
| [`specs/nvidia/gpus/rubin.yaml`](../../specs/nvidia/gpus/rubin.yaml) | VR200 — NVIDIA Rubin superchip specs |
| [`specs/nvidia/gpus/turing.yaml`](../../specs/nvidia/gpus/turing.yaml) | T4 — full NVIDIA Turing specs |
| [`specs/amd/gpus/cdna4.yaml`](../../specs/amd/gpus/cdna4.yaml) | MI350X, MI355X — full AMD CDNA 4 specs |
| [`specs/amd/gpus/cdna3.yaml`](../../specs/amd/gpus/cdna3.yaml) | MI300X — full AMD CDNA 3 specs |
| [`terminology/amd-nvidia.md`](../../terminology/amd-nvidia.md) | AMD ↔ NVIDIA concept mapping |

## Procedure

1. **Check `comparisons/`** for an existing document matching the requested chips. If found, summarize or quote it directly.

2. **If no pre-written comparison exists**, load the relevant entries from the spec files for each chip.

3. **Normalize terminology**: When comparing AMD vs NVIDIA chips, use [`terminology/amd-nvidia.md`](../../terminology/amd-nvidia.md) to map equivalent concepts (e.g. CU ↔ SM, LDS ↔ Shared Memory, XGMI ↔ NVLink).

4. **Build a comparison table** covering the dimensions most relevant to the query:

   | Dimension | Fields to Use |
   |-----------|--------------|
   | Memory capacity | `gpu_memory_hbm_gb`, `total_unified_memory_gb` |
   | Memory bandwidth | `gpu_memory_bandwidth_tbs` |
   | Compute | `fp32_tflops`, `cuda_cores_fp32_per_gpu` (or AMD CU count) |
   | Power | `tdp_kw` |
   | Cost | `cost_per_chip_usd_range`, `platform_cost_usd_range` |
   | Interconnect | `cpu_gpu_interconnect`, `cpu_gpu_interconnect_bw_gbs` |
   | Generation / Year | `generation`, `year` |

5. **Provide a qualitative summary** of tradeoffs after the table: workload fit, scale (single chip vs rack), power budget, cost efficiency.

## Output Format

- Comparison table first, followed by a "Tradeoffs & Recommendations" section.
- For cross-vendor comparisons, note any terminology differences inline.
- Cite `source` URLs for each chip.
