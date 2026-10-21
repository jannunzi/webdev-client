import type { LectureSlide } from "../types";

export const KAMBAZ_MODULES_STORE_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · A Modules Store",
      "§4.10.4 · dialog first, then share the array",
    ],
  },
  {
    id: "purpose",
    title: "Home embeds Modules",
    kind: "content",
    bullets: [
      "Local `useState` on Modules would hide new rows from Home",
      "Prove the dialog and row buttons locally, then move the array",
      "Zustand again — no parent of both screens has to own the list",
    ],
  },
  {
    id: "editor-intro",
    title: "ModuleEditor is a controlled dialog",
    kind: "content",
    bullets: [
      "`show === false` returns `null` — the overlay is not in the document",
      "`moduleName` / `setModuleName` is a string draft — §4.2.6",
      "Add Module calls `addModule()` then `handleClose()`. Cancel only closes",
    ],
  },
  {
    id: "editor",
    title: "ModuleEditor is a controlled dialog (code)",
    kind: "content",
    code: `export default function ModuleEditor({
  show,
  handleClose,
  dialogTitle,
  moduleName,
  setModuleName,
  addModule,
}: {
  show: boolean;
  handleClose: () => void;
  dialogTitle: string;
  moduleName: string;
  setModuleName: (name: string) => void;
  addModule: () => void;
}) {
  if (!show) return null;
  return (
    <div id="wd-add-module-dialog">
      <input
        value={moduleName}
        onChange={(e) => setModuleName(e.target.value)}
        id="wd-add-module-name"
      />
      <button type="button" onClick={handleClose} id="wd-add-module-cancel">
        Cancel
      </button>
      <button
        type="button"
        onClick={() => {
          addModule();
          handleClose();
        }}
        id="wd-add-module-submit"
      >
        Add Module
      </button>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/ModuleEditor.tsx",
    codeHighlightLines: [16, [20, 21], [29, 32]],
  },
  {
    id: "store-intro",
    title: "modulesStore is the shared list",
    kind: "content",
    bullets: [
      "Seed from `modules.json`. `addModule` takes `{ name, course }`",
      "`editModule` sets `editing: true` so the row becomes an input",
      "`updateModule` / `deleteModule` map and filter like courses",
    ],
  },
  {
    id: "store",
    title: "modulesStore is the shared list (code)",
    kind: "content",
    code: `"use client";

import { create } from "zustand";
import modulesJson from "../database/modules.json";

export type CourseModule = {
  _id: string;
  name: string;
  description: string;
  course: string;
  lessons?: { _id: string; name: string; description: string; module: string }[];
  editing?: boolean;
};

export const useModulesStore = create<{
  modules: CourseModule[];
  addModule: (module: { name: string; course: string }) => void;
  deleteModule: (moduleId: string) => void;
  updateModule: (module: CourseModule) => void;
  editModule: (moduleId: string) => void;
}>((set) => ({
  modules: modulesJson as CourseModule[],
  addModule: (module) =>
    set((state) => ({
      modules: [
        ...state.modules,
        {
          _id: crypto.randomUUID(),
          name: module.name,
          description: "",
          course: module.course,
          lessons: [],
        },
      ],
    })),
  deleteModule: (moduleId) =>
    set((state) => ({
      modules: state.modules.filter((m) => m._id !== moduleId),
    })),
  updateModule: (module) =>
    set((state) => ({
      modules: state.modules.map((m) => (m._id === module._id ? module : m)),
    })),
  editModule: (moduleId) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m._id === moduleId ? { ...m, editing: true } : m,
      ),
    })),
}));`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/store/modulesStore.ts",
    codeHighlightLines: [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 44, 45, 46, 47, 48, 49],
  },
  {
    id: "store-live",
    title: "Modules still look like Chapter 2",
    kind: "demo",
    bullets: [
      "Reuse the list-group chrome. The new work is the dialog and the store",
      "Filter `module.course === cid` the same way §3.9.7 did",
      "Home imports the Modules page — both screens now see the same array",
    ],
    embed: "kambaz-styled-modules",
  },
  {
    id: "recap",
    title: "Modules store recap",
    kind: "content",
    bullets: [
      "Dialog = local `show` + `moduleName`. List = Zustand",
      "`editing` on a row turns the title into a controlled input",
      "Courses and modules: two stores, same CRUD verbs",
    ],
  },
  {
    id: "next-up",
    title: "Next: account context",
    kind: "title",
    bullets: [
      "Who is signed in is a stable tree value — Context, not Zustand",
      "§4.10.5: `AccountProvider` around the Kambaz layout",
    ],
  },
];
