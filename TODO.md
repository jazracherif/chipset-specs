# TODO — Proposed Data Layout Improvements

This file captures proposed improvements to the repository's data structure, schema, and tooling.
Priority is noted on each item. **High-priority** items are at the top; low-priority at the bottom.

---

## ✅ Done (in this PR)

- **Predecessor / successor navigation** — added `predecessor` and `successor` to all GPU index entries
- **`is_discontinued` flag** — added to A100, DGXA100, T4
- **`deployed_in` field** — added to all GPU index entries
- **Cross-field derived-metric validation** — implemented in `validate-data.mjs` (CPU memory BW + PCIe BW)
- **`CHANGELOG.md`** — created; tracks all spec corrections with source citations

---

## High Priority

### H1. GPU cost data — automated daily pricing workflow
Current cost data (`cost_usd_range`) is sparse and manually maintained. A better source is needed.

**Design (separate work item):**
- Primary source: [SemiAnalysis GPU Pricing Index](https://semianalysis.com/gpu-pricing-index/) (monthly updated, institutional)
- Secondary sources: Vast.ai spot pricing, AWS/GCP on-demand per-GPU hour → annualized cost
- Implement a GitHub Actions workflow that runs daily to pull latest prices and update `cost_usd_range` (or a new `cost_usd_spot` field) in `_index.yaml`
- Store historical price snapshots in `pricing/history/YYYY-MM-DD.yaml` for trend analysis
- Separate `cost_per_tflops_fp16` (derived) can be computed automatically when both cost and fp16_tflops are present

### H2. Add `fp8_tflops` and `int8_tops` to the index
FP8 is now the dominant training precision for LLMs; INT8 is critical for inference.
Adding both to the index enables fair AI-throughput comparisons without loading full spec files.

### H3. Split `_index.yaml` by vendor as the collection grows
As new chips are added (Blackwell Ultra, CDNA5, Rubin, next-gen Intel GPUs), `_index.yaml` will
become unwieldy. Plan: split into `_index_nvidia.yaml`, `_index_amd.yaml`, `_index_intel.yaml`,
`_index_arm.yaml`; root `_index.yaml` acts as a manifest listing the per-vendor files.
Keep the validation script updated to aggregate all vendor indexes.

### H4. Extend cross-field validation to GPU compute performance
Current cross-field checks cover CPU memory BW and PCIe BW.
Extend to GPUs:
- `fp32_tflops` ≈ `streaming_multiprocessors × cuda_cores_fp32_per_sm × 2 × max_clock_speed / 1e12` for NVIDIA
- `fp16_tflops` ≈ `fp32_tflops × 2` (standard Tensor Core ratio without sparsity)
- `memory_bw_tbs` ≈ `bus_width × clock_speed × 2 (DDR) / 8 / 1e12` for HBM/GDDR chips
This catches errors in announced-not-yet-released chips where specs drift between announcement and launch.

### H5. Add `is_announced_not_released` flag
Chips like VR200 (Rubin) and MI355X have announced/estimated specs only.
A machine-readable flag prevents agents from presenting paper specs as shipping hardware.
```yaml
is_announced_not_released: true   # flip to false on GA
```

### H6. Expand comparison documents for key chip pairs
Currently only GB10-centric comparisons exist. Highest-value additions:
- `h100-mi300x.md` — head-to-head training comparison (most-requested by LLM practitioners)
- `a100-h100.md` — generational leap: Ampere → Hopper
- `mi300x-mi350x.md` — CDNA 3 vs CDNA 4 upgrade analysis

---

## Medium Priority

### M1. Per-field confidence tagging — lightweight inline approach
Instead of a verbose `data_quality` block (which would double file size), use a standardized
inline comment convention that is both human-readable and parseable:

```yaml
fp16_tflops: 2600   # conf:estimated  src:amd-cdna4-whitepaper  date:2026-04-20
memory_bw_tbs: 8.0  # conf:official   src:[1]                   date:2026-04-20
```

A lightweight parser in `validate-data.mjs` can extract these annotations and report
a summary of fields with low confidence or stale dates.

### M2. Add `memory_bw_per_watt` to the index
Memory bandwidth per watt is a key efficiency metric for memory-bound inference workloads
(LLM decode, embedding lookup). Derivable: `memory_bw_tbs / tdp_kw` or `memory_bw_gbs / tdp_w`.
Can be computed on-the-fly but pre-populating it in the index speeds up agent filtering.

### M3. Add `die_size_mm2` and `transistor_count_billions` to the GPU schema
Key microarchitecture comparison points; widely published in press releases.

### M4. Add `interconnect_bw_gbs` to the index for multi-GPU entries
For GB200_NVL72, MI355X, DGX B200, etc., the intra-fabric bandwidth is a primary differentiator.
Note: this data is already present in full spec files (`networking_and_connectivity.nvlink_fabric`);
this item is about promoting it to the index for fast lookup.

---

## Low Priority

### L1. Machine-readable per-entry data freshness (`verified_date`)
Replace the single `last_updated` at the top of `_index.yaml` with a per-entry `verified_date`.
Useful once the collection is large enough that entries age at different rates.

### L2. `performance_tier` classification
```yaml
performance_tier: flagship   # flagship | high-end | mid-range | entry | edge
```
Useful for filtering but subjective; defer until there are more chips to classify.

### L3. `use_case_tags` list
```yaml
use_case_tags: [llm-training, hpc, inference, graphics, workstation]
```
Enables tag-based filtering; deferred since `type` and `form_factor` already cover basic categorization.

### L4. `thermal_design` sub-section for GPUs
Structured cooling metadata (cooling_method, min/max inlet temperature) for datacenter planning.
Low priority until cooling diversity in the repo justifies the schema complexity.

### L5. `software_maturity` section for announced chips
For VR200, MI355X: ROCm/CUDA/PyTorch/Triton readiness flags. Low priority; info changes rapidly.

### L6. `predecessor`/`successor` navigation for CPU index entries
CPU entries currently lack `predecessor`/`successor`. Low priority since the CPU collection is
small and generational mapping is straightforward.

