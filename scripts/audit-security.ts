import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";
import {
  FORBIDDEN_PUBLIC_PATTERNS,
  FORBIDDEN_PUBLIC_TERMS
} from "../src/constants/guardrails.js";

type Finding = {
  file: string;
  message: string;
};

const repoRoot = process.cwd();
const sourceExtensions = new Set([".ts", ".md", ".json"]);
const runtimeRoots = ["src"];
const publicOutputRoots = ["README.md", "docs", "src/prompts", "src/resources"];
const ignoredDirectories = new Set(["node_modules", "dist", ".git", ".tools"]);
const ignoredFiles = new Set(["PRODUCT_SPEC.md", "scripts/audit-security.ts"]);

const dangerousRuntimePatterns = [
  { label: "command execution module", pattern: /\bchild_process\b|\bnode:child_process\b/ },
  { label: "dynamic code execution", pattern: /\beval\s*\(|\bnew Function\s*\(/ },
  { label: "outbound network request from runtime", pattern: /\bawait\s+fetch\s*\(|\bhttp\.request\s*\(|\bhttps\.request\s*\(/ },
  { label: "filesystem write from runtime", pattern: /\bwriteFile\s*\(|\bappendFile\s*\(|\bcreateWriteStream\s*\(/ },
  { label: "process spawning", pattern: /\bspawn\s*\(|\bexec\s*\(|\bexecFile\s*\(/ }
];

const secretPatterns = [
  { label: "hardcoded API key style token", pattern: /\b(sk-|pk_|ghp_|github_pat_|npm_[A-Za-z0-9])/ },
  { label: "credential assignment", pattern: /\b(password|secret|api[_-]?key|token)\s*[:=]\s*["'][^"']{8,}["']/i },
  { label: "private URL", pattern: /https?:\/\/(localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/i },
  { label: "local Windows path", pattern: /\b[A-Z]:[\\/](Users|Projects|Documents|Downloads|Desktop)[\\/]/i },
  { label: "local project path", pattern: /\b[A-Z]:\\[^\\\r\n]{1,80}\\[^\\\r\n]{1,80}\\Projects\\/i }
];

async function main() {
  const findings: Finding[] = [];

  for (const file of await collectFiles(runtimeRoots)) {
    const text = await readFile(file, "utf8");
    for (const check of dangerousRuntimePatterns) {
      if (check.pattern.test(text)) {
        findings.push({ file: relativePath(file), message: `Runtime contains ${check.label}.` });
      }
    }
  }

  for (const file of await collectFiles(["."])) {
    const text = await readFile(file, "utf8");
    const filePath = relativePath(file);
    for (const check of secretPatterns) {
      if (check.pattern.test(text) && !(check.label === "private URL" && filePath.endsWith(".md"))) {
        findings.push({ file: filePath, message: `Potential secret or private endpoint: ${check.label}.` });
      }
    }
  }

  for (const file of await collectFiles(publicOutputRoots)) {
    const text = await readFile(file, "utf8");
    const lowered = text.toLowerCase();
    for (const term of FORBIDDEN_PUBLIC_TERMS) {
      if (lowered.includes(term.toLowerCase())) {
        findings.push({ file: relativePath(file), message: `Public output file contains forbidden term '${term}'.` });
      }
    }
    for (const pattern of FORBIDDEN_PUBLIC_PATTERNS) {
      if (pattern.test(text)) {
        findings.push({ file: relativePath(file), message: `Public output file matches forbidden private-methodology pattern '${pattern}'.` });
      }
    }
  }

  if (findings.length) {
    console.error("Security audit failed:");
    for (const finding of findings) {
      console.error(`- ${finding.file}: ${finding.message}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Security audit passed.");
}

async function collectFiles(entries: string[]): Promise<string[]> {
  const files: string[] = [];

  for (const entry of entries) {
    const absolute = join(repoRoot, entry);
    files.push(...(await walk(absolute)));
  }

  return [...new Set(files)].filter((file) => sourceExtensions.has(extname(file)) && !ignoredFiles.has(relativePath(file)));
}

async function walk(path: string): Promise<string[]> {
  const statEntries = await readdir(path, { withFileTypes: true }).catch(async () => []);
  if (!statEntries.length && sourceExtensions.has(extname(path))) {
    return [path];
  }

  const files: string[] = [];
  for (const entry of statEntries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const child = join(path, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(child)));
    } else {
      files.push(child);
    }
  }

  return files;
}

function relativePath(file: string): string {
  return relative(repoRoot, file).split(sep).join("/");
}

await main();
