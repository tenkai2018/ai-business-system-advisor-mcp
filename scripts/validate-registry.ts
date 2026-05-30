import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Ajv, AnySchema } from "ajv";

type PackageJson = {
  name: string;
  version: string;
  private?: boolean;
  mcpName?: string;
  bin?: Record<string, string>;
  files?: string[];
};

type ServerJson = {
  $schema?: string;
  name: string;
  title?: string;
  description: string;
  version: string;
  repository?: {
    url: string;
    source: string;
  };
  packages?: Array<{
    registryType: string;
    identifier: string;
    version?: string;
    transport: {
      type: string;
    };
  }>;
};

const root = process.cwd();
const packageJson = readJson<PackageJson>("package.json");
const serverJson = readJson<ServerJson>("server.json");
const errors: string[] = [];

assert(serverJson.$schema === "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json", "server.json must use the current MCP Registry schema URL.");
assert(packageJson.private !== true, "package.json private must not be true for npm publish.");
assert(packageJson.mcpName === serverJson.name, "package.json mcpName must match server.json name.");
assert(packageJson.version === serverJson.version, "package.json version must match server.json version.");
assert(/^[-a-zA-Z0-9.]+\/[-a-zA-Z0-9._]+$/.test(serverJson.name), "server.json name must be reverse-DNS namespace plus server id.");
assert(serverJson.description.length > 0 && serverJson.description.length <= 100, "server.json description must be 1-100 characters.");
assert(serverJson.repository?.url.startsWith("https://"), "server.json repository.url must be an HTTPS URL.");
assert(serverJson.repository?.source === "github", "server.json repository.source should be github for this publish flow.");

const npmPackage = serverJson.packages?.find((item) => item.registryType === "npm");
assert(Boolean(npmPackage), "server.json must include an npm package entry.");
assert(npmPackage?.identifier === packageJson.name, "server.json npm identifier must match package.json name.");
assert(npmPackage?.version === packageJson.version, "server.json npm package version must match package.json version.");
assert(npmPackage?.transport.type === "stdio", "server.json npm package transport must be stdio.");

const binPath = packageJson.bin?.[packageJson.name];
assert(Boolean(binPath), "package.json must expose a bin matching the package name.");
if (binPath) {
  assert(existsSync(resolve(root, binPath)), `package bin target does not exist: ${binPath}. Run npm run build first.`);
}

assert(packageJson.files?.includes("dist/src"), "package.json files should include dist/src.");
assert(packageJson.files?.includes("server.json"), "package.json files should include server.json.");

if (!errors.length) {
  await validateAgainstOfficialSchema(serverJson);
}

if (errors.length) {
  console.error("Registry validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Registry validation passed.");

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(resolve(root, path), "utf8")) as T;
}

function assert(condition: unknown, message: string): void {
  if (!condition) {
    errors.push(message);
  }
}

async function validateAgainstOfficialSchema(server: ServerJson): Promise<void> {
  if (!server.$schema) {
    errors.push("server.json is missing $schema.");
    return;
  }

  try {
    const response = await fetch(server.$schema);
    if (!response.ok) {
      errors.push(`Could not fetch MCP Registry schema: ${response.status} ${response.statusText}`);
      return;
    }

    const schema = (await response.json()) as AnySchema;
    const ajv = new Ajv({ strict: false, validateFormats: false });
    const validate = ajv.compile(schema);
    const valid = validate(server);

    if (!valid) {
      for (const error of validate.errors ?? []) {
        errors.push(`server.json schema error at ${error.instancePath || "/"}: ${error.message}`);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push(`Could not validate server.json against official schema: ${message}`);
  }
}
