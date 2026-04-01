---
name: chip-spec-update
description: "Add a new chip to the repository spec files, or update an existing chip's specifications. Use when: adding a new GPU or CPU, updating specs after a product announcement, filling in missing fields, adding a new architecture generation."
argument-hint: "chip name and vendor, e.g. 'add NVIDIA GB300' or 'update MI400X specs'"
---

# Spec Update

Adds a new chip entry or updates an existing one across the repository's spec files.

## Files to Update

Every spec update touches **three** locations — do all three, in order:

| # | File | What to Add/Update |
|---|------|--------------------|
| 1 | Full spec file (see routing below) | Complete chip entry |
| 2 | [`specs/_index.yaml`](../../specs/_index.yaml) | Summary entry (~8 key fields + `spec_file`) |
| 3 | [`README.md`](../../README.md) | Mention in chip list if applicable |

## Routing: Which Full Spec File?

| Chip type | Architecture | File |
|-----------|-------------|------|
| NVIDIA GPU | Blackwell | [`specs/nvidia/gpus/blackwell.yaml`](../../specs/nvidia/gpus/blackwell.yaml) |
| NVIDIA GPU | Hopper | [`specs/nvidia/gpus/hopper.yaml`](../../specs/nvidia/gpus/hopper.yaml) |
| NVIDIA GPU | Rubin | [`specs/nvidia/gpus/rubin.yaml`](../../specs/nvidia/gpus/rubin.yaml) |
| NVIDIA GPU | Turing | [`specs/nvidia/gpus/turing.yaml`](../../specs/nvidia/gpus/turing.yaml) |
| NVIDIA GPU | New generation | Create `specs/nvidia/gpus/<generation>.yaml` using an existing file as template |
| AMD GPU | CDNA 4 | [`specs/amd/gpus/cdna4.yaml`](../../specs/amd/gpus/cdna4.yaml) |
| AMD GPU | CDNA 3 | [`specs/amd/gpus/cdna3.yaml`](../../specs/amd/gpus/cdna3.yaml) |
| AMD GPU | New generation | Create `specs/amd/gpus/<cdna-gen>.yaml` using an existing file as template |
| AMD CPU | Any EPYC generation | [`specs/amd/cpus/epyc.yaml`](../../specs/amd/cpus/epyc.yaml) |
| Intel CPU | Any Xeon generation | [`specs/intel/cpus/xeon.yaml`](../../specs/intel/cpus/xeon.yaml) |
| Intel CPU | New family | Create `specs/intel/cpus/<family>.yaml` using `xeon.yaml` as template |

## Required Sections

### CPU Entry (append inside `cpus:` list in the target file)

```yaml
  - name: CHIP_NAME
    full_name: "Full Display Name"
    brand: AMD | Intel
    family:             # e.g. EPYC, Xeon Scalable, Xeon 6
    generation:         # e.g. Turin, Granite Rapids
    microarch:          # AMD only — e.g. Zen 5
    gen_number:         # integer
    year:
    max_cores:          # per-socket
    memory_channels:
    memory_type:        # e.g. DDR5-6000
    memory_bandwidth_gbs:
    best_simd: AVX2 | AVX-512
    simd_width_bits: 256 | 512
    avx_fp_units:       # total FP32 lanes across all AVX units
    peak_fp32_tflops:
    peak_fp32_clock_ghz:
    source: https://...
```

### `_index.yaml` CPU Entry (append inside `cpus:` list)

```yaml
  - name: CHIP_NAME
    full_name: "Full Display Name"
    vendor: AMD | Intel
    family:
    generation:
    microarch:          # AMD only
    year:
    max_cores:
    memory_bw_gbs:
    memory_type:
    peak_fp32_tflops:
    tdp_w: null         # or actual value in watts
    spec_file: specs/<vendor>/cpus/<file>.yaml
```

### NVIDIA GPU Entry (append inside `gpus:` in the target file)

```yaml
  CHIP_KEY:
    name: "Full Display Name"
    references:
      - name: Product Page
        url: https://...

    core_specifications:
      release_date:
      architecture:
      compute_capability:
      gpu_count:
      streaming_multiprocessors:
      cuda_cores_fp32_per_sm:
      cuda_cores_fp32_per_gpu:
      max_clock_speed:
      form_factor:

    sm_execution_model:
      shared_memory_per_sm:
      shared_memory_per_block:
      max_resident_threads_per_sm:
      max_resident_blocks_per_sm:

    memory_specifications:
      architecture:
      ecc_support:
      gpu_memory:
        capacity:
        memory_type:
        l2_cache:
        bandwidth:
        bus_width:

    compute_performance:
      fp32:
      fp16_bf16:
      fp8:
      fp4:
      tensor_core_generation:

    power_and_thermal:
      tdp:
      form_factor:
      cooling:

    advanced_features:
      mig:
      nvlink:
      transformer_engine:

    software_and_ecosystem:
      cuda_toolkit:
      minimum_driver:
```

### AMD GPU Entry (append inside `gpus:` in the target file)

```yaml
  CHIP_KEY:
    name: "Full Display Name"
    references:
      - name: Product Page
        url: https://...

    core_specifications:
      release_date:
      architecture:        # e.g. CDNA 4
      target_id:           # e.g. gfx950
      gpu_count:
      compute_units:
      stream_processors_per_cu: 64
      wavefront_size: 64
      max_clock_speed:
      form_factor:         # OAM or PCIe

    cu_execution_model:
      lds_per_cu:
      max_wavefronts_per_cu:
      max_workitems_per_cu: 2048
      simd_units_per_cu: 4
      vgpr_per_cu:

    memory_specifications:
      architecture:
      total_capacity:
      memory_type:
      ecc_support: true
      gpu_memory:
        capacity:
        memory_type:
        infinity_cache:
        bandwidth:
        bus_width:

    compute_performance:
      fp16_bf16_mfma_dense:
      fp8_mfma_dense:
      fp4_mfma_dense:
      fp64_mfma_matrix:
      matrix_core_generation:

    power_and_thermal:
      socket_tdp:
      form_factor:
      cooling:

    software_and_ecosystem:
      rocm_version:
      programming_model: "HIP C++"
      math_libraries:
      dnn_library:
      collective_comms: RCCL
```

