import { createHash } from "node:crypto";

/** Stable id for one source slice. Identical slices in the same file share a hash. */
export function sourceHash(file: string, slice: string): string {
  return createHash("sha256")
    .update(file)
    .update("\0")
    .update(slice)
    .digest("hex")
    .slice(0, 24);
}

export const SOURCE_HASH_RE = /^[a-f0-9]{24}$/;

/**
 * Project-relative path the loader and the GitHub route both use.
 * Only book prose and lecture deck modules are editable.
 */
export function repoRelativePath(
  filePath: string,
  cwd: string = process.cwd(),
): string | null {
  const norm = filePath.replaceAll("\\", "/");
  const root = cwd.replaceAll("\\", "/").replace(/\/$/, "");
  let rel = norm;
  if (norm === root) return null;
  if (norm.startsWith(`${root}/`)) rel = norm.slice(root.length + 1);
  if (rel.startsWith("./")) rel = rel.slice(2);
  if (rel.includes("..") || rel.includes("\0")) return null;
  if (rel.includes(".test.")) return null;
  if (rel.startsWith("app/book/") && rel.endsWith(".tsx")) return rel;
  if (
    rel.startsWith("lib/lectures/decks/") &&
    rel.endsWith(".ts") &&
    !rel.endsWith(".tsx")
  ) {
    return rel;
  }
  return null;
}

export function isAllowedEditFile(file: string): boolean {
  return repoRelativePath(file) === file;
}
