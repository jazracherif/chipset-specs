#!/usr/bin/env node
/**
 * validate-data.mjs
 *
 * Validates all spec files in the chipset-specs submodule against
 * their JSON Schema definitions. Uses AJV with JSON Schema 2020-12.
 *
 * Usage:
 *   node scripts/validate-data.mjs
 *
 * Exit codes:
 *   0 — all files valid
 *   1 — one or more validation errors found
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SPECS_ROOT = path.join(__dirname, "..", "specs");

// ── Load schema ───────────────────────────────────────────────────────────────

const schemaPath = path.join(SPECS_ROOT, "_schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

// Add the full schema so $ref cross-references resolve correctly
ajv.addSchema(schema, "chipset-specs");

// Compile per-type validators via $ref so $defs are resolved in full context
const validateIndexEntry = ajv.compile({ $ref: "chipset-specs#/$defs/index_entry" });
const validateCpuEntry   = ajv.compile({ $ref: "chipset-specs#/$defs/cpu_entry" });
const validateNvidiaGpu  = ajv.compile({ $ref: "chipset-specs#/$defs/nvidia_gpu_entry" });
const validateAmdGpu     = ajv.compile({ $ref: "chipset-specs#/$defs/amd_gpu_entry" });

// ── Helpers ───────────────────────────────────────────────────────────────────

let errors = 0;
let checked = 0;

function fail(file, context, validationErrors) {
  errors++;
  console.error(`\n✗ ${file}${context ? ` [${context}]` : ""}`);
  for (const e of validationErrors) {
    console.error(`    ${e.instancePath || "/"} — ${e.message}`);
    if (e.params && Object.keys(e.params).length) {
      console.error(`    params: ${JSON.stringify(e.params)}`);
    }
  }
}

function check(validator, data, file, context) {
  checked++;
  const valid = validator(data);
  if (!valid) fail(file, context, validator.errors);
}

function loadYaml(filePath) {
  return yaml.load(fs.readFileSync(filePath, "utf-8"));
}

// ── Validate _index.yaml ──────────────────────────────────────────────────────

console.log("Validating specs/_index.yaml …");
const indexFile = path.join(SPECS_ROOT, "_index.yaml");
const index = loadYaml(indexFile);

for (const entry of index.gpus ?? []) {
  check(validateIndexEntry, entry, "_index.yaml", `gpu: ${entry.name}`);
}
for (const entry of index.cpus ?? []) {
  // CPU index entries use a looser schema (subset of cpu_entry), just check key fields exist
  checked++;
  const missing = ["name", "full_name", "vendor", "generation", "year", "max_cores", "spec_file"]
    .filter((k) => entry[k] === undefined || entry[k] === null);
  if (missing.length) {
    errors++;
    console.error(`\n✗ _index.yaml [cpu: ${entry.name ?? "?"}]`);
    console.error(`    missing required fields: ${missing.join(", ")}`);
  }
}

// ── Validate NVIDIA GPU specs ─────────────────────────────────────────────────

console.log("Validating NVIDIA GPU specs …");
const nvidiaDir = path.join(SPECS_ROOT, "nvidia", "gpus");
for (const file of fs.readdirSync(nvidiaDir).filter((f) => f.endsWith(".yaml"))) {
  const rel = `nvidia/gpus/${file}`;
  const doc = loadYaml(path.join(nvidiaDir, file));
  if (!doc?.gpus) { console.warn(`  skip ${rel} — no 'gpus' key`); continue; }
  for (const [name, entry] of Object.entries(doc.gpus)) {
    check(validateNvidiaGpu, entry, rel, name);
  }
}

// ── Validate AMD GPU specs ────────────────────────────────────────────────────

console.log("Validating AMD GPU specs …");
const amdGpuDir = path.join(SPECS_ROOT, "amd", "gpus");
for (const file of fs.readdirSync(amdGpuDir).filter((f) => f.endsWith(".yaml"))) {
  const rel = `amd/gpus/${file}`;
  const doc = loadYaml(path.join(amdGpuDir, file));
  if (!doc?.gpus) { console.warn(`  skip ${rel} — no 'gpus' key`); continue; }
  for (const [name, entry] of Object.entries(doc.gpus)) {
    check(validateAmdGpu, entry, rel, name);
  }
}

// ── Validate AMD CPU specs ────────────────────────────────────────────────────

console.log("Validating AMD CPU specs …");
const amdCpuDir = path.join(SPECS_ROOT, "amd", "cpus");
for (const file of fs.readdirSync(amdCpuDir).filter((f) => f.endsWith(".yaml"))) {
  const rel = `amd/cpus/${file}`;
  const doc = loadYaml(path.join(amdCpuDir, file));
  if (!doc?.cpus) { console.warn(`  skip ${rel} — no 'cpus' key`); continue; }
  for (const entry of doc.cpus) {
    check(validateCpuEntry, entry, rel, entry.name);
  }
}

// ── Validate Intel CPU specs ──────────────────────────────────────────────────

console.log("Validating Intel CPU specs …");
const intelCpuDir = path.join(SPECS_ROOT, "intel", "cpus");
for (const file of fs.readdirSync(intelCpuDir).filter((f) => f.endsWith(".yaml"))) {
  const rel = `intel/cpus/${file}`;
  const doc = loadYaml(path.join(intelCpuDir, file));
  if (!doc?.cpus) { console.warn(`  skip ${rel} — no 'cpus' key`); continue; }
  for (const entry of doc.cpus) {
    check(validateCpuEntry, entry, rel, entry.name);
  }
}

// ── Validate ARM CPU specs ────────────────────────────────────────────────────

console.log("Validating ARM CPU specs …");
const armCpuDir = path.join(SPECS_ROOT, "arm", "cpus");
if (fs.existsSync(armCpuDir)) {
  for (const file of fs.readdirSync(armCpuDir).filter((f) => f.endsWith(".yaml"))) {
    const rel = `arm/cpus/${file}`;
    const doc = loadYaml(path.join(armCpuDir, file));
    if (!doc?.cpus) { console.warn(`  skip ${rel} — no 'cpus' key`); continue; }
    for (const entry of doc.cpus) {
      check(validateCpuEntry, entry, rel, entry.name);
    }
  }
}

// ── Cross-field consistency checks ───────────────────────────────────────────
//
// These checks verify that derived numeric fields match their derivation formula.
// Findings are printed as WARNINGs — they do not block validation (exit 0).
// A warning means the stored value differs from the derivation by more than the
// allowed tolerance, which may indicate either a stale value or an official
// platform-level figure that differs from the simple formula (e.g. Intel ARK
// max memory bandwidth can be lower than theoretical channel × speed).

let warnings = 0;

function warn(file, context, message) {
  warnings++;
  console.warn(`\n⚠  ${file}${context ? ` [${context}]` : ""}`);
  console.warn(`    ${message}`);
}

/**
 * Return the per-channel GB/s for a DDR speed in MT/s.
 * Uses the standard formula: speed_mts × 8 bytes / 1000 = GB/s per channel.
 */
