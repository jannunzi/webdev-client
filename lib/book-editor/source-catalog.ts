import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

export type TableCell = { text: string } | { component: string };

export type Supplement =
  | { id: string; kind: "slides"; sectionId: string }
  | { id: string; kind: "videos"; sectionId: string }
  | { id: string; kind: "practice"; sectionId: string; quizId: string }
  | { id: string; kind: "async-demo"; sectionId: string; component: "AssignmentsStep" | "AssignmentsFinished" }
  | { id: string; kind: "table"; sectionId: string; rows: TableCell[][]; lines: string[] };

const ENTRIES: { file: string; names: string[] }[] = [
  { file: "app/book/ch1/sections/IntroAndSetup.tsx", names: ["IntroAndSetup"] },
  { file: "app/book/ch1/sections/HtmlSections.tsx", names: ["HtmlSections"] },
  { file: "app/book/ch1/sections/CheckUnderstanding.tsx", names: ["CheckUnderstanding"] },
  { file: "app/book/ch1/sections/KambazSections.tsx", names: ["KambazSections"] },
  { file: "app/book/ch1/sections/ClosingSections.tsx", names: ["ClosingSections", "Chapter1Conclusion"] },
  { file: "app/book/ch1/sections/EngineeringWithAI.tsx", names: ["EngineeringWithAI"] },
];

/**
 * Source-only Chapter 1 blocks the saved editor document cannot round-trip.
 * Read from the chapter files. Nothing is written back to the draft.
 */
export function chapter1Supplements(root = process.cwd()): Supplement[] {
  const items: Supplement[] = [];
  for (const entry of ENTRIES) {
    const full = path.join(/*turbopackIgnore: true*/ root, entry.file);
    const source = fs.readFileSync(full, "utf8");
    const sf = ts.createSourceFile(entry.file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    for (const name of entry.names) {
      const fn = findFunction(sf, name);
      const returned = fn ? findReturnedJsx(fn) : null;
      if (returned) visit(returned, [], items);
    }
  }
  return items;
}

function findFunction(sf: ts.SourceFile, name: string): ts.FunctionLikeDeclaration | null {
  for (const statement of sf.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name?.text === name) return statement;
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === name &&
        declaration.initializer &&
        (ts.isArrowFunction(declaration.initializer) || ts.isFunctionExpression(declaration.initializer))
      ) {
        return declaration.initializer;
      }
    }
  }
  return null;
}

function visit(node: ts.Node, sectionStack: string[], items: Supplement[]) {
  if (ts.isJsxFragment(node)) {
    for (const child of node.children) visit(child, sectionStack, items);
    return;
  }
  if (ts.isJsxExpression(node)) {
    if (node.expression) visit(node.expression, sectionStack, items);
    return;
  }
  if (!ts.isJsxElement(node) && !ts.isJsxSelfClosingElement(node)) {
    ts.forEachChild(node, (child) => visit(child, sectionStack, items));
    return;
  }
  const tag = tagName(node);
  const id = attr(node, "id");
  const nextStack = id ? [...sectionStack, id] : sectionStack;
  const sectionId = nextStack[nextStack.length - 1] ?? "";
  if (tag === "BookSectionSlidesLink" || tag === "BookSectionVideosLink") {
    const target = attr(node, "sectionId");
    if (target) {
      items.push({
        id: `${tag}:${target}:${items.length}`,
        kind: tag === "BookSectionSlidesLink" ? "slides" : "videos",
        sectionId: target,
      });
    }
  } else if (tag === "PracticeCard") {
    const quizId = attr(node, "quizId");
    if (quizId) items.push({ id: `practice:${quizId}:${items.length}`, kind: "practice", sectionId, quizId });
  } else if (tag === "AssignmentsStep" || tag === "AssignmentsFinished") {
    items.push({ id: `async:${tag}:${items.length}`, kind: "async-demo", sectionId, component: tag });
  } else if (tag === "table" && ts.isJsxElement(node) && !insideTable(sectionStack)) {
    const rows = tableRows(node);
    const lines = rows
      .map((row) => row.map(cellText).filter(Boolean))
      .filter((row) => row.length > 0)
      .map((row) => row.join(" | "));
    if (rows.length) {
      items.push({
        id: `table:${sectionId}:${items.length}`,
        kind: "table",
        sectionId,
        rows,
        lines,
      });
    }
  }
  if (ts.isJsxElement(node)) {
    const childStack = tag === "table" ? [...nextStack, "__table__"] : nextStack;
    for (const child of node.children) visit(child, childStack, items);
  }
}

