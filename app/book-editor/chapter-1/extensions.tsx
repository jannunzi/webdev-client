import { Extension, Node, mergeAttributes } from "@tiptap/core";
import Heading from "@tiptap/extension-heading";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { BOOK_EMBEDS } from "@/lib/book-editor/embed-registry";

export const ghostKey = new PluginKey<DecorationSet>("bookGhost");

export const BookHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("id"),
        renderHTML: (attributes: { id?: string | null }) => (attributes.id ? { id: attributes.id } : {}),
      },
    };
  },
});

export const Ghost = Extension.create({
  name: "bookGhost",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: ghostKey,
        state: {
          init: () => DecorationSet.empty,
          apply(tr, old) {
            const next = tr.getMeta(ghostKey) as DecorationSet | undefined;
            if (next) return next;
            if (tr.docChanged) return DecorationSet.empty;
            return old.map(tr.mapping, tr.doc);
          },
        },
        props: {
          decorations(state) {
            return ghostKey.getState(state);
          },
        },
      }),
    ];
  },
});

export const bracketRunKey = new PluginKey<DecorationSet>("bracketRun");

export const BracketRun = Extension.create({
  name: "bracketRun",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: bracketRunKey,
        state: {
          init: () => DecorationSet.empty,
          apply(tr, old) {
            const next = tr.getMeta(bracketRunKey) as DecorationSet | undefined;
            if (next) return next;
            if (tr.docChanged) return old.map(tr.mapping, tr.doc);
            return old;
          },
        },
        props: {
          decorations(state) {
            return bracketRunKey.getState(state);
          },
        },
      }),
    ];
  },
});

export function ghostDecorations(doc: Parameters<typeof DecorationSet.create>[0], pos: number, text: string) {
  const span = () => {
    const node = document.createElement("span");
    node.dataset.bookGhost = "1";
    node.textContent = text;
    node.setAttribute("aria-hidden", "true");
    node.style.color = "#595959";
    return node;
  };
  return DecorationSet.create(doc, [Decoration.widget(pos, span, { side: 1, ignoreSelection: true })]);
}

export function bracketRunDecorations(
  doc: Parameters<typeof DecorationSet.create>[0],
  pos: number,
  options: { busy: boolean; onRun: () => void },
) {
  const button = () => {
    const node = document.createElement("button");
    node.type = "button";
    node.dataset.bracketRun = "1";
    node.className = "book-bracket-run";
    node.setAttribute("aria-label", "Run bracket instruction");
    node.title = "Run this instruction";
    node.disabled = options.busy;
    if (options.busy) node.setAttribute("aria-busy", "true");
    node.textContent = options.busy ? "…" : "✓";
    const keep = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    node.addEventListener("pointerdown", keep);
    node.addEventListener("mousedown", keep);
    node.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!node.disabled) options.onRun();
    });
    return node;
  };
  return DecorationSet.create(doc, [
    Decoration.widget(pos, button, { side: 1, ignoreSelection: true, key: "bracket-run" }),
  ]);
}

function EmbedView({ node, selected }: NodeViewProps) {
  const component = String(node.attrs.component ?? "");
  const Demo = BOOK_EMBEDS[component];
  const name = String(node.attrs.name ?? component);
  const file = String(node.attrs.file ?? "");
  return (
    <NodeViewWrapper
      data-book-embed={component}
      className={selected ? "book-embed is-selected" : "book-embed"}
    >
      <div contentEditable={false}>
        <p className="book-embed-label">
          {name}
          {file ? <span> {file}</span> : null}
        </p>
        {Demo ? <Demo /> : <p>Demo {component} is not registered.</p>}
      </div>
    </NodeViewWrapper>
  );
}

export const BookEmbed = Node.create({
  name: "bookEmbed",
  group: "block",
  atom: true,
  selectable: true,
  draggable: false,
  addAttributes() {
    return {
      component: { default: "" },
      name: { default: "" },
      file: { default: "" },
    };
  },
  parseHTML: () => [{ tag: "div[data-book-embed]" }],
  renderHTML: ({ HTMLAttributes }) => [
    "div",
    mergeAttributes(HTMLAttributes, { "data-book-embed": HTMLAttributes.component }),
  ],
  addNodeView: () => ReactNodeViewRenderer(EmbedView),
});

function FigureView({ node, selected }: NodeViewProps) {
  const src = String(node.attrs.src ?? "");
  const alt = String(node.attrs.alt ?? "");
  const caption = String(node.attrs.caption ?? "");
  const id = String(node.attrs.id ?? "");
  return (
    <NodeViewWrapper className={selected ? "book-figure is-selected" : "book-figure"} data-book-figure={id}>
      <figure id={id || undefined} contentEditable={false}>
        <img src={src} alt={alt} />
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </NodeViewWrapper>
  );
}

export const BookFigure = Node.create({
  name: "bookFigure",
  group: "block",
  atom: true,
  selectable: true,
  addAttributes() {
    return {
      id: { default: "" },
      src: { default: "" },
      alt: { default: "" },
      caption: { default: "" },
    };
  },
  parseHTML: () => [{ tag: "figure[data-book-figure]" }],
  renderHTML: ({ HTMLAttributes }) => ["figure", mergeAttributes(HTMLAttributes)],
  addNodeView: () => ReactNodeViewRenderer(FigureView),
});

function UnsupportedView({ node }: NodeViewProps) {
  return (
    <NodeViewWrapper className="book-unsupported" data-unsupported={String(node.attrs.name ?? "")}>
      <p contentEditable={false}>
        <strong>{String(node.attrs.name ?? "Block")}</strong>
        {". "}
        {String(node.attrs.reason ?? "")}
      </p>
    </NodeViewWrapper>
  );
}

export const Unsupported = Node.create({
  name: "unsupported",
  group: "block",
  atom: true,
  selectable: true,
  addAttributes() {
    return {
      name: { default: "" },
      reason: { default: "" },
    };
  },
  parseHTML: () => [{ tag: "aside[data-unsupported]" }],
  renderHTML: ({ HTMLAttributes }) => ["aside", mergeAttributes(HTMLAttributes)],
  addNodeView: () => ReactNodeViewRenderer(UnsupportedView),
});
