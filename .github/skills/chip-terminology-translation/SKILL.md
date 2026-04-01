---
name: chip-terminology-translation
description: "Translate GPU concepts between AMD and NVIDIA terminology. Use when: user asks about AMD using NVIDIA terms (or vice versa), mapping CU to SM, LDS to Shared Memory, XGMI to NVLink, MFMA to Tensor Core, wavefront to warp, HIP to CUDA, ROCm to CUDA Toolkit, MIOpen to cuDNN, RCCL to NCCL, Infinity Cache to L2, OAM to SXM."
argument-hint: "term or concept to translate, e.g. 'what is AMD equivalent of Tensor Core' or 'translate XGMI'"
---

# Terminology Translation

Translates GPU architecture and programming concepts between AMD (ROCm/HIP) and NVIDIA (CUDA) terminology.

## Reference File

Load [`terminology/amd-nvidia.md`](../../terminology/amd-nvidia.md) — it contains complete mapping tables across:

| Section | Covers |
|---------|--------|
| Architecture Concepts | CU/SM, Stream Processor/CUDA Core, MFMA/Tensor Core, Wavefront/Warp, XCD/Compute Die |
| Memory & Storage | LDS/Shared Memory, VGPR/Register File, Infinity Cache/L2, HBM/HBM, Global Memory |
| Interconnect & Multi-GPU | XGMI/NVLink, Infinity Switch/NVSwitch, OAM/SXM, ROCm RDMA/GPUDirect RDMA, RCCL/NCCL |
| Programming Model | HIP/CUDA, hipcc/nvcc, HIP Runtime API/CUDA Runtime API, Wavefront/Warp |
| Software Ecosystem | ROCm/CUDA Toolkit, rocBLAS/cuBLAS, MIOpen/cuDNN, MIGraphX/TensorRT, ROCProfiler/Nsight |
| Key Structural Differences | Wavefront width (64 vs 32), FP64 throughput parity, Infinity Cache vs L2 naming, chiplet design |

## Procedure

1. **Load [`terminology/amd-nvidia.md`](../../terminology/amd-nvidia.md)**.

2. **Find the relevant table section** using the section guide above.

3. **Return the mapping** in this format:
   - AMD term, NVIDIA term, generic concept name, and a one-line description of the difference (if any).

4. **Note important asymmetries** when they exist:
   - Wavefront = 64 work-items vs Warp = 32 threads (2× wider)
   - AMD CDNA FP64 throughput = FP32 throughput (unlike NVIDIA where FP64 = ½ FP32)
   - Infinity Cache ≠ simply "L2" — it's a larger last-level die cache specifically designed to reduce HBM traffic
   - OAM is an open industry standard; SXM is NVIDIA-proprietary

5. If the queried concept has **no direct counterpart**, say so explicitly and explain the closest analog.

## Output Format

For single-term lookups: one-line answer with AMD term ↔ NVIDIA term, followed by a brief description.
For multi-term or conceptual queries: a markdown table with columns Generic | AMD | NVIDIA | Notes.
