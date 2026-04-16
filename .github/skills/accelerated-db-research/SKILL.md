---
name: accelerated-db-research
description: "Query, add, or update accelerated database research entries. Use when: looking up which databases were benchmarked on a chip, finding paper hardware specs, adding a new database paper, updating an existing research entry with confirmed hardware, checking research coverage for a GPU or CPU, listing all benchmarked databases."
argument-hint: "action and target, e.g. 'find all databases benchmarked on A100' or 'add CrystalDB paper'"
---

# Accelerated Database Research

Tracks GPU/CPU-accelerated DBMS papers with hardware specs, benchmarks, and results.

## Repository Layout

| Path | Purpose |
|------|---------|
| [`research/README.md`](../../research/README.md) | Master table — 19 databases, GPU, CPU, benchmark, key result |
| [`research/accelerated_databases/<name>.yaml`](../../research/accelerated_databases/) | Canonical full entry per paper |
| [`research/TODO.md`](../../research/TODO.md) | Status tracker (✅ confirmed / ⚠️ partial / 🔒 paywalled) |
| Chip spec files | Slim `research:` blocks pointing back to the canonical YAML |

---

## Workflow 1: Query Existing Research

1. **Quick lookup** — read [`research/README.md`](../../research/README.md) for the master table.
2. **Full details** — read `research/accelerated_databases/<name>.yaml` for authors, system specs, benchmark config, results.
3. **Chip-centric lookup** — open the relevant chip spec file and search for `research:` blocks.
   - GPU spec files: `specs/nvidia/gpus/`, `specs/amd/gpus/`
   - CPU spec files: `specs/intel/cpus/`, `specs/amd/cpus/`
4. **Coverage gaps** — check [`research/TODO.md`](../../research/TODO.md) for paywalled or incomplete entries.

---

## Workflow 2: Add a New Database Paper

Do all three steps in order.

### Step 1 — Create the canonical YAML

Create `research/accelerated_databases/<name>.yaml` using the schema below.
Set `hardware_extracted: true` only when system specs are confirmed from the paper.
For paywalled papers, set `hardware_extracted: false` and add a `reason:` field.

```yaml
name: <short-id>                   # lowercase, hyphens, matches filename
full_name: "Full Engine Name"
domain: "Analytical / Transactional / Graph / ..."
type: "GPU-accelerated / CPU-GPU heterogeneous / ..."
paper:
  title: "Full paper title"
  url: https://...
  doi: "10.XXXX/..."               # omit if unavailable
authors:
  - "Last, First"
published: YYYY
venue: "SIGMOD 2025 / arXiv 2508.XXXXX / ..."
benchmark:
  suites:
    - name: "TPC-H / TPC-DS / SSB / ..."
      scale_factors: [SF1, SF100, ...]
  metrics: "execution time / throughput / ..."
system:
  hardware_extracted: true
  gpu:
    model: "NVIDIA A100-SXM4-80GB"
    count: 8
    memory_gb: 80
    memory_type: HBM2e
    interconnect: "NVLink 3.0 / PCIe 4.0 / ..."
  cpu:
    model: "Intel Xeon Platinum 8380"
    sockets: 2
    cores_per_socket: 40
    memory_gb: 4096
    memory_type: DDR4-3200
  storage: "WEKA / NVMe / ..."
  network: "200 Gb/s InfiniBand / ..."
  notes: "Any important clarifications"
results:
  headline: "One-line key result"
  details: "Optional elaboration"
```

**For a paywalled paper** (hardware unknown):

```yaml
system:
  hardware_extracted: false
  reason: "ACM DL paywall — HTTP 403"
  era_notes: "Published YYYY; likely used contemporary NVIDIA GPUs available at that time"
```

### Step 2 — Add slim refs to chip spec files

For each GPU and CPU used in the paper, append a slim entry to the chip's `research:` block.
Use the routing table to find the right file.

```yaml
# In the chip spec file (e.g. specs/nvidia/gpus/ampere.yaml)
research:
  accelerated_databases:
    - name: <short-id>            # must match the canonical YAML filename (without .yaml)
      system: "Brief system description, e.g. '2× DGX A100 640GB nodes'"
      # Full details: research/accelerated_databases/<short-id>.yaml
```

**Chip spec file routing:**

| Chip | File |
|------|------|
| NVIDIA A100 / DGXA100 | [`specs/nvidia/gpus/ampere.yaml`](../../specs/nvidia/gpus/ampere.yaml) |
| NVIDIA H100 / GH200 | [`specs/nvidia/gpus/hopper.yaml`](../../specs/nvidia/gpus/hopper.yaml) |
| NVIDIA GB200 / GB10 | [`specs/nvidia/gpus/blackwell.yaml`](../../specs/nvidia/gpus/blackwell.yaml) |
| NVIDIA T4 | [`specs/nvidia/gpus/turing.yaml`](../../specs/nvidia/gpus/turing.yaml) |
| AMD MI300X / MI350X / MI355X | [`specs/amd/gpus/cdna3.yaml`](../../specs/amd/gpus/cdna3.yaml) or [`cdna4.yaml`](../../specs/amd/gpus/cdna4.yaml) |
| Intel Xeon | [`specs/intel/cpus/xeon.yaml`](../../specs/intel/cpus/xeon.yaml) |
| AMD EPYC | [`specs/amd/cpus/epyc.yaml`](../../specs/amd/cpus/epyc.yaml) |

If a chip used in the paper is not present in the repo, note it in [`research/TODO.md`](../../research/TODO.md) under "Missing Chips".

### Step 3 — Update the master table

Append a row to the table in [`research/README.md`](../../research/README.md):

```markdown
| [EngineName](accelerated_databases/<name>.yaml) | System description | [ChipName](../specs/.../file.yaml) | [CPU](../specs/.../file.yaml) or N/A | TPC-H SFX | Key result | [Paper](https://...) | [YAML](accelerated_databases/<name>.yaml) |
```

Also update [`research/TODO.md`](../../research/TODO.md): mark the entry ✅ if hardware is confirmed, ⚠️ if partial, 🔒 if paywalled.

---

## Workflow 3: Update an Existing Entry with New Information

1. Read `research/accelerated_databases/<name>.yaml` for the current state.
2. Update the fields with confirmed data. Change `hardware_extracted` to `true` and remove `reason:` once hardware is confirmed.
3. If a chip ref was missing, add it now (Step 2 above).
4. Update the README.md table row to reflect confirmed data (replace "unknown 🔒" with actual specs ✅).
5. Update the TODO.md row status.

---

## Status Markers

| Marker | Meaning |
|--------|---------|
| ✅ | Hardware confirmed from paper |
| ⚠️ | Partial — some hardware known, some not |
| 🔒 | Paywalled — hardware unknown |
