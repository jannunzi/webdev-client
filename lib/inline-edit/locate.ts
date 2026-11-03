import ts from "typescript";
import { repoRelativePath, sourceHash } from "./source-hash";

export type SlotSpan = {
  start: number;
  end: number;
  intrinsic: boolean;
  /** End of the opening tag name, where `data-edit-slot` is inserted. */
  nameEnd: number;
};

export type JsxParagraph = {
  kind: "jsx";
  hash: string;
  start: number;
  end: number;
  nameEnd: number;
  openEnd: number;
  /** Null when the paragraph is self-closing. */
  closeStart: number | null;
  slots: SlotSpan[];
};

export type TextLiteral = {
  kind: "text";
  hash: string;
  start: number;
  end: number;
};

export type EditableNode = JsxParagraph | TextLiteral;

const FORMAT_TAGS = new Set(["strong", "em", "b", "i"]);

export function listEditable(source: string, file: string): EditableNode[] {
  const relative = repoRelativePath(file);
  if (!relative) return [];
  const kind = relative.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(
    relative,
    source,
    ts.ScriptTarget.Latest,
    true,
    kind,
  );
  const found: EditableNode[] = [];
  const visit = (node: ts.Node) => {
    if (relative.endsWith(".tsx")) {
      const paragraph = paragraphFrom(node, sourceFile, relative, source);
      if (paragraph) found.push(paragraph);
    } else {
      const literal = literalFrom(node, sourceFile, relative, source);
      if (literal) found.push(literal);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return found;
}

export function uniqueEditable(
  source: string,
  file: string,
): EditableNode[] {
  const nodes = listEditable(source, file);
  const counts = new Map<string, number>();
  for (const node of nodes) {
    counts.set(node.hash, (counts.get(node.hash) ?? 0) + 1);
  }
  return nodes.filter((node) => counts.get(node.hash) === 1);
}

export function findEditable(
  source: string,
  file: string,
  hash: string,
): { ok: true; node: EditableNode } | { ok: false; error: string } {
  const matches = listEditable(source, file).filter((node) => node.hash === hash);
  if (matches.length === 1) return { ok: true, node: matches[0]! };
  if (matches.length > 1) {
    return {
      ok: false,
      error:
        "That text appears more than once in the file, so it isn't safe to replace.",
    };
  }
  return {
    ok: false,
    error:
      "The original text wasn't found. It may be generated from variables or arrays, or the file changed after this page was built.",
  };
}

function paragraphFrom(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  file: string,
  source: string,
): JsxParagraph | null {
  if (!ts.isJsxElement(node) && !ts.isJsxSelfClosingElement(node)) return null;
  if (jsxTag(node) !== "p") return null;
  const classified = classifyParagraph(node, sourceFile);
  if (!classified) return null;
  const start = node.getStart(sourceFile);
  const end = node.end;
  return {
    kind: "jsx",
    hash: sourceHash(file, source.slice(start, end)),
    start,
    end,
    nameEnd: classified.nameEnd,
    openEnd: classified.openEnd,
    closeStart: classified.closeStart,
    slots: classified.slots,
  };
}

function literalFrom(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  file: string,
  source: string,
): TextLiteral | null {
  if (!isEditableTextLiteral(node)) return null;
  const start = node.getStart(sourceFile);
  const end = node.end;
  return {
    kind: "text",
    hash: sourceHash(file, source.slice(start, end)),
    start,
    end,
  };
}

function classifyParagraph(
  node: ts.JsxElement | ts.JsxSelfClosingElement,
  sourceFile: ts.SourceFile,
): {
  nameEnd: number;
  openEnd: number;
  closeStart: number | null;
  slots: SlotSpan[];
} | null {
  const opening = ts.isJsxElement(node) ? node.openingElement : node;
  if (!ts.isIdentifier(opening.tagName)) return null;
  const nameEnd = opening.tagName.end;
  if (ts.isJsxSelfClosingElement(node)) {
    return { nameEnd, openEnd: node.end, closeStart: null, slots: [] };
  }
  const flat = flattenChildren(node.children);
  if (!flat) return null;
  const slots: SlotSpan[] = [];
  for (const child of flat) {
    if (ts.isJsxText(child)) continue;
    if (ts.isJsxExpression(child)) {
      if (!child.expression || isStaticStringExpr(child.expression)) continue;
      return null;
    }
    if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)) {
      if (isPureFormat(child)) continue;
      const span = slotSpan(child, sourceFile);
      if (!span) return null;
      slots.push(span);
      continue;
    }
    return null;
  }
  return {
    nameEnd,
    openEnd: opening.end,
    closeStart: node.closingElement.getStart(sourceFile),
    slots,
  };
}

