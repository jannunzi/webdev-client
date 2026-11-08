import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import {
  A1_LAB_EXERCISE_SECTIONS,
  labExerciseKindLabel,
} from "@/lib/assignments/a1-lab-exercises";
import { ch1EndMatter } from "@/app/book/ch1/end-matter";
import { getTerm } from "@/app/book/terms/termRegistry";
import { termPageHref, termSlug, titleFromSlug } from "@/app/book/terms/termSlug";
import type { JSONContent } from "@tiptap/core";

export type MigrationNote = {
  name: string;
  count: number;
  reason: string;
};

export type ChapterInventory = {
  headings: number;
  paragraphs: number;
  lists: number;
  links: number;
  codeBlocks: number;
  embeds: number;
  figures: number;
  unsupported: MigrationNote[];
  omittedChrome: MigrationNote[];
  embedComponents: MigrationNote[];
};

export type ExtractedEmbed = {
  component: string;
  modulePath: string;
  exportName: string;
};

export type ExtractedChapter = {
  doc: JSONContent;
  inventory: ChapterInventory;
  embeds: ExtractedEmbed[];
};

const ROOT = process.cwd();

const ENTRIES: { file: string; name: string }[] = [
  { file: "app/book/ch1/sections/IntroAndSetup.tsx", name: "IntroAndSetup" },
  { file: "app/book/ch1/sections/HtmlSections.tsx", name: "HtmlSections" },
  { file: "app/book/ch1/sections/CheckUnderstanding.tsx", name: "CheckUnderstanding" },
  { file: "app/book/ch1/sections/KambazSections.tsx", name: "KambazSections" },
  { file: "app/book/ch1/sections/ClosingSections.tsx", name: "ClosingSections" },
  { file: "app/book/ch1/sections/EngineeringWithAI.tsx", name: "EngineeringWithAI" },
  { file: "app/book/ch1/sections/ClosingSections.tsx", name: "Chapter1Conclusion" },
];

const CHROME = new Set(["BookSectionSlidesLink", "BookSectionVideosLink"]);

type Mark = { type: string; attrs?: Record<string, unknown> };
type ImportRef = { spec: string; exportName: string; resolved: string | null };

export function extractChapter1(root = ROOT): ExtractedChapter {
  const notes = new Map<string, MigrationNote>();
  const chrome = new Map<string, MigrationNote>();
  const embedCounts = new Map<string, number>();
  const embeds = new Map<string, ExtractedEmbed>();
  const content: JSONContent[] = [];

  for (const entry of ENTRIES) {
    content.push(
      ...extractFunction(path.join(root, entry.file), entry.name, {
        notes,
        chrome,
        embedCounts,
        embeds,
        root,
      }),
    );
  }
  content.push(...endMatterNodes());

  const doc: JSONContent = { type: "doc", content: content.filter(hasBody) };
  return {
    doc,
    embeds: [...embeds.values()],
    inventory: {
      headings: count(doc, "heading"),
      paragraphs: count(doc, "paragraph"),
      lists: count(doc, "bulletList") + count(doc, "orderedList"),
      links: countMarks(doc, "link"),
      codeBlocks: count(doc, "codeBlock"),
      embeds: count(doc, "bookEmbed"),
      figures: count(doc, "bookFigure"),
      unsupported: [...notes.values()],
      omittedChrome: [...chrome.values()],
      embedComponents: [...embedCounts.entries()].map(([name, n]) => ({
        name,
        count: n,
        reason: embeds.get(name)?.modulePath ?? "rendered from the registered component",
      })),
    },
  };
}

function count(node: JSONContent, type: string): number {
  let total = node.type === type ? 1 : 0;
  for (const child of node.content ?? []) total += count(child, type);
  return total;
}

function countMarks(node: JSONContent, type: string): number {
  let total = (node.marks ?? []).filter((mark) => mark.type === type).length;
  for (const child of node.content ?? []) total += countMarks(child, type);
  return total;
}

function hasBody(node: JSONContent): boolean {
  if (node.type === "text") return Boolean(node.text);
  if (node.type === "paragraph" || node.type === "heading") {
    return (node.content ?? []).some(hasBody);
  }
  return true;
}

type Ctx = {
  notes: Map<string, MigrationNote>;
  chrome: Map<string, MigrationNote>;
  embedCounts: Map<string, number>;
  embeds: Map<string, ExtractedEmbed>;
  root: string;
};

function note(map: Map<string, MigrationNote>, name: string, reason: string) {
  const current = map.get(name);
  if (current) current.count += 1;
  else map.set(name, { name, count: 1, reason });
}

