# Chip Research & Industry Benchmarks

Curated list of notable academic papers and industry work that benchmark or demonstrate real-world workloads on specific chips in this repository, organized by domain.

---

## Accelerated Databases

| Engine | System | GPU | CPU (host) | Benchmark | Key Result | Paper | YAML |
|--------|--------|-----|------------|-----------|------------|-------|------|
| Theseus | 2× DGX A100 640GB nodes (on-prem); AWS EC2 g6.4xlarge (cloud) | [NVIDIA DGX A100](../specs/nvidia/gpus/ampere.yaml) | [Intel Xeon Platinum 8380](../specs/intel/cpus/xeon.yaml) (4 TiB RAM/node) | TPC-H, TPC-DS SF 1k–100k (100 TB) | Up to 4× faster than Databricks Photon at cost parity; completes 100 TB workload with 2 nodes | [arXiv 2508.05029](https://arxiv.org/abs/2508.05029) | [theseus.yaml](accelerated_databases/theseus.yaml) |
| SiriusDB | Single: 1× GH200; Distributed: 4× A100 (40 GB) nodes | [GH200](../specs/nvidia/gpus/hopper.yaml) / [A100](../specs/nvidia/gpus/ampere.yaml) | Grace CPU (GH200) / Intel Xeon Gold 6526Y (A100 nodes) ⚠️ | TPC-H SF=100, ClickBench | 8.3× cost efficiency vs DuckDB; 7.4× vs ClickHouse; up to 12.5× speedup vs Doris | [arXiv 2508.04701](https://arxiv.org/abs/2508.04701) | [siriusdb.yaml](accelerated_databases/siriusdb.yaml) |
| Harmonia | Single GPU | NVIDIA Titan V ⚠️ | not extracted | B+tree query throughput | 3.6B queries/sec; 3.4× faster than prior state-of-the-art (HB+Tree) | [ACM PPoPP 2020](https://dl.acm.org/doi/epdf/10.1145/3293883.3295704) | [harmonia.yaml](accelerated_databases/harmonia.yaml) |
| Crystal | Single GPU | unknown 🔒 | unknown 🔒 | Star Schema Benchmark | 25× speedup over CPU; full query speedup exceeds memory bandwidth ratio | [ACM SIGMOD 2020](https://dl.acm.org/doi/epdf/10.1145/3318464.3380595) | [crystal.yaml](accelerated_databases/crystal.yaml) |
| TQP | Single GPU / CPU | unknown 🔒 | unknown 🔒 | TPC-H, TPC-DS, ML+SQL | Up to 10× over CPU/GPU-only; 9× for ML+SQL queries | [arXiv 2203.01877](https://arxiv.org/abs/2203.01877) | [tqp.yaml](accelerated_databases/tqp.yaml) |
| GHive | Multi-GPU (Hadoop cluster) | unknown 🔒 | unknown 🔒 | HiveQL / TPC-H | GPU-accelerated joins and aggregations as drop-in replacement in Apache Hive | [ACM 2022](https://dl.acm.org/doi/10.1145/3542929.3563503) | [ghive.yaml](accelerated_databases/ghive.yaml) |
| Wukong+G | Multi-GPU cluster (≤10 GPUs) | unknown 🔒 | unknown 🔒 | SPARQL (LUBM, BSBM) | 9× speedup over CPU-only Wukong; scales to 10 GPU cards | [IEEE TPDS 2021](https://ieeexplore.ieee.org/document/9582823) | [wukong_g.yaml](accelerated_databases/wukong_g.yaml) |
| Themis | Single GPU | unknown 🔒 | unknown 🔒 | TPC-H (likely) | Eliminates intra/inter-warp idle GPU cores via warp-level work-stealing | [PVLDB 2024](https://dl.acm.org/doi/10.14778/3705829.3705856) | [themis.yaml](accelerated_databases/themis.yaml) |
| Vortex | Multi-GPU | unknown 🔒 | unknown 🔒 | TPC-H / SSB (likely) | SDMA-based I/O aggregates PCIe bandwidth from helper GPUs for out-of-core queries | [PVLDB 2024](https://dl.acm.org/doi/10.14778/3717755.3717780) | [vortex.yaml](accelerated_databases/vortex.yaml) |
| H-Rocks | Single GPU | unknown 🔒 | unknown 🔒 | Custom KV (LSM-tree) | GPU-accelerated LSM-tree with operation sub-batching and GPU-side versioning | [ACM 2025](https://dl.acm.org/doi/10.1145/3709694) | [h_rocks.yaml](accelerated_databases/h_rocks.yaml) |
| Maximus | GCP a2-highgpu-1g VM (single node) | [A100 (40 GB)](../specs/nvidia/gpus/ampere.yaml) | Intel Xeon @ 2.20 GHz (6-core, 85 GB RAM) ⚠️ | TPC-H (likely) | Cost-based GPU routing by predicate selectivity; models interconnect crossing point (PCIe 3.0, 12.35 GB/s) | [SIGMOD 2025](https://dl.acm.org/doi/10.1145/3725324) | [maximus.yaml](accelerated_databases/maximus.yaml) |
| GoLAP | GPU + NVMe SSD | unknown 🔒 | unknown 🔒 | TPC-H / OLAP scans (likely) | Direct SSD-to-GPU streaming with hardware decompression; CPU bypassed in scan hot path | [ACM 2025](https://dl.acm.org/doi/10.1145/3698812) | [golap.yaml](accelerated_databases/golap.yaml) |
| VecFlow | Single GPU | unknown 🔒 | unknown 🔒 | Hybrid vector+relational | Label-centric ANNS for filtered nearest-neighbor + relational queries | [ACM 2026](https://dl.acm.org/doi/10.1145/3749189) | [vecflow.yaml](accelerated_databases/vecflow.yaml) |
| RAYdb | Single GPU (RT Cores) | NVIDIA RTX series ⚠️ | unknown 🔒 | TPC-H / scan benchmarks (likely) | Database scans rephrased as RT core ray tracing jobs; bypasses CUDA core bandwidth saturation | [PVLDB 2026](https://dl.acm.org/doi/10.14778/3772181.3772185) | [raydb.yaml](accelerated_databases/raydb.yaml) |
| GUST | Multi-tenant GPU | unknown 🔒 | unknown 🔒 | OLAP + AI co-tenancy | PCIe bus as scheduling resource; reduced interference between analytics and AI workloads | [CIDR 2026](https://www.vldb.org/cidrdb/papers/2026/p13-jiang.pdf) | [gust.yaml](accelerated_databases/gust.yaml) |
| CoGaDB | Single GPU | unknown 🔒 | unknown 🔒 | TPC-H (subset) | Early hybrid CPU/GPU execution with runtime operator placement | [ADMS@VLDB 2012](https://wwwiti.cs.uni-magdeburg.de/iti_db/research/gpu/cogadb/0.22/doc/) | [cogadb.yaml](accelerated_databases/cogadb.yaml) |
| Ocelot/HyPE | Heterogeneous CPU+GPU | unknown 🔒 | unknown 🔒 | TPC-H (subset) | Learning optimizer for cross-hardware operator placement; OpenCL portability | [VLDB 2014](https://www.vldb.org/pvldb/vol7/p1609-bress.pdf) | [ocelot_hype.yaml](accelerated_databases/ocelot_hype.yaml) |
| Hawk | CPU + GPU | unknown 🔒 | unknown 🔒 | TPC-H (subset) | Hardware-oblivious LLVM-based compilation; auto-generates CPU and GPU code | [VLDB-J 2016](https://link.springer.com/article/10.1007/s00778-018-0512-y) | [hawk.yaml](accelerated_databases/hawk.yaml) |
| Virginian | Single GPU | unknown 🔒 | unknown 🔒 | Custom relational suite | Early GPU DB prototype; comprehensive GPU performance evaluation | [UVA 2012](https://pbbakkum.com/virginian/paper.pdf) | [virginian.yaml](accelerated_databases/virginian.yaml) |

> ⚠️ = hardware partially known (from description only, not paper full text) · 🔒 = hardware not extracted (paper paywalled)

---

## How to Add an Entry

1. **Create a canonical YAML** under `research/<domain>/<engine-name>.yaml` with all details — see [research/accelerated_databases/theseus.yaml](accelerated_databases/theseus.yaml) as a template.
2. **Add a slim reference** to each chip's spec file that participated in the benchmark (GPU, host CPU, etc.), using only `name` and `system` — see the `research` block in [specs/nvidia/gpus/ampere.yaml](../specs/nvidia/gpus/ampere.yaml) or [specs/intel/cpus/xeon.yaml](../specs/intel/cpus/xeon.yaml).
3. **Add a row** to the matching table above.

### Canonical YAML schema (`research/<domain>/<engine>.yaml`)

```yaml
name: EngineName
full_name: "Full Paper Title"
domain: accelerated_databases       # domain key — add new keys for other domains
type: production engine | research prototype | benchmark suite
paper: https://arxiv.org/...
published: "YYYY-MM-DD"
venue: "arXiv:XXXX.XXXXX [cs.XX]"

benchmark:
  suites: ["TPC-H", "TPC-DS"]
  scale_factors: "description of scale"

system:
  nodes: N
  node_type: "node description"
  gpu: ChipName                     # spec: specs/nvidia/gpus/<file>.yaml
  host_cpu: ChipName                # spec: specs/intel/cpus/<file>.yaml

results:
  - "headline result 1"
  - "headline result 2"
```

### Chip spec reference (slim, in each participating chip's YAML)

```yaml
research:
  accelerated_databases:            # match the domain key
    - name: EngineName
      system: "hardware configuration"  # full details: research/<domain>/<engine>.yaml
```