function flattenChildren(children: readonly ts.JsxChild[]): ts.JsxChild[] | null {
  const out: ts.JsxChild[] = [];
  for (const child of children) {
    if (ts.isJsxFragment(child)) {
      const inner = flattenChildren(child.children);
      if (!inner) return null;
      out.push(...inner);
      continue;
    }
    out.push(child);
  }
  return out;
}

function isPureFormat(node: ts.JsxElement | ts.JsxSelfClosingElement): boolean {
  const tag = jsxTag(node);
  if (!tag || !FORMAT_TAGS.has(tag)) return false;
  if (ts.isJsxSelfClosingElement(node)) return true;
  for (const child of node.children) {
    if (ts.isJsxText(child)) continue;
    if (ts.isJsxExpression(child)) {
      if (!child.expression || isStaticStringExpr(child.expression)) continue;
      return false;
    }
    if (
      (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)) &&
      isPureFormat(child)
    ) {
      continue;
    }
    return false;
  }
  return true;
}

function slotSpan(
  node: ts.JsxElement | ts.JsxSelfClosingElement,
  sourceFile: ts.SourceFile,
): SlotSpan | null {
  const opening = ts.isJsxElement(node) ? node.openingElement : node;
  const tag = opening.tagName;
  const intrinsic = ts.isIdentifier(tag) && tag.text[0] === tag.text[0]?.toLowerCase();
  return {
    start: node.getStart(sourceFile),
    end: node.end,
    intrinsic,
    nameEnd: tag.end,
  };
}

function jsxTag(node: ts.Node): string | null {
  const opening = ts.isJsxElement(node)
    ? node.openingElement
    : ts.isJsxSelfClosingElement(node)
      ? node
      : null;
  if (!opening || !ts.isIdentifier(opening.tagName)) return null;
  return opening.tagName.text;
}

function isStaticStringExpr(expr: ts.Expression): boolean {
  let current = expr;
  while (
    ts.isParenthesizedExpression(current) ||
    ts.isAsExpression(current) ||
    ts.isSatisfiesExpression(current)
  ) {
    current = current.expression;
  }
  return ts.isStringLiteral(current) || ts.isNoSubstitutionTemplateLiteral(current);
}

function isEditableTextLiteral(node: ts.Node): boolean {
  if (!ts.isStringLiteral(node) && !ts.isNoSubstitutionTemplateLiteral(node)) {
    return false;
  }
  const parent = node.parent;
  if (!parent) return false;
  if (ts.isPropertyAssignment(parent) && parent.initializer === node) {
    const name = propertyName(parent.name);
    return name === "title" || name === "interactiveHint" || name === "imageCaption";
  }
  if (ts.isArrayLiteralExpression(parent)) {
    const arrayParent = parent.parent;
    if (
      arrayParent &&
      ts.isPropertyAssignment(arrayParent) &&
      arrayParent.initializer === parent
    ) {
      const name = propertyName(arrayParent.name);
      return name === "bullets" || name === "items";
    }
  }
  return false;
}

function propertyName(name: ts.PropertyName): string | null {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name)) {
    return name.text;
  }
  return null;
}