function extractFunction(file: string, name: string, ctx: Ctx): JSONContent[] {
  const source = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const imports = importMap(sf, file, ctx.root);
  const fn = findFunction(sf, name);
  if (!fn) {
    note(ctx.notes, name, "The section function was not found.");
    return [unsupported(name, "The section function was not found.")];
  }
  const returned = findReturnedJsx(fn);
  if (!returned) {
    note(ctx.notes, name, "The section does not return JSX.");
    return [unsupported(name, "The section does not return JSX.")];
  }
  return visitBlocks(returned, { ...ctx, file, imports });
}

type Visit = Ctx & { file: string; imports: Map<string, ImportRef> };

function visitBlocks(node: ts.Node, ctx: Visit): JSONContent[] {
  if (ts.isJsxFragment(node)) return node.children.flatMap((child) => visitBlocks(child, ctx));
  if (ts.isJsxText(node)) return [];
  if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
    return elementToBlocks(node, ctx);
  }
  if (ts.isParenthesizedExpression(node)) return visitBlocks(node.expression, ctx);
  if (ts.isJsxExpression(node) && node.expression) return visitBlocks(node.expression, ctx);
  return [];
}

function elementToBlocks(
  node: ts.JsxElement | ts.JsxSelfClosingElement,
  ctx: Visit,
): JSONContent[] {
  const tag = tagName(node);
  if (!tag) return [];
  if (CHROME.has(tag)) {
    note(ctx.chrome, tag, "Section navigation stays on the published chapter.");
    return [];
  }
  if (tag === "Section") return sectionBlocks(node, ctx);
  if (tag === "LiveDemo") return liveDemoBlocks(node, ctx);
  if (tag === "CodeBlock") return codeBlocks(node, ctx);
  if (tag === "BookFigure") return figureBlocks(node, ctx);
  if (tag === "OnYourOwn" || tag === "WithAI") return calloutBlocks(node, tag, ctx);
  if (tag === "A1LabExerciseList") return a1List();
  if (tag === "PracticeCard") {
    note(ctx.notes, "PracticeCard", "The practice quiz stays on the published chapter.");
    return [unsupported("PracticeCard", "The practice quiz stays on the published chapter.")];
  }
  if (tag === "p") return [paragraphNode(inlineOf(children(node), ctx))];
  if (/^h[1-6]$/.test(tag)) {
    return [headingNode(Number(tag[1]), attr(node, "id"), inlineOf(children(node), ctx))];
  }
  if (tag === "ul" || tag === "ol") return [listNode(tag === "ol", children(node), ctx)];
  if (tag === "li") return listItemBlocks(node, ctx);
  if (tag === "blockquote") {
    return [{ type: "blockquote", content: flow(children(node), ctx) }];
  }
  if (tag === "pre") return codeBlocks(node, ctx);
  if (tag === "table") return flattenedTable(node, ctx);
  if (tag === "header" || tag === "section" || tag === "div" || tag === "figure" || tag === "main" || tag === "article") {
    const id = attr(node, "id");
    const inner = flow(children(node), ctx);
    if (id) {
      const heading = inner.find((block) => block.type === "heading" && block.attrs && !block.attrs.id);
      if (heading?.attrs) heading.attrs.id = id;
    }
    return inner;
  }
  if (isProseComponent(tag)) return [paragraphNode(inlineOf([node], ctx))];
  if (isComponentTag(tag)) return componentBlocks(node, tag, ctx);
  note(ctx.notes, tag, "This HTML element is kept as a named placeholder.");
  return [unsupported(tag, "This HTML element is kept as a named placeholder.")];
}

function sectionBlocks(node: ts.JsxElement | ts.JsxSelfClosingElement, ctx: Visit): JSONContent[] {
  const level = attr(node, "level") === "3" ? 3 : 2;
  const title = attr(node, "title") ?? "";
  const id = attr(node, "id");
  const blocks: JSONContent[] = [];
  if (title) blocks.push(headingNode(level, id, [{ type: "text", text: decode(title) }]));
  if (ts.isJsxElement(node)) blocks.push(...flow(children(node), ctx));
  return blocks;
}

function liveDemoBlocks(node: ts.JsxElement | ts.JsxSelfClosingElement, ctx: Visit): JSONContent[] {
  const kids = ts.isJsxElement(node) ? elementChildren(node) : [];
  const only = kids.length === 1 ? kids[0] : null;
  const onlyTag = only ? tagName(only) : null;
  if (only && onlyTag && isComponentTag(onlyTag) && !isProseComponent(onlyTag)) {
    return componentBlocks(only, onlyTag, ctx, {
      name: attr(node, "name") ?? onlyTag,
      file: attr(node, "file") ?? "",
    });
  }
  const caption = attr(node, "title") ?? attr(node, "name");
  const blocks: JSONContent[] = [];
  if (caption) blocks.push(paragraphNode([{ type: "text", text: caption }]));
  if (ts.isJsxElement(node)) blocks.push(...flow(children(node), ctx));
  return blocks;
}

