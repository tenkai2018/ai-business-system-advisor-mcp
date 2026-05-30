import { z } from "zod";

export function parseWithSchema<T>(schema: z.ZodType<T>, input: unknown): T {
  return schema.parse(input);
}

export function toSearchText(input: unknown): string {
  if (typeof input === "string") {
    return input;
  }

  if (!input || typeof input !== "object") {
    return "";
  }

  return Object.values(input)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter((value): value is string | number | boolean => ["string", "number", "boolean"].includes(typeof value))
    .join(" ");
}
