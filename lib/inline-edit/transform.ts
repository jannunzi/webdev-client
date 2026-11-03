import { uniqueEditable, type EditableNode, type JsxParagraph, type TextLiteral } from "./locate";
import { repoRelativePath } from "./source-hash";

const MARKER = "inline-edit-locators:1";

type Edit = { start: number; end: number; text: string };

/**
 * Compile-time locator pass.
 *
 * Each editable node is hashed from its repo path plus the exact source
 * slice. Line numbers move when an earlier edit lands; the slice does not,
 * until that node itself changes. The stamp is applied only when the node is
 * static (no variables, no `.map()`) and the slice is unique in the file.
 * Duplicates and generated paragraphs are left alone, so they never show a
 * pencil. The attributes exist in the compiled output only — GitHub keeps
 * the original file, and the route recomputes the same hash from it.
 */
export function transformForBuild(source: string, filePath: string): string {
  if (source.includes(MARKER)) return source;
  const file = repoRelativePath(filePath);
  if (!file) return source;
  const nodes = uniqueEditable(source, file);
  if (nodes.length === 0) return source;
  const edits: Edit[] = [];
  for (const node of nodes) {
    if (node.kind === "jsx") edits.push(...jsxEdits(source, file, node));
    else edits.push(literalEdit(source, file, node));
  }
  if (edits.length === 0) return source;
  return addImports(addMarker(applyEdits(source, edits)), nodes);
}

function jsxEdits(source: string, file: string, node: JsxParagraph): Edit[] {
  const edits: Edit[] = [
    {
      start: node.nameEnd,
      end: node.nameEnd,
      text: ` data-src-file="${file}" data-src-hash="${node.hash}" data-edit-kind="jsx"`,
    },
  ];
  node.slots.forEach((slot, index) => {
    if (slot.intrinsic) {
      edits.push({
        start: slot.nameEnd,
        end: slot.nameEnd,
        text: ` data-edit-slot="${index}"`,
      });
      return;
    }
    const original = source.slice(slot.start, slot.end);
    edits.push({
      start: slot.start,
      end: slot.end,
      text: `<span data-edit-slot="${index}" style={{ display: "contents" }}>${original}</span>`,
    });
  });
  return edits;
}

function literalEdit(source: string, file: string, node: TextLiteral): Edit {
  const original = source.slice(node.start, node.end);
  return {
    start: node.start,
    end: node.end,
    text: `inlineEditMark(${original}, ${JSON.stringify(file)}, ${JSON.stringify(node.hash)})`,
  };
}

function applyEdits(source: string, edits: Edit[]): string {
  const ordered = [...edits].sort((a, b) => b.start - a.start || b.end - a.end);
  let next = source;
  for (const edit of ordered) {
    next = next.slice(0, edit.start) + edit.text + next.slice(edit.end);
  }
  return next;
}

function addMarker(source: string): string {
  const line = `/* ${MARKER} */\n`;
  const useClient = /^(["'])use client\1;?[ \t]*\r?\n/;
  const matched = useClient.exec(source);
  if (matched) {
    return source.slice(0, matched[0].length) + line + source.slice(matched[0].length);
  }
  return line + source;
}

function addImports(source: string, nodes: EditableNode[]): string {
  if (!nodes.some((node) => node.kind === "text")) return source;
  const line = `import { inlineEditMark } from "@/lib/inline-edit/mark";\n`;
  if (source.includes(line)) return source;
  const header = /^(?:["']use client["'];?[ \t]*\r?\n)?\/\* inline-edit-locators:1 \*\/\n/;
  const matched = header.exec(source);
  if (matched) {
    return source.slice(0, matched[0].length) + line + source.slice(matched[0].length);
  }
  return line + source;
}