function componentBlocks(
  node: ts.JsxElement | ts.JsxSelfClosingElement,
  tag: string,
  ctx: Visit,
  demo?: { name: string; file: string },
): JSONContent[] {
  if (tag === "A1LabExerciseIntroLink") {
    return [
      paragraphNode([
        {
          type: "text",
          text: "A1 Lab checklist",
          marks: [{ type: "link", attrs: { href: "/assignments/a1" } }],
        },
      ]),
    ];
  }
  const imported = ctx.imports.get(tag);
  const serverKind = imported?.resolved ? serverComponentKind(imported.resolved) : null;
  if (!imported?.resolved || serverKind) {
    const reason = !imported?.resolved
      ? "This component is local to the chapter file and is not a registered demo."
      : serverKind === "async"
        ? "This demo is an async server page. The pilot leaves a placeholder instead of calling it."
        : "This component uses server-only code, so the pilot keeps a placeholder.";
    note(ctx.notes, tag, reason);
    return [unsupported(tag, reason)];
  }
  const previous = ctx.embeds.get(tag);
  if (previous && previous.modulePath !== imported.spec) {
    note(ctx.notes, tag, "The same component name points at two modules.");
    return [unsupported(tag, "The same component name points at two modules.")];
  }
  ctx.embeds.set(tag, {
    component: tag,
    modulePath: imported.spec.startsWith("@/") ? imported.spec : toAlias(imported.resolved, ctx.root),
    exportName: imported.exportName,
  });
  ctx.embedCounts.set(tag, (ctx.embedCounts.get(tag) ?? 0) + 1);
  return [
    {
      type: "bookEmbed",
      attrs: {
        component: tag,
        name: demo?.name || attr(node, "name") || tag,
        file: demo?.file || attr(node, "file") || "",
      },
    },
  ];
}

function codeBlocks(node: ts.JsxElement | ts.JsxSelfClosingElement, ctx: Visit): JSONContent[] {
  const language = attr(node, "language") ?? "text";
  const file = attr(node, "file") ?? "";
  const name = attr(node, "name") ?? "";
  const raw = codeText(node);
  const blocks: JSONContent[] = [];
  const label = [file, name].filter(Boolean).join(" — ");
  if (label) blocks.push(paragraphNode([{ type: "text", text: label, marks: [{ type: "code" }] }]));
  const code: JSONContent = {
    type: "codeBlock",
    attrs: { language },
    content: raw ? [{ type: "text", text: raw }] : [],
  };
  if (!raw) note(ctx.notes, "CodeBlock", "A code block had no static text.");
  blocks.push(code);
  return blocks;
}

function figureBlocks(node: ts.JsxElement | ts.JsxSelfClosingElement, ctx: Visit): JSONContent[] {
  const sources = figureSources(node);
  if (sources.length === 0) {
    note(ctx.notes, "BookFigure", "A figure was missing a site image path.");
    return [unsupported("BookFigure", "A figure was missing a site image path.")];
  }
  return sources.map((source) => ({ type: "bookFigure", attrs: source }));
}

function figureSources(
  node: ts.JsxElement | ts.JsxSelfClosingElement,
): { id: string; src: string; alt: string; caption: string }[] {
  const direct = attr(node, "src");
  if (direct?.startsWith("/")) {
    return [
      {
        id: attr(node, "id") ?? "",
        src: direct,
        alt: attr(node, "alt") ?? "",
        caption: attr(node, "caption") ?? "",
      },
    ];
  }
  const attrs = ts.isJsxElement(node) ? node.openingElement.attributes : node.attributes;
  for (const item of attrs.properties) {
    if (!ts.isJsxAttribute(item) || item.name.getText() !== "sources") continue;
    const expr = item.initializer && ts.isJsxExpression(item.initializer) ? item.initializer.expression : null;
    if (!expr || !ts.isArrayLiteralExpression(expr)) return [];
    const sources: { id: string; src: string; alt: string; caption: string }[] = [];
    for (const entry of expr.elements) {
      if (!ts.isObjectLiteralExpression(entry)) continue;
      const read = (key: string) => {
        const prop = entry.properties.find(
          (candidate) => ts.isPropertyAssignment(candidate) && candidate.name.getText() === key,
        );
        if (!prop || !ts.isPropertyAssignment(prop)) return "";
        return ts.isStringLiteral(prop.initializer) ? prop.initializer.text : "";
      };
      const src = read("src");
      if (!src.startsWith("/")) continue;
      sources.push({ id: read("id"), src, alt: read("alt"), caption: read("caption") });
    }
    return sources;
  }
  return [];
}

