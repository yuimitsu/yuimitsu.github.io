#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const files = {
  ja: path.join(rootDir, 'archive', 'config.ja.json'),
  en: path.join(rootDir, 'archive', 'config.en.json'),
};

function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Failed to read ${path.basename(filePath)}: ${error.message}`);
  }
}

function valueType(value) {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
}

function compareShape(reference, candidate, refLabel, candLabel, currentPath, issues) {
  const refType = valueType(reference);
  const candType = valueType(candidate);

  if (refType !== candType) {
    issues.push(`${currentPath}: type mismatch (${refLabel}=${refType}, ${candLabel}=${candType})`);
    return;
  }

  if (refType === 'object') {
    const refKeys = Object.keys(reference).sort();
    const candKeys = Object.keys(candidate).sort();

    for (const key of refKeys) {
      if (!(key in candidate)) {
        issues.push(`${currentPath}.${key}: missing in ${candLabel}`);
      }
    }

    for (const key of candKeys) {
      if (!(key in reference)) {
        issues.push(`${currentPath}.${key}: extra key in ${candLabel}`);
      }
    }

    for (const key of refKeys) {
      if (key in candidate) {
        compareShape(reference[key], candidate[key], refLabel, candLabel, `${currentPath}.${key}`, issues);
      }
    }
    return;
  }

  if (refType === 'array') {
    if (reference.length !== candidate.length) {
      issues.push(`${currentPath}: array length mismatch (${refLabel}=${reference.length}, ${candLabel}=${candidate.length})`);
    }

    const minLength = Math.min(reference.length, candidate.length);
    for (let i = 0; i < minLength; i += 1) {
      compareShape(reference[i], candidate[i], refLabel, candLabel, `${currentPath}[${i}]`, issues);
    }
  }
}

function main() {
  const ja = readJson(files.ja);
  const en = readJson(files.en);

  const issues = [];
  compareShape(ja, en, 'ja', 'en', '$', issues);
  compareShape(en, ja, 'en', 'ja', '$', issues);

  if (issues.length > 0) {
    console.error('Locale sync check failed.');
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exit(1);
  }

  console.log('Locale sync check passed: archive/config.ja.json and archive/config.en.json have matching structure.');
}

main();