### `_index.yaml` Entry (append inside `gpus:`)

```yaml
  - name: CHIP_NAME
    full_name: "Full Display Name"
    vendor: NVIDIA | AMD
    architecture: <generation>
    generation: <generation>
    year: <year>
    type: datacenter GPU | consumer GPU | superchip | datacenter rack (N GPUs)
    form_factor: <form factor>
    memory_gb: <number>
    memory_type: HBM3E | HBM3 | GDDR7 | LPDDR5x
    memory_bw_tbs: <number>       # use memory_bw_gbs for < 1 TB/s
    fp16_tflops: <number>
    fp32_tflops: <number>
    tdp_w: <number>               # use tdp_kw for rack-scale
    cost_usd_range: null          # or [low, high]
    spec_file: specs/<vendor>/gpus/<file>.yaml
```

## Source Annotation Convention

Every entry must annotate the provenance of each field using inline YAML comments. Follow the same pattern used in [`specs/nvidia/gpus/ampere.yaml`](../../specs/nvidia/gpus/ampere.yaml):

### Rules

1. **Declare a default source** with a comment block directly above the `references:` list:
   ```yaml
   # Default source: [1] <Source Name>
   # Fields from other sources are annotated with [n]
   ```

2. **Number the references list** — add `# [n]` after each entry:
   ```yaml
   references:
     - name: NVIDIA A100 GPU Datasheet    # [1] default
       url: https://...
     - name: NVIDIA Ampere Whitepaper     # [2]
       url: https://...
   ```

3. **Fields from the default source ([1])** — no annotation needed (they are implicitly from [1]).

4. **Fields from secondary sources** — annotate inline with `# [n] <brief note>`:
   ```yaml
   l2_cache: 40 MB                        # [2] whitepaper p.27
   pcie_interface: PCIe Gen 4             # [3] whitepaper p.38
   ```

5. **Derived / computed fields** — annotate with `# derived` and include the formula or reasoning:
   ```yaml
   memory_bandwidth_gbs: 205              # derived: 8 channels × 25.6 GB/s (DDR4-3200 per channel)
   cuda_cores_total: 55296                # derived: 6912 × 8 GPUs
   peak_fp32_tflops: 2.9                  # derived: 80 FMA units × 16 FP32/unit × 2.3 GHz / 1000
   ```

6. **Fields from another chip's spec** (e.g. a system entry reusing single-chip data) — annotate with `# derived from <chip> spec`:
   ```yaml
   shared_memory_per_sm: 164 KB           # derived from A100 spec
   ```

### CPU Entry Example

```yaml
  - name: Xeon 8380                    # source
    full_name: Intel Xeon Platinum 8380 # source
    generation: Ice Lake                # source (Code Name: "Products formerly Ice Lake")
    year: 2021                          # source (Launch Date: Q2'21)
    max_cores: 40                       # source (Total Cores: 40)
    memory_channels: 8                  # source (Max # of Memory Channels: 8)
    memory_type: DDR4-3200              # source (Memory Types: DDR4-3200)
    memory_bandwidth_gbs: 205           # derived: 8 channels × 25.6 GB/s (DDR4-3200 per channel)
    avx_fp_units: 80                    # derived: 40 cores × 2 AVX-512 FMA units per core
    peak_fp32_tflops: 2.9               # derived: 80 FMA units × 16 FP32/unit × 2.3 GHz / 1000
    peak_fp32_clock_ghz: 2.3            # source (Processor Base Frequency: 2.30 GHz)
    source: https://...
```

### GPU Entry Example (NVIDIA)

```yaml
  A100:
    name: NVIDIA A100 Tensor Core GPU
    # Default source: [1] NVIDIA A100 GPU Datasheet
    # Fields from other sources are annotated with [n]
    references:
      - name: NVIDIA A100 GPU Datasheet          # [1] default
        url: https://...
      - name: NVIDIA Ampere Architecture Whitepaper  # [2]
        url: https://...

    core_specifications:
      streaming_multiprocessors: 108             # [2] whitepaper p.20
      cuda_cores_fp32_per_gpu: 6912              # derived: 64 × 108 SMs
      max_clock_speed: ~1410 MHz                 # [1] datasheet
```

## Validation Checklist

Before finishing, confirm:

**Schema reference**: [`specs/_schema.json`](../../specs/_schema.json) defines all required fields and allowed values per entry type. Consult `$defs.index_entry` for `_index.yaml` fields, `$defs.nvidia_gpu_entry` for NVIDIA spec files, and `$defs.amd_gpu_entry` for AMD spec files.
- [ ] `name` (key) in the full spec file is unique within that file
- [ ] `spec_file` path in `_index.yaml` resolves to an actual file in the repo
- [ ] `memory_bw_tbs` vs `memory_bw_gbs` — use `tbs` for ≥ 1 TB/s, `gbs` for smaller GPUs
- [ ] `tdp_w` vs `tdp_kw` — use `kw` for rack/system totals
- [ ] All estimated figures are marked with `# estimated` or a note
- [ ] At least one `references` URL is provided
- [ ] For new architecture generations, confirm whether to create a new file or add to an existing one