function calloutBlocks(
  node: ts.JsxElement | ts.JsxSelfClosingElement,
  tag: string,
  ctx: Visit,
): JSONContent[] {
  const title = tag === "OnYourOwn" ? "On your own" : "With AI";
  const inner = ts.isJsxElement(node) ? flow(children(node), ctx) : [];
  const prompt = attr(node, "prompt");
  if (prompt) inner.push(paragraphNode([{ type: "text", text: prompt }]));
  return [{ type: "blockquote", content: [paragraphNode([{ type: "text", text: title, marks: [{ type: "bold" }] }]), ...inner] }];
}

function listNode(ordered: boolean, kids: readonly ts.Node[], ctx: Visit): JSONContent {
  const items = kids.filter((kid) => tagName(asElement(kid)) === "li");
  return {
    type: ordered ? "orderedList" : "bulletList",
    content: items.map((item) => ({
      type: "listItem",
      content: listItemContent(item, ctx),
    })),
  };
}

function listItemBlocks(node: ts.JsxElement | ts.JsxSelfClosingElement, ctx: Visit): JSONContent[] {
  return [{ type: "listItem", content: listItemContent(node, ctx) }];
}

function listItemContent(node: ts.Node, ctx: Visit): JSONContent[] {
  const element = asElement(node);
  if (!element || !ts.isJsxElement(element)) return [paragraphNode([])];
  const blocks = children(element).flatMap((child) => {
    if (ts.isJsxText(child) || isInlineElement(child)) return [];
    return visitBlocks(child, ctx);
  });
  const inline = inlineOf(
    children(element).filter((child) => ts.isJsxText(child) || isInlineElement(child)),
    ctx,
  );
  const content = [...(inline.length ? [paragraphNode(inline)] : []), ...blocks];
  return content.length ? content : [paragraphNode([])];
}

function flattenedTable(node: ts.JsxElement | ts.JsxSelfClosingElement, ctx: Visit): JSONContent[] {
  note(ctx.notes, "table", "Tables are flattened to text rows. The published chapter still has the real table.");
  if (!ts.isJsxElement(node)) return [unsupported("table", "Empty table.")];
  const rows: JSONContent[] = [];
  const visitRow = (row: ts.Node) => {
    if (tagName(asElement(row)) !== "tr" || !ts.isJsxElement(row)) {
      if (ts.isJsxElement(row) || ts.isJsxFragment(row)) {
        for (const child of children(row)) visitRow(child);
      }
      return;
    }
    const cells = children(row)
      .map((cell) => plainText(cell).replace(/\s+/g, " ").trim())
      .filter(Boolean);
    if (cells.length) rows.push(paragraphNode([{ type: "text", text: cells.join(" | ") }]));
  };
  for (const child of children(node)) visitRow(child);
  return rows.length ? rows : [unsupported("table", "Empty table.")];
}

function a1List(): JSONContent[] {
  return [
    {
      type: "orderedList",
      content: A1_LAB_EXERCISE_SECTIONS.map((section) => ({
        type: "listItem",
        content: [
          paragraphNode([
            { type: "text", text: section.label, marks: [{ type: "bold" }] },
            { type: "text", text: " (" },
            {
              type: "text",
              text: section.section,
              marks: [{ type: "link", attrs: { href: sectionHref(section.section) } }],
            },
            { type: "text", text: ")" },
          ]),
          {
            type: "orderedList",
            content: section.tasks.map((task) => ({
              type: "listItem",
              content: [
                paragraphNode([
                  { type: "text", text: labExerciseKindLabel(task.kind), marks: [{ type: "bold" }] },
                  { type: "text", text: ` — ${task.description}` },
                ]),
              ],
            })),
          },
        ],
      })),
    },
  ];
}

