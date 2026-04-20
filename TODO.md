# TODO — Proposed Data Layout Improvements

This file captures proposed improvements to the repository's data structure, schema, and tooling.
Items are grouped by theme. Each item explains the motivation and a rough implementation sketch.

---

## 1. Data Quality & Confidence Tracking

### 1a. Add a `data_quality` block to each full spec entry
Many fields in the spec files are labelled `# estimated` or `# derived` in inline comments,
but there is no machine-readable way to query confidence level.

**Proposed addition (per-entry, per-field):**
```yaml
data_quality:
  fp16_tflops:
    confidence: estimated       # official | derived | estimated | tbd
    source: "AMD CDNA 4 whitepaper (announced figure, datasheet pending)"
    last_verified: "2026-04-20"
  memory_bw_tbs:
    confidence: official
    source: "AMD MI350X product page"
    last_verified: "2026-04-20"
```

### 1b. Add a `is_announced_not_released` boolean flag to the index
Chips like MI350X, MI355X, and VR200 are announced but not yet shipping.
A flag would let agents clearly distinguish paper specs from shipping hardware.

```yaml
  - name: MI350X
    is_announced_not_released: true   # flip to false on GA
    ...
```

### 1c. Machine-readable data freshness
Replace the single top-level `last_updated` in `_index.yaml` with a per-entry `verified_date`.
Stale entries can then be automatically surfaced.

---

## 2. Index Fields — Missing & Useful Additions

### 2a. Add `fp8_tflops` to the index
FP8 has become the primary training precision for LLMs (H100, B200, MI300X).
The index currently only tracks `fp16_tflops` and `fp32_tflops`; adding `fp8_tflops`
would allow fair apples-to-apples AI throughput comparisons.

### 2b. Add `int8_tops` to the index for inference comparison
INT8 throughput (TOPS) is critical for inference workloads.

### 2c. Add `memory_bw_per_watt` (derived) to the index
Memory bandwidth per watt is a key efficiency metric for memory-bound workloads
(LLM decode, embedding lookup). Can be derived, but pre-computing it aids quick queries.

### 2d. Add `cost_per_tflops_fp16` (derived, where cost is known)
Currently only GH200 and GB200 NVL72 rack have cost ranges. Where available,
adding a cost-efficiency figure would help purchasing decisions.

### 2e. Add `interconnect_bw_gbs` to the index for multi-GPU entries
For entries like GB200_NVL72 and MI355X, the intra-rack interconnect bandwidth
(NVLink domain bandwidth or XGMI aggregate) is a key differentiator.

---

## 3. Chip Lifecycle & Successor/Predecessor Navigation

### 3a. Add `predecessor` and `successor` fields
```yaml
  - name: MI300X
    predecessor: MI250X
    successor: MI350X
```
This would allow an agent to walk the architecture roadmap without full-text search.

### 3b. Add `is_discontinued` boolean for EOL chips
The T4 (2018) and A100 (2020) are no longer manufactured.
Marking them prevents incorrect recommendations for new deployments.

```yaml
  - name: T4
    is_discontinued: true
    discontinued_date: "2024"
```

---

## 4. Taxonomy & Grouping

### 4a. Add a `performance_tier` classification
Useful for queries like "find me a mid-range datacenter GPU":
```yaml
performance_tier: flagship   # flagship | high-end | mid-range | entry | edge
```

### 4b. Add `use_case_tags` list
```yaml
use_case_tags: [llm-training, hpc, inference, graphics, workstation]
```
Enables fast filtering without relying on free-text search.

### 4c. Split the index by vendor for large collections
As the repository grows, `_index.yaml` will become unwieldy.
Consider splitting into `_index_nvidia.yaml`, `_index_amd.yaml`, `_index_intel.yaml`, etc.,
with a root `_index.yaml` that aggregates them or acts as a manifest.

---

## 5. Schema Improvements

### 5a. Add cross-field consistency validation to the schema/script
The current JSON Schema validates structural shape but not numeric cross-field consistency.
For example: `memory_bandwidth_gbs` should equal `memory_channels × speed_per_channel_gbs`.
Add a second validation pass in `validate-data.mjs` to check derived-field arithmetic.

Example check:
```js
// CPU bandwidth cross-check
const derivedBw = entry.memory_specifications.memory_channels
    * channelSpeedGbs(entry.memory_specifications.max_memory_speed_mts);
if (Math.abs(derivedBw - entry.memory_specifications.memory_bandwidth_gbs) > 5) {
  errors.push(`${name}: memory_bandwidth_gbs ${entry.memory_specifications.memory_bandwidth_gbs}
       does not match derived ${derivedBw} GB/s`);
}
```

### 5b. Add `die_size_mm2` and `transistor_count_billions` to the GPU schema
These are key comparison points for microarchitecture analysis.

### 5c. Standardise `form_factor` as an enum
Currently free-text; unify as:
```
OAM | SXM5 | SXM4 | PCIe | Low-Profile-PCIe | Desktop-APU | Rack | Superchip
```

---

## 6. New Spec Sections to Add

### 6a. Add `deployment_examples` to the index (not just full spec files)
The full spec files have a `research` block but the index lacks deployment context.
A brief `deployed_in` field in the index would help agents answer
"What systems use the H100?" without loading full spec files.

### 6b. Add `thermal_design` sub-section to GPUs
Current entries have `tdp_w` / `tdp_kw` but no detail on cooling technology.
A structured block would aid datacenter planning:
```yaml
thermal_design:
  tdp_w: 700
  cooling_method: liquid      # liquid | air | passive
  min_inlet_temp_c: 35
  max_inlet_temp_c: 45
```

### 6c. Add `software_maturity` section for newer chips
For chips with estimated specs (VR200, MI355X), note software-stack readiness:
```yaml
software_maturity:
  rocm_support: planned       # ga | beta | planned | tbd
  pytorch_support: planned
  triton_support: tbd
```

---

## 7. Comparisons & Documentation

### 7a. Add pre-written comparisons for key pairs not yet covered
Currently only GB10-centric comparisons exist. High-value additions:
- `h100-mi300x.md`   — head-to-head training comparison
- `mi300x-mi350x.md` — CDNA 3 vs CDNA 4 upgrade analysis
- `a100-h100.md`     — generational leap (Ampere → Hopper)
- `xeon-epyc-cpu.md` — cross-vendor CPU comparison for AI workloads

### 7b. Add a `CHANGELOG.md` to track spec corrections
Each time a field is corrected (e.g., GH200 memory bandwidth 4.9 → 4.8 TB/s),
log it in a changelog so auditors can trace the source of changes.
