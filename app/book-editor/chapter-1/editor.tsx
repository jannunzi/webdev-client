"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { DecorationSet } from "@tiptap/pm/view";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  FaBold,
  FaCode,
  FaItalic,
  FaLink,
  FaListOl,
  FaListUl,
  FaUnderline,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { LuHistory } from "react-icons/lu";
import { blocksFromModelText } from "@/lib/inline-edit/generated";
import { maskPreservedHtml, placeholdersIntact, splitGhostWord } from "@/lib/inline-edit/suggest-diff";
import { blocksToNodes, parseInline } from "@/lib/book-editor/ai-insert";
import { bracketInstruction, bracketSpot } from "@/lib/book-editor/brackets";
import type { ChapterPayload } from "@/lib/book-editor/handle";
import { safeHref } from "@/lib/book-editor/schema";
import {
  BookEmbed,
  BookFigure,
  BookHeading,
  BracketRun,
  Ghost,
  Unsupported,
  bracketRunDecorations,
  bracketRunKey,
  ghostDecorations,
  ghostKey,
} from "./extensions";

type Status = "idle" | "saving" | "saved" | "error" | "conflict";

export default function ChapterEditor({ initial }: { initial: ChapterPayload }) {
  const revision = useRef(initial.revision);
  const savedJson = useRef(JSON.stringify(initial.doc));
  const timer = useRef<number | null>(null);
  const ghostTimer = useRef<number | null>(null);
  const ghostToken = useRef(0);
  const ghostAbort = useRef<AbortController | null>(null);
  const showingGhost = useRef(false);
  const placingBracket = useRef(false);
  const instructLock = useRef(false);
  const bracketSig = useRef("");
  const busyRef = useRef<"improve" | "instruct" | null>(null);
  const instructRef = useRef<(explicit?: string) => Promise<boolean>>(async () => false);
  const syncRef = useRef<(current: Editor) => void>(() => {});
  const keys = useRef<{ tab: () => boolean; word: () => boolean; instruct: () => boolean }>({
    tab: () => false,
    word: () => false,
    instruct: () => false,
  });
  const [status, setStatus] = useState<Status>(initial.persisted ? "saved" : "idle");
  const [message, setMessage] = useState(initial.storage.message);
  const [conflictRevision, setConflictRevision] = useState<number | null>(null);
  const [instruction, setInstruction] = useState("");
  const [linkHref, setLinkHref] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);
  const [suggestError, setSuggestError] = useState("");
  const [suggestion, setSuggestion] = useState<{ from: number; to: number; html: string } | null>(null);
  const [busy, setBusy] = useState<"improve" | "instruct" | null>(null);
  const [blockStyle, setBlockStyle] = useState("paragraph");
  const [styleOpen, setStyleOpen] = useState(false);
  const styleSelection = useRef<{ from: number; to: number } | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: false,
          strike: false,
          link: {
            openOnClick: false,
            autolink: false,
            linkOnPaste: false,
            isAllowedUri: (url) => safeHref(url),
          },
        }),
        BookHeading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
        BookEmbed,
        BookFigure,
        Unsupported,
        Ghost,
        BracketRun,
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
        syncRef.current(current);
        armGhost(current);
        setBlockStyle(readBlockStyle(current));
      },
      onSelectionUpdate: ({ editor: current }) => {
        setBlockStyle(readBlockStyle(current));
        if (showingGhost.current || placingBracket.current) return;
        syncRef.current(current);
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

  function insideBracket(current: Editor): boolean {
    if (current.isActive("codeBlock") || current.isActive("bookEmbed") || current.isActive("bookFigure")) return false;
    const parent = current.state.selection.$from.parent;
    if (!parent.isTextblock) return false;
    const caret = current.state.selection.from - current.state.selection.$from.start();
    return bracketSpot(parent.textContent ?? "", caret, false) != null;
  }

  function dropGhost(current: Editor) {
    ghostAbort.current?.abort();
    ghostToken.current += 1;
    if (ghostTimer.current != null) window.clearTimeout(ghostTimer.current);
    const marks = ghostKey.getState(current.state);
    if (!marks || marks.find().length === 0) return;
    showingGhost.current = true;
    current.view.dispatch(current.state.tr.setMeta(ghostKey, DecorationSet.empty));
    showingGhost.current = false;
  }

  function syncBracket(current: Editor) {
    const inCode = current.isActive("codeBlock");
    const parent = current.state.selection.$from.parent;
    const start = current.state.selection.$from.start();
    const caret = current.state.selection.from - start;
    const spot = parent.isTextblock ? bracketSpot(parent.textContent ?? "", caret, inCode) : null;
    const readySpot = spot?.state === "ready" ? spot : null;
    const isBusy = busyRef.current === "instruct";
    const signature = readySpot ? `${start + readySpot.end + 1}:${isBusy ? "1" : "0"}:${readySpot.prompt}` : "off";
    if (bracketSig.current === signature) return;
    bracketSig.current = signature;
    const blockFrom = current.state.selection.$from.before();
    const blockEnd = current.state.selection.$from.end();
    const decorations = readySpot
      ? bracketRunDecorations(current.state.doc, Math.min(start + readySpot.end + 1, blockEnd), {
          busy: isBusy,
          onRun: () => {
            editor?.chain().focus().setTextSelection(Math.min(blockFrom + 1, blockEnd)).run();
            void instructRef.current(readySpot.prompt);
          },
        })
      : DecorationSet.empty;
    placingBracket.current = true;
    current.view.dispatch(current.state.tr.setMeta(bracketRunKey, decorations));
    placingBracket.current = false;
  }

  function armGhost(current: Editor) {
    if (ghostTimer.current != null) window.clearTimeout(ghostTimer.current);
    if (insideBracket(current)) {
      dropGhost(current);
      return;
    }
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
    if (token !== ghostToken.current || !current.state.selection.empty || insideBracket(current)) return;
    const parent = current.state.selection.$from.parent;
    if (!parent.isTextblock) return;
    const start = current.state.selection.$from.start();
    const offset = current.state.selection.from - start;
    const before = parent.textBetween(0, offset, "\n", "\n");
    const after = parent.textBetween(offset, parent.content.size, "\n", "\n");
    if (!before.trim() && !after.trim()) return;
    ghostAbort.current?.abort();
    const controller = new AbortController();
    ghostAbort.current = controller;
    let response: Response;
    try {
      response = await fetch("/api/staff/ai-suggest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ mode: "continue", before, after, text: before, maskCount: 0 }),
      });
    } catch {
      return;
    }
    const data = (await response.json().catch(() => null)) as { text?: string } | null;
    if (token !== ghostToken.current || !data?.text || !current.state.selection.empty || insideBracket(current)) return;
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

  async function instruct(explicit?: string) {
    if (!editor || instructLock.current) return false;
    const parent = editor.state.selection.$from.parent;
    const text = parent.isTextblock ? parent.textContent ?? "" : "";
    const caret = editor.state.selection.from - editor.state.selection.$from.start();
    const fromBrackets = instruction.trim() ? null : bracketInstruction(text, caret);
    const prompt = explicit || instruction.trim() || fromBrackets || "";
    if (!prompt) {
      setSuggestError("Write an instruction, or put one in [brackets].");
      return true;
    }
    instructLock.current = true;
    busyRef.current = "instruct";
    setBusy("instruct");
    setSuggestError("");
    bracketSig.current = "";
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
      instructLock.current = false;
      busyRef.current = null;
      setBusy(null);
      bracketSig.current = "";
      if (editor) syncRef.current(editor);
    }
    return true;
  }

  useEffect(() => {
    instructRef.current = instruct;
    syncRef.current = syncBracket;
    busyRef.current = busy;
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

  useEffect(() => {
    const root = document.documentElement;
    const measure = () => {
      const header = document.querySelector(".course-site-header");
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      const toolbarHeight = toolbarRef.current?.getBoundingClientRect().height ?? 0;
      shellRef.current?.style.setProperty("--book-editor-stick", `${headerHeight}px`);
      root.style.scrollPaddingTop = `${headerHeight + toolbarHeight + 12}px`;
    };
    measure();
    const observer = new ResizeObserver(measure);
    const header = document.querySelector(".course-site-header");
    if (header) observer.observe(header);
    if (toolbarRef.current) observer.observe(toolbarRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      root.style.scrollPaddingTop = "";
    };
  }, [linkOpen, busy, suggestion, status]);

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

  function applyBlockStyle(style: string) {
    if (!editor) return;
    const range = styleSelection.current;
    const headingId = editor.getAttributes("heading").id;
    const id = typeof headingId === "string" && headingId ? headingId : null;
    let chain = editor.chain();
    if (range) chain = chain.setTextSelection(range);
    chain = chain.focus();
    const inCode = editor.isActive("codeBlock");
    if (style === "codeBlock") {
      if (!inCode) chain = chain.setCodeBlock();
    } else if (style === "paragraph") {
      if (inCode) chain = chain.toggleCodeBlock();
      else chain = chain.setParagraph();
    } else {
      const level = Number(style.slice(1));
      if (level < 1 || level > 6) return;
      if (inCode) chain = chain.toggleCodeBlock();
      chain = chain.setHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 });
      if (id) chain = chain.updateAttributes("heading", { id });
    }
    chain.run();
    setStyleOpen(false);
    setBlockStyle(style);
  }

  useEffect(() => {
    if (!styleOpen) return;
    toolbarRef.current?.querySelector<HTMLButtonElement>("[role='option'][aria-selected='true']")?.focus();
  }, [styleOpen]);

  const label =
    status === "saving" ? "Saving…" : status === "saved" ? "Saved" : status === "conflict" ? "Conflict" : status === "error" ? "Not saved" : "Draft";

  const ready = Boolean(editor);

  return (
    <div className="book-editor" ref={shellRef}>
      <p className="book-editor-banner">
        Chapter 1 is one saved document, not a document per section. Autosave does not change the public book at /book/ch1.
      </p>
      <div className="book-editor-toolbar" role="toolbar" aria-label="Formatting" ref={toolbarRef}>
        <div className="book-editor-group" role="group" aria-label="Text style">
          <ToolButton label="Bold" title="Bold" iconOnly pressed={editor?.isActive("bold")} disabled={!ready} onClick={() => editor?.chain().focus().toggleBold().run()}>
            <FaBold aria-hidden />
          </ToolButton>
          <ToolButton label="Italic" title="Italic" iconOnly pressed={editor?.isActive("italic")} disabled={!ready} onClick={() => editor?.chain().focus().toggleItalic().run()}>
            <FaItalic aria-hidden />
          </ToolButton>
          <ToolButton label="Underline" title="Underline" iconOnly pressed={editor?.isActive("underline")} disabled={!ready} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
            <FaUnderline aria-hidden />
          </ToolButton>
          <ToolButton label="Code" title="Inline code" pressed={editor?.isActive("code")} disabled={!ready} onClick={() => editor?.chain().focus().toggleCode().run()}>
            <FaCode aria-hidden />
          </ToolButton>
        </div>
        <div className="book-editor-group" role="group" aria-label="Structure">
          <div className="book-editor-style">
            <button
              type="button"
              className="book-editor-style-button"
              aria-haspopup="listbox"
              aria-expanded={styleOpen}
              aria-label={`Text style, ${styleLabel(blockStyle)}`}
              disabled={!ready}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                if (!editor) return;
                styleSelection.current = { from: editor.state.selection.from, to: editor.state.selection.to };
                setStyleOpen((open) => !open);
              }}
              onKeyDown={(event) => {
                if (event.key !== "ArrowDown" && event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                if (!editor) return;
                styleSelection.current = { from: editor.state.selection.from, to: editor.state.selection.to };
                setStyleOpen(true);
              }}
            >
              {styleLabel(blockStyle)}
            </button>
            {styleOpen ? (
              <ul
                role="listbox"
                aria-label="Text style"
                className="book-editor-style-menu"
                onKeyDown={(event) => {
                  const options = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("[role='option']")];
                  const index = options.indexOf(document.activeElement as HTMLButtonElement);
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    options[Math.min(index + 1, options.length - 1)]?.focus();
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    options[Math.max(index - 1, 0)]?.focus();
                  } else if (event.key === "Escape") {
                    event.preventDefault();
                    setStyleOpen(false);
                    event.currentTarget.parentElement?.querySelector<HTMLButtonElement>("button")?.focus();
                  }
                }}
              >
                {styleChoices(blockStyle).map(([value, name]) => (
                  <li key={value} role="none">
                    <button
                      type="button"
                      role="option"
                      aria-selected={value === blockStyle}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => applyBlockStyle(value)}
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <ToolButton label="Bullets" title="Bulleted list" iconOnly pressed={editor?.isActive("bulletList")} disabled={!ready} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
            <FaListUl aria-hidden />
          </ToolButton>
          <ToolButton label="Numbers" title="Numbered list" iconOnly pressed={editor?.isActive("orderedList")} disabled={!ready} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
            <FaListOl aria-hidden />
          </ToolButton>
        </div>
        <div className="book-editor-group" role="group" aria-label="Link">
          <ToolButton label="Link" title="Add or edit a link" pressed={linkOpen} disabled={!ready} onClick={() => setLinkOpen((open) => !open)}>
            <FaLink aria-hidden />
          </ToolButton>
        </div>
        <div className="book-editor-group" role="group" aria-label="Assistant">
          <ToolButton
            label={busy === "improve" ? "Improving" : "Improve"}
            title="Suggest edits for the selection"
            disabled={!ready || editor?.state.selection.empty || busy != null}
            busy={busy === "improve"}
            onClick={() => void improve()}
          >
            <HiSparkles aria-hidden />
          </ToolButton>
          <label className="book-editor-instruction">
            <span>Instruction</span>
            <input
              value={instruction}
              onChange={(event) => setInstruction(event.target.value)}
              placeholder="Write a paragraph or a list"
              aria-label="Instruction"
              disabled={busy != null}
            />
          </label>
          <ToolButton label={busy === "instruct" ? "Inserting" : "Insert"} title="Insert the instruction at the caret" disabled={!ready || busy != null} busy={busy === "instruct"} onClick={() => void instruct()}>
            <span aria-hidden className="book-editor-insert-mark">+</span>
          </ToolButton>
        </div>
        <div className="book-editor-group" role="group" aria-label="History">
          <ToolButton label="Restore" title="Restore the previous saved revision" disabled={!ready} onClick={() => void restoreLatest()}>
            <LuHistory aria-hidden />
          </ToolButton>
        </div>
        <p role="status" className="book-editor-status" data-save-status={status}>
          {label}. {message}
        </p>
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
      </div>
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
        .book-editor-toolbar, .book-editor-link { display: flex; flex-wrap: wrap; gap: 0.4rem 0.55rem; align-items: center; font-family: ui-sans-serif, system-ui, sans-serif; }
        .book-editor-toolbar { position: sticky; top: var(--book-editor-stick, 2.75rem); z-index: 40; margin: 0.5rem 0 0.75rem; padding: 0.45rem; border: 1px solid #e5e5e5; border-radius: 0.5rem; background: #fff; box-shadow: 0 1px 2px rgba(23, 23, 23, 0.04); }
        .book-editor-group { display: flex; flex-wrap: wrap; gap: 0.25rem; align-items: center; }
        .book-editor-group + .book-editor-group { padding-left: 0.55rem; border-left: 1px solid #e5e5e5; }
        .book-editor-tool, .book-editor-link button, .book-editor-suggestion button { position: relative; display: inline-flex; align-items: center; gap: 0.3rem; border: 1px solid transparent; background: transparent; border-radius: 0.35rem; padding: 0.28rem 0.45rem; font-size: 0.82rem; line-height: 1; color: #171717; }
        .book-editor-tool-label-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
        .book-editor-tool:hover, .book-editor-link button:hover, .book-editor-suggestion button:hover { background: #f5f5f5; }
        .book-editor-tool[aria-pressed="true"] { background: #f5f5f5; border-color: #d4d4d4; }
        .book-editor-tool:focus-visible, .book-editor-toolbar input:focus-visible, .book-editor-link button:focus-visible { outline: 2px solid #171717; outline-offset: 2px; }
        .book-editor-tool:disabled { opacity: 0.4; }
        .book-editor-tool[aria-busy="true"] { opacity: 0.7; }
        .book-editor-instruction { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; color: #525252; }
        .book-editor-toolbar input, .book-editor-link input { border: 1px solid #e5e5e5; border-radius: 0.35rem; padding: 0.28rem 0.4rem; min-width: 10rem; background: #fff; }
        .book-editor-insert-mark { font-weight: 600; }
        .book-editor-status { flex-basis: 100%; margin: 0; color: #525252; font-size: 0.75rem; }
        .book-editor-banner, .book-editor-inventory { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 0.85rem; color: #404040; }
        .book-editor-style { position: relative; }
        .book-editor-style-button { min-width: 7.5rem; border: 1px solid #e5e5e5; background: #fff; border-radius: 0.35rem; padding: 0.28rem 0.55rem; font: inherit; font-size: 0.82rem; text-align: left; color: #171717; }
        .book-editor-style-button:focus-visible, .book-editor-style-menu button:focus-visible { outline: 2px solid #171717; outline-offset: 2px; }
        .book-editor-style-button:disabled { opacity: 0.4; }
        .book-editor-style-menu { position: absolute; z-index: 5; top: calc(100% + 0.25rem); left: 0; margin: 0; padding: 0.25rem; list-style: none; min-width: 9.5rem; background: #fff; border: 1px solid #e5e5e5; border-radius: 0.4rem; box-shadow: 0 8px 20px rgba(23, 23, 23, 0.08); }
        .book-editor-style-menu button { display: block; width: 100%; text-align: left; border: 0; background: transparent; border-radius: 0.3rem; padding: 0.35rem 0.5rem; font: inherit; font-size: 0.85rem; color: #171717; }
        .book-editor-style-menu button[aria-selected="true"], .book-editor-style-menu button:hover { background: #f5f5f5; }
        .book-editor-document { outline: none; min-height: 50vh; }
        .book-editor-document u { text-decoration: underline; }
        .book-bracket-run { display: inline-flex; align-items: center; justify-content: center; min-width: 2.75rem; min-height: 2.75rem; margin: 0 0.2rem; vertical-align: middle; border: 1px solid #171717; border-radius: 999px; background: #171717; color: #fff; font: 1rem/1 ui-sans-serif, system-ui, sans-serif; }
        .book-bracket-run:focus-visible { outline: 2px solid #171717; outline-offset: 2px; }
        .book-bracket-run:disabled { opacity: 0.45; }
        @media (max-width: 40rem) {
          .book-editor-group + .book-editor-group { padding-left: 0; border-left: 0; }
          .book-editor-tool-label { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
        }
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

function readBlockStyle(current: Editor): string {
  if (current.isActive("codeBlock")) return "codeBlock";
  if (current.isActive("heading")) {
    const level = Number(current.getAttributes("heading").level) || 1;
    return `h${level}`;
  }
  return "paragraph";
}

function styleLabel(style: string): string {
  if (style === "codeBlock") return "Code block";
  if (style === "paragraph") return "Paragraph";
  if (/^h\d$/.test(style)) return `Heading ${style.slice(1)}`;
  return "Paragraph";
}

function styleChoices(current: string): [string, string][] {
  const choices: [string, string][] = [
    ["paragraph", "Paragraph"],
    ["h1", "Heading 1"],
    ["h2", "Heading 2"],
    ["h3", "Heading 3"],
    ["codeBlock", "Code block"],
  ];
  if (/^h[4-6]$/.test(current)) choices.splice(4, 0, [current, `Heading ${current.slice(1)}`]);
  return choices;
}

function ToolButton({
  label,
  title,
  iconOnly = false,
  pressed,
  disabled,
  busy,
  onClick,
  children,
}: {
  label: string;
  title: string;
  iconOnly?: boolean;
  pressed?: boolean;
  disabled?: boolean;
  busy?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className="book-editor-tool"
      title={title}
      aria-label={label}
      aria-pressed={pressed}
      aria-busy={busy || undefined}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
      <span className={iconOnly ? "book-editor-tool-label book-editor-tool-label-hidden" : "book-editor-tool-label"}>{label}</span>
    </button>
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