function endMatterNodes(): JSONContent[] {
  const data = ch1EndMatter;
  const nodes: JSONContent[] = [];
  const addSection = (
    id: string,
    title: string,
    lead: string,
    items: JSONContent[],
  ) => {
    nodes.push(headingNode(2, id, [{ type: "text", text: title }]));
    nodes.push(paragraphNode([{ type: "text", text: lead }]));
    nodes.push({ type: "bulletList", content: items });
  };
  addSection(
    data.references.id,
    data.references.title,
    data.references.lead,
    data.references.items.map((slug) => {
      const entry = getTerm(slug);
      const label = entry?.term ?? titleFromSlug(slug);
      const content: JSONContent[] = entry
        ? [
            {
              type: "text",
              text: label,
              marks: [{ type: "link", attrs: { href: termPageHref(entry.officialUrl, entry.term, entry) } }],
            },
          ]
        : [{ type: "text", text: label }];
      return { type: "listItem", content: [paragraphNode(content)] };
    }),
  );
  if (data.references.topics.length) {
    nodes.push(
      paragraphNode([
        {
          type: "text",
          text: "These ideas also matter in this chapter even though they do not have their own term pages yet:",
        },
      ]),
    );
    nodes.push({
      type: "bulletList",
      content: data.references.topics.map((topic) => ({
        type: "listItem",
        content: [paragraphNode([{ type: "text", text: topic }])],
      })),
    });
  }
  const linkList = (items: { href: string; name: string; term?: string; description?: string; note?: string }[]) =>
    items.map((item) => ({
      type: "listItem",
      content: [
        paragraphNode([
          {
            type: "text",
            text: item.name,
            marks: [
              {
                type: "link",
                attrs: { href: termPageHref(item.href, item.term ?? item.name, getTerm(termSlug(item.term ?? item.name)), { term: item.term }) },
              },
            ],
          },
          ...(item.description || item.note
            ? [{ type: "text" as const, text: ` — ${item.description ?? item.note}` }]
            : []),
        ]),
      ],
    }));
  addSection(data.tools.id, data.tools.title, data.tools.lead, linkList([...data.tools.items]));
  addSection(data.aiTools.id, data.aiTools.title, data.aiTools.lead, linkList([...data.aiTools.items]));
  return nodes;
}

function inlineOf(nodes: readonly ts.Node[], ctx: Visit): JSONContent[] {
  const pieces: JSONContent[] = [];
  for (const node of nodes) pieces.push(...inlinePieces(node, ctx, []));
  return collapseInline(pieces);
}

