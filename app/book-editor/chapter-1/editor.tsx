"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { DecorationSet } from "@tiptap/pm/view";
import { useEffect, useRef, useState } from "react";
import { blocksFromModelText } from "@/lib/inline-edit/generated";
import { maskPreservedHtml, placeholdersIntact, splitGhostWord } from "@/lib/inline-edit/suggest-diff";
import { blocksToNodes, parseInline } from "@/lib/book-editor/ai-insert";
import { bracketInstruction } from "@/lib/book-editor/brackets";
import type { ChapterPayload } from "@/lib/book-editor/handle";
import { safeHref } from "@/lib/book-editor/schema";
import { BookEmbed, BookFigure, BookHeading, Ghost, Unsupported, ghostDecorations, ghostKey } from "./extensions";

type Status = "idle" | "saving" | "saved" | "error" | "conflict";

export default function ChapterEditor({ initial }: { initial: ChapterPayload }) {
  const revision = useRef(initial.revision);
  const savedJson = useRef(JSON.stringify(initial.doc));
  const timer = useRef<number | null>(null);
  const ghostTimer = useRef<number | null>(null);
  const ghostToken = useRef(0);
  const showingGhost = useRef(false);
  const keys = useRef({ tab: () => false, word: () => false, instruct: () => false });
  const [status, setStatus] = useState<Status>(initial.persisted ? "saved" : "idle");
  const [message, setMessage] = useState(initial.storage.message);
  const [conflictRevision, setConflictRevision] = useState<number | null>(null);
  const [instruction, setInstruction] = useState("");
  const [linkHref, setLinkHref] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);
  const [suggestError, setSuggestError] = useState("");
  const [suggestion, setSuggestion] = useState<{ from: number; to: number; html: string } | null>(null);
  const [busy, setBusy] = useState<"improve" | "instruct" | null>(null);

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: false,
          link: {
            openOnClick: false,
            autolink: false,
            linkOnPaste: false,
            isAllowedUri: (url) => safeHref(url),
          },
        }),
        BookHeading.configure({ levels: [1, 2, 3, 4] }),
        BookEmbed,
        BookFigure,
        Unsupported,
        Ghost,
      ],
      content: initial.doc,
      editorProps: {
        attributes: {
          "aria-label": "Chapter 1",
          class: "book-editor-document",
        },
      },
      onUpdate: ({ editor: current }) => {
        setSuggestion(null);
        ghostToken.current += 1;
        if (ghostTimer.current != null) window.clearTimeout(ghostTimer.current);
        scheduleSave(current);
        armGhost(current);
      },
      onSelectionUpdate: ({ editor: current }) => {
        if (showingGhost.current) return;
        ghostToken.current += 1;
        const marks = ghostKey.getState(current.state);
        if (marks && marks.find().length) {
          current.view.dispatch(current.state.tr.setMeta(ghostKey, DecorationSet.empty));
        }
        armGhost(current);
      },
    },
    [initial.revision, initial.updatedAt],
  );

  function scheduleSave(current: Editor) {
    const json = JSON.stringify(current.getJSON());
    if (json === savedJson.current) return;
    setStatus("idle");
    if (timer.current != null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      void save(current, revision.current);
    }, 800);
  }

  async function save(current: Editor, expected: number) {
    const doc = current.getJSON();
    const json = JSON.stringify(doc);
    if (json === savedJson.current) return;
    setStatus("saving");
    setMessage(initial.storage.message);
    try {
      const response = await fetch("/api/book-editor/chapter-1", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ expectedRevision: expected, doc }),
      });
      const data = (await response.json().catch(() => null)) as {
        revision?: number;
        error?: string;
        conflict?: { revision?: number } | null;
      } | null;
      if (response.status === 409) {
        setStatus("conflict");
        setConflictRevision(data?.conflict?.revision ?? null);
        setMessage(data?.error || "A newer copy is saved. Your draft is still in the editor.");
        return;
      }
      if (!response.ok || typeof data?.revision !== "number") {
        setStatus("error");
        setMessage(data?.error || "The chapter could not be saved.");
        return;
      }
      revision.current = data.revision;
      savedJson.current = json;
      setConflictRevision(null);
      if (JSON.stringify(current.getJSON()) !== json) {
        scheduleSave(current);
        return;
      }
      setStatus("saved");
      setMessage(initial.storage.message);
    } catch {
      setStatus("error");
      setMessage("The chapter could not be saved.");
    }
  }

  function armGhost(current: Editor) {
    if (ghostTimer.current != null) window.clearTimeout(ghostTimer.current);
    const plugin = ghostKey.getState(current.state);
    if (plugin && plugin.find().length) return;
    if (!current.state.selection.empty) return;
    if (current.isActive("codeBlock") || current.isActive("bookEmbed") || current.isActive("bookFigure")) return;
    const token = ghostToken.current;
    ghostTimer.current = window.setTimeout(() => {
      void requestGhost(current, token);
    }, 700);
  }

  async function requestGhost(current: Editor, token: number) {
    if (token !== ghostToken.current || !current.state.selection.empty) return;
    const parent = current.state.selection.$from.parent;
    if (!parent.isTextblock) return;
    const start = current.state.selection.$from.start();
    const offset = current.state.selection.from - start;
    const before = parent.textBetween(0, offset, "\n", "\n");
    const after = parent.textBetween(offset, parent.content.size, "\n", "\n");
    if (!before.trim() && !after.trim()) return;
    const response = await fetch("/api/staff/ai-suggest", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode: "continue", before, after, text: before, maskCount: 0 }),
    });
    const data = (await response.json().catch(() => null)) as { text?: string } | null;
    if (token !== ghostToken.current || !data?.text || !current.state.selection.empty) return;
    const pos = current.state.selection.from;
    showingGhost.current = true;
    current.view.dispatch(current.state.tr.setMeta(ghostKey, ghostDecorations(current.state.doc, pos, data.text)));
    showingGhost.current = false;
  }

  function acceptGhost(mode: "word" | "all"): boolean {
    if (!editor) return false;
    const ghost = document.querySelector("[data-book-ghost]")?.textContent ?? "";
    if (!ghost) return false;
    const take = mode === "word" ? splitGhostWord(ghost)?.take ?? ghost : ghost;
    const rest = mode === "word" ? splitGhostWord(ghost)?.rest ?? "" : "";
    editor
      .chain()
      .focus()
      .command(({ tr, state }) => {
        tr.insertText(take, state.selection.from);
        tr.setMeta(
          ghostKey,
          rest ? ghostDecorations(tr.doc, state.selection.from + take.length, rest) : DecorationSet.empty,
        );
        return true;
      })
      .run();
    return true;
  }

  async function improve() {
    if (!editor || editor.state.selection.empty) return;
    const { from, to } = editor.state.selection;
    const masked = maskPreservedHtml(selectionHtml(editor));
    setBusy("improve");
    setSuggestError("");
    try {
      const response = await fetch("/api/staff/ai-suggest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "improve", text: masked.prompt, maskCount: masked.masks.length }),
      });
      const data = (await response.json().catch(() => null)) as { text?: string; error?: string } | null;
      if (!response.ok || !data?.text || !placeholdersIntact(data.text, masked.masks.length)) {
        setSuggestError(data?.error || "No suggestion.");
        return;
      }
      const html = data.text.replace(/⟦(\d+)⟧/g, (_, digits: string) => masked.masks[Number(digits)] ?? "");
      setSuggestion({ from, to, html });
    } catch {
      setSuggestError("No suggestion.");
    } finally {
      setBusy(null);
    }
  }

  function acceptSuggestion() {
    if (!editor || !suggestion) return;
    const content = parseInline(suggestion.html);
    editor.chain().focus().insertContentAt({ from: suggestion.from, to: suggestion.to }, content).run();
    setSuggestion(null);
  }

  async function instruct() {
    if (!editor) return false;
    const parent = editor.state.selection.$from.parent;
    const text = parent.isTextblock ? parent.textContent ?? "" : "";
    const caret = editor.state.selection.from - editor.state.selection.$from.start();
    const fromBrackets = instruction.trim() ? null : bracketInstruction(text, caret);
    const prompt = instruction.trim() || fromBrackets || "";
    if (!prompt) {
      setSuggestError("Write an instruction, or put one in [brackets].");
      return true;
    }
    setBusy("instruct");
    setSuggestError("");
    try {
      const response = await fetch("/api/staff/ai-suggest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "instruct",
          instruction: prompt,
          before: textBefore(editor),
          after: "",
          section: "",
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        blocks?: { kind: "p" | "ul" | "ol"; html?: string; items?: string[] }[];
        error?: string;
      } | null;
      if (!response.ok || !data?.blocks?.length) {
        setSuggestError(data?.error || "No insertion.");
        return true;
      }
      const nodes = blocksToNodes(
        blocksFromModelText(
          data.blocks
            .map((block) =>
              block.kind === "p"
                ? block.html ?? ""
                : `<${block.kind}>${(block.items ?? []).map((item) => `<li>${item}</li>`).join("")}</${block.kind}>`,
            )
            .join(""),
        ),
      );
      if (!nodes.length) {
        setSuggestError("No insertion.");
        return true;
      }
      const $from = editor.state.selection.$from;
      const whole = text.trim() === `[${prompt}]`;
      editor
        .chain()
        .focus()
        .insertContentAt(whole ? { from: $from.before(), to: $from.after() } : $from.after(), nodes)
        .run();
      setInstruction("");
    } catch {
      setSuggestError("No insertion.");
    } finally {
      setBusy(null);
    }
    return true;
  }

  useEffect(() => {
    keys.current = {
      tab: () => acceptGhost("all"),
      word: () => acceptGhost("word"),
      instruct: () => {
        void instruct();
        return true;
      },
    };
  });

  useEffect(() => {
    if (!editor) return;
    const tab = () => keys.current.tab();
    const word = () => keys.current.word();
    const run = () => keys.current.instruct();
    editor.setOptions({
      editorProps: {
        ...editor.options.editorProps,
        handleKeyDown: (_view, event) => {
          const mod = event.metaKey || event.ctrlKey;
          if (event.key === "Tab" && document.querySelector("[data-book-ghost]")) {
            event.preventDefault();
            return tab();
          }
          if (mod && event.key === "ArrowRight" && document.querySelector("[data-book-ghost]")) {
            event.preventDefault();
            return word();
          }
          if (mod && event.key === "Enter") {
            event.preventDefault();
            return run();
          }
          return false;
        },
      },
    });
  }, [editor]);

  useEffect(() => {
    return () => {
      if (timer.current != null) window.clearTimeout(timer.current);
      if (ghostTimer.current != null) window.clearTimeout(ghostTimer.current);
    };
  }, []);

  async function overwrite() {
    if (!editor || conflictRevision == null) return;
    revision.current = conflictRevision;
    await save(editor, conflictRevision);
  }

  async function restoreLatest() {
    if (!editor) return;
    const listed = await fetch("/api/book-editor/chapter-1/revisions");
    const data = (await listed.json().catch(() => null)) as { revisions?: { revision: number }[] } | null;
    const revisionId = data?.revisions?.[0]?.revision;
    if (revisionId == null) {
      setMessage("There is no earlier revision.");
      return;
    }
    const response = await fetch("/api/book-editor/chapter-1/revisions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ expectedRevision: revision.current, revision: revisionId }),
    });
    const body = (await response.json().catch(() => null)) as { revision?: number; doc?: object; error?: string } | null;
    if (!response.ok || !body?.doc || typeof body.revision !== "number") {
      setStatus("error");
      setMessage(body?.error || "The revision could not be restored.");
      return;
    }
    editor.commands.setContent(body.doc);
    revision.current = body.revision;
    savedJson.current = JSON.stringify(editor.getJSON());
    setStatus("saved");
    setMessage(initial.storage.message);
  }

  function applyLink() {
    if (!editor) return;
    const href = linkHref.trim();
    if (!href || !safeHref(href)) {
      setSuggestError("Use an http(s) address or a site path.");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setLinkOpen(false);
  }

  const label =
    status === "saving" ? "Saving…" : status === "saved" ? "Saved" : status === "conflict" ? "Conflict" : status === "error" ? "Not saved" : "Draft";

  return (
    <div className="book-editor">
      <p className="book-editor-banner">
        Chapter 1 pilot. Autosave stays in the book editor store and does not change the public book at /book/ch1.
      </p>
      <div className="book-editor-toolbar" role="toolbar" aria-label="Formatting">
        <button type="button" aria-pressed={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()}>Bold</button>
        <button type="button" aria-pressed={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()}>Italic</button>
        <button type="button" aria-pressed={editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>Heading</button>
        <button type="button" aria-pressed={editor?.isActive("heading", { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>Subheading</button>
        <button type="button" aria-pressed={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()}>Bullets</button>
        <button type="button" aria-pressed={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>Numbers</button>
        <button type="button" aria-pressed={editor?.isActive("code")} onClick={() => editor?.chain().focus().toggleCode().run()}>Code</button>
        <button type="button" onClick={() => setLinkOpen((open) => !open)}>Link</button>
        <button type="button" disabled={!editor || editor.state.selection.empty || busy != null} onClick={() => void improve()}>
          Improve
        </button>
        <label>
          Instruction
          <input
            value={instruction}
            onChange={(event) => setInstruction(event.target.value)}
            placeholder="Write a paragraph or a list"
            aria-label="Instruction"
          />
        </label>
        <button type="button" disabled={busy != null} onClick={() => void instruct()}>
          Insert
        </button>
        <button type="button" onClick={() => void restoreLatest()}>Restore previous</button>
      </div>
      {linkOpen ? (
        <form
          className="book-editor-link"
          onSubmit={(event) => {
            event.preventDefault();
            applyLink();
          }}
        >
          <label>
            Address
            <input value={linkHref} onChange={(event) => setLinkHref(event.target.value)} aria-label="Link address" />
          </label>
          <button type="submit">Apply link</button>
        </form>
      ) : null}
      <p role="status" className="book-editor-status" data-save-status={status}>
        {label}. {message}
      </p>
      {status === "conflict" ? (
        <p>
          <button type="button" onClick={() => void overwrite()}>Keep my draft</button>
        </p>
      ) : null}
      {suggestError ? <p role="status">{suggestError}</p> : null}
      {suggestion ? (
        <div className="book-editor-suggestion">
          <p>Suggestion</p>
          <p>{suggestion.html.replace(/<[^>]+>/g, "")}</p>
          <button type="button" onClick={acceptSuggestion}>Accept suggestion</button>
          <button type="button" onClick={() => setSuggestion(null)}>Dismiss</button>
        </div>
      ) : null}
      <EditorContent editor={editor} />
      <details className="book-editor-inventory">
        <summary>What this import includes</summary>
        <p>
          {initial.inventory.headings} headings, {initial.inventory.paragraphs} paragraphs, {initial.inventory.lists} lists, {initial.inventory.links} links, {initial.inventory.codeBlocks} code blocks, {initial.inventory.embeds} live demos, {initial.inventory.figures} figures.
        </p>
        <ul>
          {initial.inventory.unsupported.map((item) => (
            <li key={item.name}>
              {item.name} ({item.count}): {item.reason}
            </li>
          ))}
          {initial.inventory.omittedChrome.map((item) => (
            <li key={item.name}>
              {item.name} ({item.count}): {item.reason}
            </li>
          ))}
        </ul>
      </details>
      <style>{`
        .book-editor-toolbar, .book-editor-link { display: flex; flex-wrap: wrap; gap: 0.35rem; align-items: center; margin: 0.5rem 0; font-family: ui-sans-serif, system-ui, sans-serif; }
        .book-editor-toolbar { background: #fff; border-bottom: 1px solid #e5e5e5; padding: 0.4rem 0; }
        .book-editor-toolbar button, .book-editor-link button, .book-editor-suggestion button { border: 1px solid #d4d4d4; background: #fff; border-radius: 0.25rem; padding: 0.15rem 0.45rem; font-size: 0.85rem; }
        .book-editor-toolbar button[aria-pressed="true"] { border-color: #171717; }
        .book-editor-toolbar input, .book-editor-link input { border: 1px solid #d4d4d4; border-radius: 0.25rem; padding: 0.15rem 0.35rem; min-width: 12rem; }
        .book-editor-banner, .book-editor-status, .book-editor-inventory { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 0.85rem; color: #404040; }
        .book-editor-document { outline: none; min-height: 50vh; }
        .book-editor-document h1, .book-editor-document h2, .book-editor-document h3 { font-family: ui-sans-serif, system-ui, sans-serif; }
        .book-editor-document pre { overflow-x: auto; background: #f5f5f5; padding: 0.75rem; }
        .book-embed, .book-figure { margin: 1rem 0; border: 1px solid #d4d4d4; background: #fff; }
        .book-embed.is-selected, .book-figure.is-selected { outline: 1px solid #525252; }
        .book-embed-label, .book-figure figcaption { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 0.8rem; background: #f5f5f5; margin: 0; padding: 0.35rem 0.6rem; }
        .book-figure img { max-width: 100%; height: auto; }
        .book-unsupported { border: 1px dashed #a3a3a3; padding: 0.4rem 0.6rem; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 0.85rem; }
        [data-book-ghost] { color: #595959; }
      `}</style>
    </div>
  );
}

function selectionHtml(editor: Editor): string {
  const { from, to } = editor.state.selection;
  let html = "";
  editor.state.doc.nodesBetween(from, to, (node, pos) => {
    if (!node.isText || !node.text) return;
    const start = Math.max(from, pos);
    const end = Math.min(to, pos + node.text.length);
    const text = escapeText(node.text.slice(start - pos, end - pos));
    const code = node.marks.some((mark) => mark.type.name === "code");
    const link = node.marks.find((mark) => mark.type.name === "link");
    let wrapped = code ? `<code>${text}</code>` : text;
    const href = typeof link?.attrs.href === "string" ? link.attrs.href : "";
    if (href && safeHref(href)) wrapped = `<a href="${escapeText(href)}">${wrapped}</a>`;
    html += wrapped;
  });
  return html;
}

function textBefore(editor: Editor): string {
  const pos = editor.state.selection.from;
  return editor.state.doc.textBetween(Math.max(0, pos - 1500), pos, "\n", "\n");
}

function escapeText(text: string): string {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
