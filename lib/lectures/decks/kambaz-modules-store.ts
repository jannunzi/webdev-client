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
    title: "ModuleEditor is a controlled dialog (1/2)",
    kind: "content",
    code: `"use client";

export default function ModuleEditor({
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
  if (!show) return null;`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/ModuleEditor.tsx",
    codeHighlightLines: [18],
  },
  {
    id: "editor-part-2",
    title: "ModuleEditor is a controlled dialog (2/2)",
    kind: "content",
    code: `  return (
    <div id="wd-add-module-dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <h3 className="m-0 text-lg font-semibold">{dialogTitle}</h3>
          <button type="button" onClick={handleClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="px-4 py-3">
          <input value={moduleName} id="wd-add-module-name" className="w-full rounded border border-neutral-300 px-3 py-1.5"
            onChange={(e) => setModuleName(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 border-t border-neutral-200 px-4 py-3">
          <button type="button" onClick={handleClose} id="wd-add-module-cancel">
            Cancel
          </button>
          <button type="button" id="wd-add-module-submit"
            onClick={() => {
              addModule();
              handleClose();
            }}>
            Add Module
          </button>
        </div>
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/ModuleEditor.tsx",
    codeStartLine: 19,
    codeHighlightLines: [16, 17, 27, 28, 29, 30],
  },
  {
    id: "controls-intro",
    title: "+ Module opens the dialog",
    kind: "content",
    bullets: [
      "`ModulesControls` already has Collapse All, View Progress, Publish All",
      "It owns only `show`: + Module sets it true, Cancel or × sets it false",
      "`moduleName`, `setModuleName`, `addModule` come down from Modules",
      "Modules appends `{ name: moduleName, course: courseId }`",
      "After Add Module, `setModuleName(\"\")` so the next open starts blank",
    ],
  },
  {
    id: "controls",
    title: "+ Module opens the dialog (1/2)",
    kind: "content",
    code: `"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import ModuleEditor from "./ModuleEditor";

export default function ModulesControls({
  moduleName,
  setModuleName,
  addModule,
}: {
  moduleName: string;
  setModuleName: (title: string) => void;
  addModule: () => void;
}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/ModulesControls.tsx",
  },
  {
    id: "controls-part-2",
    title: "+ Module opens the dialog (2/2)",
    kind: "content",
    code: `  return (
    <div id="wd-modules-controls" className="mb-3 flex flex-wrap items-center gap-2">
      {/* Collapse All, View Progress, Publish All */}
      <button
        type="button"
        id="wd-add-module-btn"
        onClick={handleShow}
        className="inline-flex items-center gap-1 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        <FaPlus /> Module
      </button>
      <ModuleEditor
        show={show}
        handleClose={handleClose}
        dialogTitle="Add Module"
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={addModule}
      />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/ModulesControls.tsx",
    codeStartLine: 19,
  },
  {
    id: "buttons-intro",
    title: "Trash and pencil on each module row",
    kind: "content",
    bullets: [
      "Add a red trash can to `ModuleControlButtons`",
      "Pass `deleteModule` and the row's `moduleId`",
      "`deleteModule` filters by `_id`, like `deleteCourse` on the Dashboard",
      "The pencil calls `editModule` — wired up in §4.10.4.3",
      "Deleting a module removes its nested lessons too",
    ],
  },
  {
    id: "buttons",
    title: "Trash and pencil on each module row (code)",
    kind: "content",
    code: `import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";

export default function ModuleControlButtons({
  moduleId,
  deleteModule,
  editModule,
}: {
  moduleId: string;
  deleteModule: (moduleId: string) => void;
  editModule: (moduleId: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <FaPencilAlt
        className="cursor-pointer text-blue-600"
        onClick={() => editModule(moduleId)}
      />
      <FaTrash
        className="cursor-pointer text-red-600"
        onClick={() => deleteModule(moduleId)}
      />
      <GreenCheckmark />
      <BsPlus className="text-3xl" />
      <IoEllipsisVertical className="text-xl" />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/ModuleControlButtons.tsx",
  },
  {
    id: "title-edit-intro",
    title: "Edit swaps the name for an input",
    kind: "content",
    bullets: [
      "`editModule` maps the array and sets `editing: true` on the matching id",
      "`updateModule` replaces the module object with the same `_id`",
      "`editing` false: show the name. True: show an input",
      "Each `onChange` spreads the module and overwrites `name`",
      "Enter sets `editing` back to false",
    ],
  },
  {
    id: "title-edit",
    title: "Edit swaps the name for an input (code)",
    kind: "content",
    code: `title={
  module.editing ? (
    <input
      className="w-1/2 rounded border border-neutral-300 px-2 py-1 text-base"
      defaultValue={module.name}
      onChange={(e) => updateModule({ ...module, name: e.target.value })}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          updateModule({ ...module, editing: false });
        }
      }}
    />
  ) : (
    module.name
  )
}`,
    codeLanguage: "tsx",
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
    title: "modulesStore is the shared list (1/2)",
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
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/store/modulesStore.ts",
  },
  {
    id: "store-part-2",
    title: "modulesStore is the shared list (2/2)",
    kind: "content",
    code: `  modules: modulesJson as CourseModule[],
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
    codeStartLine: 22,
    codeHighlightLines: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 23, 24, 25, 26, 27, 28],
  },
  {
    id: "store-live",
    title: "Modules still look like Chapter 2",
    kind: "demo",
    bullets: [
      "Reuse the list-group chrome. The new work is the dialog and the store",
      "Filter `module.course === cid` the same way §3.10.7 did",
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