function insideTable(stack: string[]): boolean {
  return stack.includes("__table__");
}

function tableRows(table: ts.JsxElement): TableCell[][] {
  const rows: TableCell[][] = [];
  const visitRow = (node: ts.Node) => {
    const element = asElement(node);
    if (element && tagName(element) === "tr" && ts.isJsxElement(element)) {
      const cells = element.children.map(cellValue).filter((cell): cell is TableCell => cell !== null);
      if (cells.length) rows.push(cells);
      return;
    }
    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      for (const child of node.children) visitRow(child);
    } else if (ts.isJsxExpression(node) && node.expression) {
      visitRow(node.expression);
    }
  };
  for (const child of table.children) visitRow(child);
  return rows;
}

function cellValue(node: ts.Node): TableCell | null {
  const element = asElement(node);
  if (!element) return null;
  const tag = tagName(element);
  if (tag && tag[0] === tag[0].toUpperCase()) return { component: tag };
  const text = plainText(element).replace(/\s+/g, " ").trim();
  if (!text) {
    const component = componentTag(element);
    return component ? { component } : null;
  }
  return { text };
}

function componentTag(node: ts.Node): string | null {
  if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
    const tag = tagName(node);
    if (tag && tag[0] === tag[0].toUpperCase()) return tag;
    if (ts.isJsxElement(node)) {
      for (const child of node.children) {
        const found = componentTag(child);
        if (found) return found;
      }
    }
  }
  if (ts.isJsxFragment(node)) {
    for (const child of node.children) {
      const found = componentTag(child);
      if (found) return found;
    }
  }
  if (ts.isJsxExpression(node) && node.expression) return componentTag(node.expression);
  return null;
}

function cellText(cell: TableCell): string {
  return "text" in cell ? cell.text : "";
}

function findReturnedJsx(fn: ts.FunctionLikeDeclaration): ts.Node | null {
  const body = fn.body;
  if (!body) return null;
  if (!ts.isBlock(body)) return ts.isJsxElement(body) || ts.isJsxFragment(body) || ts.isJsxSelfClosingElement(body) ? body : null;
  let found: ts.Node | null = null;
  const walk = (node: ts.Node) => {
    if (found) return;
    if (ts.isReturnStatement(node) && node.expression) {
      const expr = unwrap(node.expression);
      if (ts.isJsxElement(expr) || ts.isJsxFragment(expr) || ts.isJsxSelfClosingElement(expr)) found = expr;
    }
    ts.forEachChild(node, walk);
  };
  walk(body);
  return found;
}

function unwrap(node: ts.Expression): ts.Node {
  let current: ts.Node = node;
  while (ts.isParenthesizedExpression(current)) current = current.expression;
  return current;
}

function asElement(node: ts.Node): ts.JsxElement | ts.JsxSelfClosingElement | null {
  if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) return node;
  if (ts.isParenthesizedExpression(node)) return asElement(node.expression);
  if (ts.isJsxExpression(node) && node.expression) return asElement(node.expression);
  return null;
}

function tagName(node: ts.JsxElement | ts.JsxSelfClosingElement): string | null {
  const name = ts.isJsxElement(node) ? node.openingElement.tagName : node.tagName;
  return ts.isIdentifier(name) ? name.text : null;
}

function attr(node: ts.JsxElement | ts.JsxSelfClosingElement, key: string): string | null {
  const attrs = ts.isJsxElement(node) ? node.openingElement.attributes : node.attributes;
  for (const item of attrs.properties) {
    if (!ts.isJsxAttribute(item) || item.name.getText() !== key) continue;
    if (!item.initializer) return "true";
    if (ts.isStringLiteral(item.initializer)) return item.initializer.text;
    if (
      ts.isJsxExpression(item.initializer) &&
      item.initializer.expression &&
      (ts.isStringLiteral(item.initializer.expression) || ts.isNoSubstitutionTemplateLiteral(item.initializer.expression))
    ) {
      return item.initializer.expression.text;
    }
  }
  return null;
}

function plainText(node: ts.Node): string {
  if (ts.isJsxText(node)) return decode(node.getText());
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isJsxExpression(node) && node.expression) return plainText(node.expression);
  if (ts.isJsxElement(node) || ts.isJsxFragment(node)) return node.children.map(plainText).join("");
  if (ts.isJsxSelfClosingElement(node)) return "";
  return "";
}

function decode(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}