function inlinePieces(node: ts.Node, ctx: Visit, marks: Mark[]): JSONContent[] {
  if (ts.isJsxText(node)) return textPiece(node.getText(), marks);
  if (ts.isJsxExpression(node)) {
    if (!node.expression) return [];
    return expressionPieces(node.expression, ctx, marks);
  }
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return textPiece(node.text, marks);
  }
  const element = asElement(node);
  if (!element) return [];
  const tag = tagName(element);
  if (!tag) return [];
  if (tag === "strong" || tag === "b") return inlineOf(children(element), ctx).map((piece) => addMark(piece, { type: "bold" }));
  if (tag === "em" || tag === "i") return inlineOf(children(element), ctx).map((piece) => addMark(piece, { type: "italic" }));
  if (tag === "code") return inlineOf(children(element), ctx).map((piece) => addMark(piece, { type: "code" }));
  if (tag === "br") return [{ type: "hardBreak" }];
  if (tag === "a" || tag === "Link") {
    const href = safeHref(attr(element, "href"));
    if (!href) return inlineOf(children(element), ctx);
    return inlineOf(children(element), ctx).map((piece) => addMark(piece, { type: "link", attrs: { href } }));
  }
  if (tag === "OfficialLink") return officialLinkPieces(element, ctx);
  if (tag === "SectionLink") return linkPiece(sectionHref(attr(element, "to") ?? ""), linkLabel(element, attr(element, "to") ?? "section"), marks);
  if (tag === "ChapterLink") {
    const to = attr(element, "to") ?? expressionAttr(element, "to");
    return linkPiece(`/book/ch${to}`, linkLabel(element, `Chapter ${to}`), marks);
  }
  if (tag === "FigureLink") {
    const to = attr(element, "to") ?? "";
    return linkPiece(`#fig-${to}`, linkLabel(element, `Figure ${to}`), marks);
  }
  if (tag === "LocalUrl") {
    const href = attr(element, "href") ?? "";
    const pathName = localUrlToPath(href);
    return linkPiece(pathName, linkLabel(element, href.startsWith("http") ? href : `http://localhost:3000${pathName}`), marks);
  }
  if (tag === "A1LabExerciseIntroLink") {
    return linkPiece("/assignments/a1", "A1 Lab checklist", marks);
  }
  if (tag === "HandInLink") {
    const id = attr(element, "id") ?? "";
    const href = /^a[1-6]$/.test(id) ? `https://kambaz.dev/assignments/${id}` : "";
    return linkPiece(href, href.replace(/^https:\/\//, "") || "assignment", marks);
  }
  if (tag === "SlideText") return textPiece(attr(element, "text") ?? plainText(element), marks);
  if (tag === "span" || tag === "abbr") return inlineOf(children(element), ctx);
  if (CHROME.has(tag)) {
    note(ctx.chrome, tag, "Section navigation stays on the published chapter.");
    return [];
  }
  if (tag[0] === tag[0].toUpperCase()) {
    note(ctx.notes, tag, "An inline component was replaced by its text.");
    const text = plainText(element).replace(/\s+/g, " ").trim();
    return text ? textPiece(text, marks) : [];
  }
  return inlineOf(children(element), ctx);
}

function officialLinkPieces(element: ts.JsxElement | ts.JsxSelfClosingElement, ctx: Visit): JSONContent[] {
  const href = attr(element, "href") ?? "";
  const label = (attr(element, "term") ?? plainText(element)).replace(/\s+/g, " ").trim();
  const entry = label ? getTerm(termSlug(label)) : undefined;
  const pathName = href ? termPageHref(href, label || "term", entry ?? undefined, { term: attr(element, "term") ?? undefined, searchQuery: attr(element, "searchQuery") ?? undefined }) : "";
  const inner = inlineOf(children(element), ctx);
  const pieces = inner.length ? inner : textPiece(label, []);
  if (!pathName) return pieces;
  return pieces.map((piece) => addMark(piece, { type: "link", attrs: { href: pathName } }));
}

function expressionPieces(expr: ts.Expression, ctx: Visit, marks: Mark[]): JSONContent[] {
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return textPiece(expr.text, marks);
  if (ts.isParenthesizedExpression(expr)) return expressionPieces(expr.expression, ctx, marks);
  if (ts.isJsxElement(expr) || ts.isJsxSelfClosingElement(expr) || ts.isJsxFragment(expr)) {
    return inlineOf([expr], ctx);
  }
  if (ts.isTemplateExpression(expr) && expr.templateSpans.every((span) => ts.isStringLiteralLike(span.expression) || ts.isIdentifier(span.expression) || ts.isPropertyAccessExpression(span.expression))) {
    let text = expr.head.text;
    for (const span of expr.templateSpans) {
      text += ts.isStringLiteralLike(span.expression) ? span.expression.text : "";
      text += span.literal.text;
    }
    return textPiece(text, marks);
  }
  note(ctx.notes, "expression", "A dynamic expression was not copied into the pilot.");
  return [];
}

function linkPiece(href: string, label: string, marks: Mark[]): JSONContent[] {
  const safe = safeHref(href);
  const text = label.trim() || href;
  if (!safe) return textPiece(text, marks);
  return textPiece(text, [...marks, { type: "link", attrs: { href: safe } }]);
}

function linkLabel(element: ts.JsxElement | ts.JsxSelfClosingElement, fallback: string): string {
  const text = plainText(element).replace(/\s+/g, " ").trim();
  return text || fallback;
}

function textPiece(raw: string, marks: Mark[]): JSONContent[] {
  const text = decode(raw).replace(/\s+/g, " ");
  if (!text) return [];
  const piece: JSONContent = { type: "text", text };
  if (marks.length) piece.marks = marks.map((mark) => ({ ...mark }));
  return [piece];
}

function addMark(piece: JSONContent, mark: Mark): JSONContent {
  if (piece.type !== "text") return piece;
  const marks = [...(piece.marks ?? [])];
  if (!marks.some((item) => item.type === mark.type)) marks.push(mark);
  return { ...piece, marks };
}

function collapseInline(pieces: JSONContent[]): JSONContent[] {
  const merged: JSONContent[] = [];
  for (const piece of pieces) {
    if (piece.type === "text" && piece.text === " ") {
      const prev = merged[merged.length - 1];
      if (!prev || prev.type !== "text" || prev.text?.endsWith(" ")) continue;
    }
    const prev = merged[merged.length - 1];
    if (
      piece.type === "text" &&
      prev?.type === "text" &&
      sameMarks(prev.marks, piece.marks)
    ) {
      prev.text = `${prev.text ?? ""}${piece.text ?? ""}`;
      continue;
    }
    merged.push(piece);
  }
  if (merged[0]?.type === "text") merged[0].text = merged[0].text?.replace(/^\s+/, "");
  const last = merged[merged.length - 1];
  if (last?.type === "text") last.text = last.text?.replace(/\s+$/, "");
  return merged.filter((piece) => piece.type !== "text" || piece.text);
}

function sameMarks(a: JSONContent["marks"], b: JSONContent["marks"]): boolean {
  const left = a ?? [];
  const right = b ?? [];
  if (left.length !== right.length) return false;
  return left.every((mark, index) => mark.type === right[index]?.type && mark.attrs?.href === right[index]?.attrs?.href);
}

function paragraphNode(content: JSONContent[]): JSONContent {
  return content.length ? { type: "paragraph", content } : { type: "paragraph" };
}

function headingNode(level: number, id: string | null, content: JSONContent[]): JSONContent {
  return {
    type: "heading",
    attrs: { level, id: id || null },
    content: content.length ? content : [{ type: "text", text: "Untitled" }],
  };
}

function unsupported(name: string, reason: string): JSONContent {
  return { type: "unsupported", attrs: { name: name.slice(0, 80), reason: reason.slice(0, 200) } };
}

const PROSE_COMPONENTS = new Set([
  "OfficialLink",
  "SectionLink",
  "ChapterLink",
  "FigureLink",
  "LocalUrl",
  "Link",
  "A1LabExerciseIntroLink",
  "HandInLink",
  "SlideText",
]);

function isComponentTag(tag: string): boolean {
  return tag[0] === tag[0].toUpperCase() && !CHROME.has(tag);
}

function isProseComponent(tag: string): boolean {
  return PROSE_COMPONENTS.has(tag);
}

function flow(nodes: readonly ts.Node[], ctx: Visit): JSONContent[] {
  const blocks: JSONContent[] = [];
  const inline: ts.Node[] = [];
  const flush = () => {
    const content = inlineOf(inline, ctx);
    inline.length = 0;
    if (content.length) blocks.push(paragraphNode(content));
  };
  for (const node of nodes) {
    if (ts.isJsxText(node) || isInlineElement(node) || isInlineExpression(node)) {
      inline.push(node);
      continue;
    }
    flush();
    blocks.push(...visitBlocks(node, ctx));
  }
  flush();
  return blocks;
}

function isInlineExpression(node: ts.Node): boolean {
  if (!ts.isJsxExpression(node) || !node.expression) return false;
  const expr = node.expression;
  return (
    ts.isStringLiteral(expr) ||
    ts.isNoSubstitutionTemplateLiteral(expr) ||
    ts.isNumericLiteral(expr) ||
    ts.isParenthesizedExpression(expr) ||
    ts.isJsxElement(expr) ||
    ts.isJsxSelfClosingElement(expr)
  );
}

function children(node: ts.Node): readonly ts.Node[] {
  if (ts.isJsxElement(node) || ts.isJsxFragment(node)) return node.children;
  return [];
}

function elementChildren(node: ts.JsxElement): (ts.JsxElement | ts.JsxSelfClosingElement)[] {
  return node.children.filter((child): child is ts.JsxElement | ts.JsxSelfClosingElement =>
    ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child),
  );
}

