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
    title: "ModuleEditor owns its dialog",
    kind: "content",
    bullets: [
      "No props: it renders the red + Module button and the dialog",
      "It owns `show` and the `moduleName` draft (§4.2.6); `cid` from `useParams`",
      "Add Module calls the store's `addModule`, clears the draft, then closes",
    ],
  },
  {
    id: "editor",
    title: "ModuleEditor owns its dialog (1/3)",
    kind: "content",
    code: `import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useParams } from "next/navigation";
import { useModulesStore } from "../../../store/modulesStore";

export default function ModuleEditor() {
  const { cid } = useParams();
  const [show, setShow] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const addModule = useModulesStore((state) => state.addModule);
  return (
    <>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded border border-red-600 bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
        id="wd-add-module-btn"
        onClick={() => setShow(true)}
      >
        <FaPlus /> Module
      </button>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/ModuleEditor.tsx",
    codeHighlightLines: [[6, 10], 17],
  },
  {
    id: "editor-part-2",
    title: "ModuleEditor owns its dialog (2/3)",
    kind: "content",
    code: `      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          id="wd-add-module-dialog"
        >
          <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
              <h3 className="m-0 text-lg font-semibold">Add Module</h3>
              <button
                type="button"
                onClick={() => setShow(false)}
                className="text-2xl leading-none text-neutral-500"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="px-4 py-3">
              <input
                className="w-full rounded border border-neutral-300 px-3 py-1.5"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                id="wd-add-module-name"
                placeholder="Module name"
              />
            </div>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/ModuleEditor.tsx",
    codeStartLine: 21,
    codeHighlightLines: [1, 11, 22],
  },
  {
    id: "editor-part-3",
    title: "ModuleEditor owns its dialog (3/3)",
    kind: "content",
    code: `            <div className="flex justify-end gap-2 border-t border-neutral-200 px-4 py-3">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm"
                id="wd-add-module-cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  addModule({ name: moduleName, course: String(cid) });
                  setModuleName("");
                  setShow(false);
                }}
                className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
                id="wd-add-module-submit"
              >
                Add Module
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/ModuleEditor.tsx",
    codeStartLine: 47,
    codeHighlightLines: [[12, 16]],
  },
  {
    id: "controls-intro",
    title: "ModulesControls is the toolbar",
    kind: "content",
    bullets: [
      "`ModulesControls` already has Collapse All, View Progress, Publish All",
      "No props and no state: it just renders `<ModuleEditor />` last",
      "`ModuleEditor` brings its own + Module button, dialog and store call",
    ],
    embed: "kambaz-ch4-modules-controls",
  },
  {
    id: "controls",
    title: "ModulesControls is the toolbar (1/2)",
    kind: "content",
    code: `import ModuleEditor from "./ModuleEditor";

export default function ModulesControls() {
  return (
    <div id="wd-modules-controls" className="mb-3 flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm"
      >
        Collapse All
      </button>
      <button
        type="button"
        className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm"
      >
        View Progress
      </button>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/ModulesControls.tsx",
    codeHighlightLines: [1, 3],
  },
  {
    id: "controls-part-2",
    title: "ModulesControls is the toolbar (2/2)",
    kind: "content",
    code: `      <select
        defaultValue="publish-all"
        className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm"
      >
        <option value="publish-all">Publish All</option>
        <option value="unpublish-all">Unpublish All</option>
      </select>
      <ModuleEditor />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/ModulesControls.tsx",
    codeStartLine: 18,
    codeHighlightLines: [8],
  },
  {
    id: "buttons-intro",
    title: "Trash and pencil on each module row",
    kind: "content",
    bullets: [
      "Add a red trash can to `ModuleControlButtons`",
      "Only `moduleId` is a prop; `deleteModule` / `editModule` come from the store",
      "`deleteModule` filters by `_id`, like `deleteCourse` on the Dashboard",
      "The pencil calls `editModule` — wired up in §4.10.4.3",
      "Deleting a module removes its nested lessons too",
    ],
    embed: "kambaz-ch4-module-row",
  },
  {
    id: "buttons",
    title: "Trash and pencil on each module row (code)",
    kind: "content",
    code: `import { FaCheckCircle, FaPencilAlt, FaTrash } from "react-icons/fa";
import { BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { useModulesStore } from "../../../store/modulesStore";

export default function ModuleControlButtons({
  moduleId,
}: {
  moduleId: string;
}) {
  const deleteModule = useModulesStore((state) => state.deleteModule);
  const editModule = useModulesStore((state) => state.editModule);
  return (
    <div className="flex items-center gap-2">
      <FaPencilAlt
        className="cursor-pointer text-blue-600"
        onClick={() => editModule(moduleId)}
        title="Edit module"
      />
      <FaTrash
        className="cursor-pointer text-red-600"
        onClick={() => deleteModule(moduleId)}
        title="Delete module"
      />
      <FaCheckCircle className="text-green-600" />
      <BsPlus className="text-3xl" />
      <IoEllipsisVertical className="text-xl" />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/ModuleControlButtons.tsx",
  },
  {
    id: "module",
    title: "Module takes one module prop",
    kind: "content",
    bullets: [
      "One `module` prop; it selects `updateModule` from the store itself",
      "`module.editing` swaps the name for an input; Enter saves",
      "Renders `ModuleControlButtons` and maps `lessons` to `Lesson`",
    ],
    code: `import ModuleControlButtons from "./ModuleControlButtons";
import Lesson from "./Lesson";
import { useModulesStore, type CourseModule } from "../../../store/modulesStore";

export default function Module({ module }: { module: CourseModule }) {
  const updateModule = useModulesStore((state) => state.updateModule);
  return (
    <li className="wd-module mb-5 overflow-hidden border border-neutral-400 p-0 text-xl">
      <div className="wd-title flex items-center justify-between bg-neutral-200 p-3 ps-2">`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/Module.tsx",
    codeHighlightLines: [5, 6],
  },
  {
    id: "module-part-2",
    title: "Name or a rename input",
    kind: "content",
    code: `        <span className="min-w-0 flex-1">
          {module.editing ? (
            <input
              className="w-1/2 rounded border border-neutral-300 px-2 py-1 text-base"
              defaultValue={module.name}
              onChange={(e) =>
                updateModule({ ...module, name: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateModule({ ...module, editing: false });
                }
              }}
            />
          ) : (
            module.name
          )}
        </span>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/Module.tsx",
    codeStartLine: 10,
    codeHighlightLines: [2, 7, 11],
  },
  {
    id: "module-part-3",
    title: "Control buttons and lessons",
    kind: "content",
    code: `        <span className="ms-2 flex items-center gap-2">
          <ModuleControlButtons moduleId={module._id} />
        </span>
      </div>
      <ul className="wd-lessons m-0 list-none p-0">
        {module.lessons?.map((lesson) => (
          <Lesson key={lesson._id} title={lesson.name} />
        ))}
      </ul>
    </li>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/Module.tsx",
    codeStartLine: 28,
    codeHighlightLines: [2, [6, 8]],
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
    title: "modulesStore is the shared list (1/3)",
    kind: "content",
    code: `"use client";

import { create } from "zustand";
import modulesJson from "../database/modules.json";

export type Lesson = {
  _id: string;
  name: string;
  description: string;
  module: string;
};

export type CourseModule = {
  _id: string;
  name: string;
  description: string;
  course: string;
  lessons?: Lesson[];
  editing?: boolean;
};

type ModulesStore = {
  modules: CourseModule[];
  addModule: (module: { name: string; course: string }) => void;
  deleteModule: (moduleId: string) => void;
  updateModule: (module: CourseModule) => void;
  editModule: (moduleId: string) => void;
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/store/modulesStore.ts",
  },
  {
    id: "store-part-2",
    title: "modulesStore is the shared list (2/3)",
    kind: "content",
    code: `export const useModulesStore = create<ModulesStore>((set) => ({
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
    })),`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/store/modulesStore.ts",
    codeStartLine: 30,
    codeHighlightLines: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  },
  {
    id: "store-part-3",
    title: "modulesStore is the shared list (3/3)",
    kind: "content",
    code: `  deleteModule: (moduleId) =>
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
    codeStartLine: 45,
    codeHighlightLines: [9, 10, 11, 12, 13, 14],
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
    id: "page-intro",
    title: "Modules page wires the store",
    kind: "content",
    bullets: [
      "Only `modules` comes from `useModulesStore` here",
      "Children read their own actions — no `moduleName` state, no action props",
      "Filter by `cid`, then `<Module key={module._id} module={module} />`",
    ],
  },
  {
    id: "page",
    title: "Modules page wires the store (1/2)",
    kind: "content",
    code: `"use client";

import { useParams } from "next/navigation";
import Module from "./Module";
import ModulesControls from "./ModulesControls";
import { useModulesStore } from "../../../store/modulesStore";

export default function Modules() {
  const { cid } = useParams();
  const modules = useModulesStore((state) => state.modules);
`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
  },
  {
    id: "page-part-2",
    title: "Modules page wires the store (2/2)",
    kind: "content",
    code: `  return (
    <div className="wd-modules">
      <ModulesControls />
      <ul id="wd-modules" className="m-0 list-none p-0">
        {modules
          .filter((module) => module.course === cid)
          .map((module) => (
            <Module key={module._id} module={module} />
          ))}
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeStartLine: 12,
  },
  {
    id: "page-live",
    title: "Modules page demo",
    kind: "demo",
    bullets: [
      "+ Module adds a module to this course",
      "The pencil renames it. Enter saves",
      "The trash can deletes it",
    ],
    embed: "kambaz-ch4-modules",
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
