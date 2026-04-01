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

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${checked} entries checked.`);
if (errors === 0) {
  console.log("✓ All entries valid.");
  process.exit(0);
} else {
  console.error(`✗ ${errors} validation error(s) found.`);
  process.exit(1);
}
