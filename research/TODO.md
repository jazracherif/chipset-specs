# Research Pipeline TODO

Tracks progress on extracting benchmark hardware info from papers in `databases.yaml`
and adding those chips to `research/accelerated_databases/` and the chip spec files.

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Canonical YAML created; hardware confirmed from paper |
| 🔒 | Canonical YAML created; hardware **not extracted** — paper paywalled |
| ⚠️ | Canonical YAML created; hardware **partially known** (from description in databases.yaml, not full paper) |
| ❌ | No canonical YAML yet |

---

## Papers Processed

| Database | YAML | Hardware Extracted | Access Status | Chip Spec Updated |
|----------|------|--------------------|---------------|-------------------|
| Theseus (Voltron) | ✅ [theseus.yaml](accelerated_databases/theseus.yaml) | ✅ Full | Open (arXiv HTML) | DGX A100 → [ampere.yaml](../specs/nvidia/gpus/ampere.yaml), Xeon 8380 → [xeon.yaml](../specs/intel/cpus/xeon.yaml) |
| SiriusDB | ✅ [siriusdb.yaml](accelerated_databases/siriusdb.yaml) | ✅ Full | Open (arXiv HTML) | GH200 → [hopper.yaml](../specs/nvidia/gpus/hopper.yaml), A100 → [ampere.yaml](../specs/nvidia/gpus/ampere.yaml) |
| Harmonia | ⚠️ [harmonia.yaml](accelerated_databases/harmonia.yaml) | ⚠️ GPU only (Titan V — from databases.yaml description) | ACM paywall | None (Titan V not in repo) |
| Crystal | 🔒 [crystal.yaml](accelerated_databases/crystal.yaml) | 🔒 None | ACM paywall (HTTP 403) | None |
| CoGaDB | 🔒 [cogadb.yaml](accelerated_databases/cogadb.yaml) | 🔒 None | Project page, no hardware section | None |
| Ocelot/HyPE | 🔒 [ocelot_hype.yaml](accelerated_databases/ocelot_hype.yaml) | 🔒 None | PVLDB rate-limited (HTTP 429) | None |
| Hawk | 🔒 [hawk.yaml](accelerated_databases/hawk.yaml) | 🔒 None | Springer paywall | None |
| Virginian | 🔒 [virginian.yaml](accelerated_databases/virginian.yaml) | 🔒 None | PDF Forbidden | None |
| Wukong+G | 🔒 [wukong_g.yaml](accelerated_databases/wukong_g.yaml) | 🔒 None | IEEE paywall (HTTP 418) | None |
| Themis | 🔒 [themis.yaml](accelerated_databases/themis.yaml) | 🔒 None | ACM/PVLDB paywall (HTTP 403) | None |
| Vortex | 🔒 [vortex.yaml](accelerated_databases/vortex.yaml) | 🔒 None | ACM/PVLDB paywall (HTTP 403) | None |
| H-Rocks | 🔒 [h_rocks.yaml](accelerated_databases/h_rocks.yaml) | 🔒 None | ACM paywall (HTTP 403) | None |
| Maximus | ✅ [maximus.yaml](accelerated_databases/maximus.yaml) | ✅ Full (user-supplied §6.1.3 excerpt) | Open | A100 → [ampere.yaml](../specs/nvidia/gpus/ampere.yaml) |
| TQP | 🔒 [tqp.yaml](accelerated_databases/tqp.yaml) | 🔒 None | arXiv PDF failed; PVLDB paywall | None |
| GoLAP | 🔒 [golap.yaml](accelerated_databases/golap.yaml) | 🔒 None | ACM paywall (HTTP 403) | None |
| VecFlow | 🔒 [vecflow.yaml](accelerated_databases/vecflow.yaml) | 🔒 None | ACM paywall (HTTP 403) | None |
| GHive | 🔒 [ghive.yaml](accelerated_databases/ghive.yaml) | 🔒 None | ACM paywall (HTTP 403) | None |
| RAYdb | 🔒 [raydb.yaml](accelerated_databases/raydb.yaml) | 🔒 None | ACM/PVLDB paywall (HTTP 403) | None |
| GUST | 🔒 [gust.yaml](accelerated_databases/gust.yaml) | 🔒 None | CIDR PDF content extraction failed | None |

