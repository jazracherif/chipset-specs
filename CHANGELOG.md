# CHANGELOG

All notable corrections and additions to chip specifications are recorded here.
Entries are listed newest-first.

---

## 2026-04-20

### Accuracy corrections

**`specs/_index.yaml` — GH200**
- `memory_gb`: 624 → **621** — H200 official datasheet specifies 141 GB HBM3e (not 144 GB); 141 + 480 = 621 GB total unified. Source: [NVIDIA H200 GPU Datasheet](https://resources.nvidia.com/en-us-data-center-overview-mc/en-us-data-center-overview/h200-datasheet)
- `memory_bw_tbs`: 4.9 → **4.8** — Official NVIDIA H200 datasheet states 4.8 TB/s. Source: same.
- `fp16_tflops`: null → **1979** — GH200 uses the same GH100 die as H100 SXM5; fp16 performance is identical. Value already present in `specs/nvidia/gpus/hopper.yaml`.

**`specs/_index.yaml` — EPYC 9965**
- `full_name`: "AMD EPYC 9965X" → **"AMD EPYC 9965"** — "X" suffix denotes the 3D V-Cache variant; the non-X 9965 is the correct product. Confirmed on AMD product page.
- `peak_fp32_tflops`: 7.4 → **13.8** — Previous value used Zen 4 FMA assumptions (1× 256-bit FMA unit → 8 FP32/cycle). Zen 5 has 2× native 512-bit FMA units → 16 FP32/cycle. Correct derivation: 192 cores × 2 FMA × 16 FP32 × 2.25 GHz / 1000 = 13.8 TFLOPS.

**`specs/amd/cpus/epyc.yaml` — EPYC 9965 (Turin)**
- `max_memory_speed_mts`: 6400 → **6000** — AMD EPYC 9005 series (Turin) officially supports DDR5-6000, not DDR5-6400. Source: AMD EPYC 9965 Product Page [1].
- `memory_bandwidth_gbs`: 614 → **576** — Corrected derivation: 12 channels × 48 GB/s (DDR5-6000) = 576 GB/s. Previous value was derived from the incorrect DDR5-6400 speed.

**`specs/intel/cpus/xeon.yaml` — Xeon 6980P**
- `memory_bandwidth_gbs`: 614 → **409** — 614 was a theoretical derivation from 12× DDR5-6400 channels; Intel ARK officially lists 409 GB/s as the rated max memory bandwidth (controller-limited). Source: Intel ARK [1].

### README corrections (consistency with index/spec)
- GB200 NVL72 memory: "13.8 TB" → **13.4 TB** (186 GB × 72 = 13,392 GB = 13.4 TB)
- DGX B200 memory: "1,536 GB" → **1,440 GB** (180 GB × 8 GPUs = 1,440 GB)
- GH200 memory: "624 GB unified" → **621 GB unified** (consistent with index correction above)

### New fields added to `specs/_index.yaml` (GPU entries)
- `predecessor` — name of the preceding chip in the same product line (where applicable)
- `successor` — name of the succeeding chip in the same product line (where applicable)
- `is_discontinued: true` — added to A100, DGXA100, T4 (end-of-life / no longer manufactured)
- `deployed_in` — list of key systems or platforms that ship with this chip

### New file: `specs/_schema.json`
- Added `predecessor`, `successor`, `is_discontinued`, `deployed_in` to `index_entry` `$defs`

### New file: `scripts/validate-data.mjs`
- Added cross-field consistency checks (warnings, not errors) for all CPU spec files:
  - `memory_bandwidth_gbs` vs. derived `memory_channels × channelSpeedGbs(max_memory_speed_mts)` (10% tolerance)
  - `pci_max_bw_gbs` vs. derived `max_pcie_lanes × laneSpeed(pcie_revision)` (1% tolerance)

### `specs/nvidia/gpus/hopper.yaml` — GH200
- Removed stale comment referencing `chip_specs.yml listing 144 GB HBM3e`; added note that the index has been corrected to match the H200 datasheet.

### `specs/amd/cpus/epyc.yaml` — EPYC 9965
- Replaced informal source comment on `max_memory_speed_mts` with `# [1]` reference annotation.