function asElement(node: ts.Node | null): ts.JsxElement | ts.JsxSelfClosingElement | null {
  if (!node) return null;
  if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) return node;
  return null;
}

function isInlineElement(node: ts.Node): boolean {
  const tag = tagName(asElement(node));
  if (!tag) return ts.isJsxExpression(node);
  return PROSE_COMPONENTS.has(tag) || ["strong", "b", "em", "i", "code", "a", "span", "br", "abbr"].includes(tag) || CHROME.has(tag);
}

function tagName(node: ts.JsxElement | ts.JsxSelfClosingElement | null): string | null {
  if (!node) return null;
  const name = ts.isJsxElement(node) ? node.openingElement.tagName : node.tagName;
  if (ts.isIdentifier(name)) return name.text;
  return null;
}

function attr(node: ts.JsxElement | ts.JsxSelfClosingElement, key: string): string | null {
  const attrs = ts.isJsxElement(node) ? node.openingElement.attributes : node.attributes;
  for (const item of attrs.properties) {
    if (!ts.isJsxAttribute(item) || item.name.getText() !== key) continue;
    if (!item.initializer) return "true";
    if (ts.isStringLiteral(item.initializer)) return item.initializer.text;
    if (ts.isJsxExpression(item.initializer) && item.initializer.expression && (ts.isStringLiteral(item.initializer.expression) || ts.isNoSubstitutionTemplateLiteral(item.initializer.expression) || ts.isNumericLiteral(item.initializer.expression))) {
      return ts.isNumericLiteral(item.initializer.expression)
        ? item.initializer.expression.text
        : item.initializer.expression.text;
    }
  }
  return null;
}

function expressionAttr(node: ts.JsxElement | ts.JsxSelfClosingElement, key: string): string {
  const attrs = ts.isJsxElement(node) ? node.openingElement.attributes : node.attributes;
  for (const item of attrs.properties) {
    if (!ts.isJsxAttribute(item) || item.name.getText() !== key || !item.initializer) continue;
    if (ts.isJsxExpression(item.initializer) && item.initializer.expression) {
      return item.initializer.expression.getText();
    }
  }
  return "";
}