### Skipped (no paper_links URL)
- HeavyDB (MapD/OmniSciDB) — `paper_links: []`
- Alenka — `paper_links: []`
- BlazingSQL — no paper_links field
- PG-Strom — no paper_links field
- TileDB — no paper_links field

---

## Chips Found in Papers — Not in This Repo

These GPUs and CPUs appeared in benchmark setups but have no spec file in `specs/`.
Adding them would require new spec files (see the chip-spec-update skill).

### Missing GPUs

| Chip | Architecture | Paper(s) | Notes |
|------|-------------|----------|-------|
| NVIDIA Titan V | Volta (GV100) | Harmonia | 12 GB HBM2, 652.8 GB/s, released Dec 2017 |
| NVIDIA L4 | Ada Lovelace | Theseus (cloud: AWS g6.4xlarge) | 24 GB GDDR6, 300 GB/s, 72W TDP, released 2023 |
| NVIDIA Titan V — Grace CPU (integrated in GH200) | Hopper | SiriusDB | GH200 = Grace CPU + H200 GPU; Grace CPU (72-core Neoverse V2) is not tracked separately |

### Missing CPUs

| Chip | Family | Paper(s) | Notes |
|------|--------|----------|-------|
| Intel Xeon @ 2.20 GHz (GCP Cascade Lake, unspecified SKU) | Xeon Scalable | Maximus (GCP a2-highgpu-1g) | 6 physical / 12 virtual cores, 85 GB RAM, PCIe 3.0; exact SKU not disclosed in paper |
| Intel Xeon Gold 6526Y | Granite Rapids (Xeon 6) | SiriusDB (4-node A100 cluster) | 64 cores, PCIe 4.0; not in xeon.yaml |
| NVIDIA Grace (Neoverse V2, 72 cores) | ARM Neoverse V2 | SiriusDB (GH200 single-node) | Integrated in GH200 superchip; ARM architecture, not Intel/AMD; no CPU spec file |
| AWS Graviton3 (r7gd.12xlarge, 48 vCPUs) | ARM Graviton3 | Theseus (Photon comparison baseline) | Competitor system only — not a Theseus benchmark node |

### Unknown (hardware not yet extracted due to paywall)

These papers likely use one or more chips not in this repo, but cannot be confirmed until
the papers are accessed:

- Crystal (2020) — possibly V100 or RTX 2080 Ti
- CoGaDB (2012), Ocelot/HyPE (2014), Hawk (2016), Virginian (2012) — era-appropriate NVIDIA GPUs (GTX 480–1080 / Tesla C2070–P100); unlikely to be added to this repo
- Wukong+G (2021) — possibly V100 or A100 (SJTU IPADS cluster)
- Themis (2024), Vortex (2024), Maximus (2025), H-Rocks (2025), GoLAP (2025) — likely A100 or H100
- TQP (2022) — Microsoft Research; likely V100 or A100
- VecFlow (2026), GHive (2022), RAYdb (2026), GUST (2026) — unknown

---

## Next Steps

- [ ] Access paywalled papers via institutional login and fill in `system:` fields in stub YAMLs
- [ ] Add spec files for **NVIDIA Titan V** (`specs/nvidia/gpus/volta.yaml`)
- [ ] Add spec files for **NVIDIA L4** (`specs/nvidia/gpus/ada_lovelace.yaml` or append to an existing file)
- [ ] Add spec entry for **Intel Xeon Gold 6526Y** to `specs/intel/cpus/xeon.yaml`
- [ ] Add spec entry for **NVIDIA Grace CPU** to a new `specs/nvidia/cpus/` directory
- [ ] After hardware is confirmed for a paper, add a slim `research:` block to the relevant chip spec files and update the table in [README.md](README.md)