function channelSpeedGbs(mts) {
  return (mts * 8) / 1000;
}

/**
 * Return the per-lane GB/s for a given PCIe generation string.
 * Values per lane (bidirectional effective bandwidth used in this repo):
 *   PCIe 3.0 → 1 GB/s/lane   PCIe 4.0 → 2 GB/s/lane
 *   PCIe 5.0 → 4 GB/s/lane   PCIe 6.0 → 8 GB/s/lane
 */
function pcieLaneSpeedGbs(revisionStr) {
  const gen = parseFloat(revisionStr);
  const table = { 3.0: 1, 4.0: 2, 5.0: 4, 6.0: 8 };
  return table[gen] ?? null;
}

/**
 * Check derived CPU fields for all CPU YAML files.
 *   1. memory_bandwidth_gbs ≈ memory_channels × channelSpeedGbs(max_memory_speed_mts)
 *   2. pci_max_bw_gbs       = max_pcie_lanes × pcieLaneSpeedGbs(pcie_revision)
 *
 * Tolerance for memory bandwidth: 10% — official platform figures can differ
 * from the simple derivation (e.g. Intel ARK controller-limited bandwidth).
 * Tolerance for PCIe bandwidth: 1% — this is always a direct derivation.
 */
function crossCheckCpuFile(filePath, rel) {
  const doc = loadYaml(filePath);
  if (!doc?.cpus) return;
  for (const entry of doc.cpus) {
    const name = entry.name ?? "?";
    const mem  = entry.memory_specifications ?? {};
    const exp  = entry.expansion_options ?? {};

    // 1. Memory bandwidth check
    if (mem.memory_channels && mem.max_memory_speed_mts && mem.memory_bandwidth_gbs !== null && mem.memory_bandwidth_gbs !== undefined) {
      const derivedBw = mem.memory_channels * channelSpeedGbs(mem.max_memory_speed_mts);
      const storedBw  = mem.memory_bandwidth_gbs;
      const pct = Math.abs(derivedBw - storedBw) / derivedBw;
      if (pct > 0.10) {
        warn(rel, name,
          `memory_bandwidth_gbs: stored=${storedBw} GB/s, ` +
          `derived from ${mem.memory_channels} ch × ${mem.max_memory_speed_mts} MT/s = ` +
          `${derivedBw.toFixed(1)} GB/s (${(pct * 100).toFixed(0)}% diff). ` +
          `Stored value may reflect official platform spec or a different DIMM configuration.`
        );
      }
    }

    // 2. PCIe bandwidth check
    if (exp.max_pcie_lanes && exp.pcie_revision && exp.pci_max_bw_gbs !== null && exp.pci_max_bw_gbs !== undefined) {
      const laneSpeed = pcieLaneSpeedGbs(exp.pcie_revision);
      if (laneSpeed !== null) {
        const derivedPcie = exp.max_pcie_lanes * laneSpeed;
        const storedPcie  = exp.pci_max_bw_gbs;
        const pct = Math.abs(derivedPcie - storedPcie) / derivedPcie;
        if (pct > 0.01) {
          warn(rel, name,
            `pci_max_bw_gbs: stored=${storedPcie} GB/s, ` +
            `derived from ${exp.max_pcie_lanes} lanes × ${laneSpeed} GB/s (PCIe ${exp.pcie_revision}) = ` +
            `${derivedPcie} GB/s (${(pct * 100).toFixed(0)}% diff).`
          );
        }
      }
    }
  }
}

console.log("\nRunning cross-field consistency checks …");
for (const [dir, label] of [
  [path.join(SPECS_ROOT, "amd", "cpus"),   "amd/cpus"],
  [path.join(SPECS_ROOT, "intel", "cpus"), "intel/cpus"],
  [path.join(SPECS_ROOT, "arm", "cpus"),   "arm/cpus"],
]) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".yaml"))) {
    crossCheckCpuFile(path.join(dir, file), `${label}/${file}`);
  }
}
if (warnings === 0) {
  console.log("✓ No cross-field inconsistencies detected.");
} else {
  console.warn(`\n⚠  ${warnings} cross-field warning(s) — review the values above.`);
}

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${checked} entries checked.`);
if (errors === 0) {
  console.log("✓ All entries valid.");
  process.exit(0);
} else {
  console.error(`✗ ${errors} validation error(s) found.`);
  process.exit(1);
}