function codeText(node: ts.JsxElement | ts.JsxSelfClosingElement): string {
  if (!ts.isJsxElement(node)) return "";
  for (const child of node.children) {
    const expr = ts.isJsxExpression(child) ? child.expression : child;
    if (!expr) continue;
    if (ts.isNoSubstitutionTemplateLiteral(expr) || ts.isStringLiteral(expr)) {
      return expr.text.replace(/^\n/, "").replace(/\n$/, "");
    }
    if (ts.isTemplateExpression(expr)) {
      let text = expr.head.text;
      for (const span of expr.templateSpans) {
        text += ts.isStringLiteralLike(span.expression) ? span.expression.text : "";
        text += span.literal.text;
      }
      return text.replace(/^\n/, "").replace(/\n$/, "");
    }
  }
  return plainText(node).replace(/^\n/, "").replace(/\n$/, "");
}

function plainText(node: ts.Node): string {
  if (ts.isJsxText(node)) return decode(node.getText());
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isJsxExpression(node) && node.expression) return plainText(node.expression);
  if (ts.isJsxElement(node) || ts.isJsxFragment(node)) return node.children.map(plainText).join("");
  if (ts.isJsxSelfClosingElement(node)) return "";
  return "";
}

function importMap(sf: ts.SourceFile, file: string, root: string): Map<string, ImportRef> {
  const map = new Map<string, ImportRef>();
  for (const statement of sf.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const spec = statement.moduleSpecifier.text;
    const resolved = resolveModule(file, spec, root);
    const clause = statement.importClause;
    if (!clause) continue;
    if (clause.name) {
      map.set(clause.name.text, { spec, exportName: "default", resolved });
    }
    const bindings = clause.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
      for (const item of bindings.elements) {
        const local = item.name.text;
        const exported = item.propertyName?.text ?? local;
        map.set(local, { spec, exportName: exported, resolved });
      }
    }
  }
  return map;
}

function resolveModule(fromFile: string, spec: string, root: string): string | null {
  let base = "";
  if (spec.startsWith("@/")) base = path.join(root, spec.slice(2));
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(fromFile), spec);
  else return null;
  const candidates = [base, `${base}.tsx`, `${base}.ts`, path.join(base, "index.tsx"), path.join(base, "index.ts")];
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

function serverComponentKind(file: string): "async" | "server-only" | null {
  const source = fs.readFileSync(file, "utf8");
  if (/export default async function/.test(source)) return "async";
  if (source.includes('from "server-only"') || source.includes("from 'server-only'")) return "server-only";
  return null;
}

function toAlias(file: string, root: string): string {
  const rel = path.relative(root, file).replace(/\\/g, "/").replace(/\.tsx$/, "").replace(/\.ts$/, "");
  return `@/${rel}`;
}

type ChapterFunction = ts.FunctionDeclaration | ts.ArrowFunction | ts.FunctionExpression;

function findFunction(sf: ts.SourceFile, name: string): ChapterFunction | null {
  for (const statement of sf.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name?.text === name) return statement;
    if (ts.isVariableStatement(statement)) {
      for (const decl of statement.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.name.text === name && decl.initializer && (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer))) {
          return decl.initializer;
        }
      }
    }
  }
  return null;
}

function findReturnedJsx(fn: ChapterFunction): ts.Node | null {
  if (!fn.body) return null;
  if (!ts.isBlock(fn.body)) return fn.body;
  let found: ts.Node | null = null;
  const walk = (node: ts.Node) => {
    if (found) return;
    if (ts.isReturnStatement(node) && node.expression) {
      found = node.expression;
      return;
    }
    ts.forEachChild(node, walk);
  };
  walk(fn.body);
  return found;
}

function sectionHref(ref: string): string {
  const cleaned = ref.replace(/^§/, "").trim();
  const parts = cleaned.split(".");
  return `/book/ch${parts[0]}#sec-${parts.join("-")}`;
}

function localUrlToPath(urlOrPath: string): string {
  const origin = "http://localhost:3000";
  const trimmed = urlOrPath.trim();
  if (trimmed.startsWith(origin)) {
    const next = trimmed.slice(origin.length);
    return next === "" ? "/" : next;
  }
  if (trimmed.startsWith("/")) return trimmed;
  return `/${trimmed}`;
}

function safeHref(href: string | null): string | null {
  if (!href) return null;
  const trimmed = href.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  if (trimmed.startsWith("#") && !trimmed.includes("javascript:")) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:") return url.toString();
  } catch {
    return null;
  }
  return null;
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
