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
    title: "Implementing Module State Management",
    kind: "content",
    bullets: [
      "Modules are application state: the Modules and Home screens both show them",
      "Users will add, rename and delete modules, and both screens must re-render",
      "First keep the module list in a shared Zustand store, like the courses",
      "Then build a dialog that collects a new module's name",
    ],
  },
  {
    id: "store-intro",
    title: "Planning a Modules Store",
    kind: "content",
    bullets: [
      "Goal: one shared list of modules that both screens read and change",
      "It starts with the modules in `modules.json`",
      "Actions add, delete and update a module, and mark one as being renamed",
      "The next three slides build this store in parts",
    ],
  },
  {
    id: "store",
    title: "Lesson, CourseModule and store types",
    kind: "content",
    code: `"use client";

import { create } from "zustand";
import modulesJson from "../database/modules.json";

export type Lesson = {
  _id: string;   name: string;   description: string;   module: string;
};

export type CourseModule = {
  _id: string;      name: string;         description: string;
  course: string;   lessons?: Lesson[];   editing?: boolean;
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
    title: "Seed modules and addModule",
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
    title: "delete, update and editModule",
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
    title: "Modules Styling Is Unchanged",
    kind: "demo",
    bullets: [
      "Reuse the list-group chrome. The store is in place; the dialog comes next",
      "Filter `module.course === cid` the same way §3.10.7 did",
      "Home imports the Modules page — both screens now see the same array",
    ],
    embed: "kambaz-styled-modules",
  },
  {
    id: "editor-intro",
    title: "Planning the Add Module Dialog",
    kind: "content",
    bullets: [
      "Goal: a red + Module button that opens a dialog asking for a module name",
      "The dialog keeps its own open or closed flag and the name being typed",
      "Saving adds the module to the current course's list, then closes the dialog",
    ],
    // Bullets keep normal slide text size; an embed otherwise makes it dense.
    density: "spacious",
    embed: "kambaz-ch4-module-editor",
  },
  {
    id: "editor",
    title: "State and the + Module button",
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
    title: "Dialog header and name input",
    kind: "content",
    code: `      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          id="wd-add-module-dialog"
        >
          <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
              <h3 className="m-0 text-lg font-semibold">Add Module</h3>
              <button type="button" aria-label="Close" className="text-2xl leading-none text-neutral-500"
                onClick={() => setShow(false)} >
                ×
              </button>
            </div>
            <div className="px-4 py-3">
              <input value={moduleName} placeholder="Module name" id="wd-add-module-name" className="w-full rounded border border-neutral-300 px-3 py-1.5"
                onChange={(e) => setModuleName(e.target.value)} />
            </div>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/ModuleEditor.tsx",
    codeStartLine: 21,
    codeHighlightLines: [1, 11, 22],
  },
  {
    id: "editor-part-3",
    title: "Cancel and Add Module buttons",
    kind: "content",
    code: `            <div className="flex justify-end gap-2 border-t border-neutral-200 px-4 py-3">
              <button type="button" id="wd-add-module-cancel" className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm"
                onClick={() => setShow(false)} >
                Cancel
              </button>
              <button type="button" id="wd-add-module-submit" className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
                onClick={() => {
                  addModule({ name: moduleName, course: String(cid) });
                  setModuleName("");
                  setShow(false);
                }} >
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
    title: "Adding the Dialog to the Toolbar",
    kind: "content",
    bullets: [
      "The Modules screen has a toolbar of buttons above the module list",
      "The new dialog's + Module button belongs at the end of that toolbar",
      "The next two slides show the toolbar, `ModulesControls`, with it added",
    ],
    density: "spacious",
    embed: "kambaz-ch4-modules-controls",
  },
  {
    id: "controls",
    title: "Collapse All and View Progress",
    kind: "content",
    code: `import ModuleEditor from "./ModuleEditor";

export default function ModulesControls() {
  return (
    <div id="wd-modules-controls" className="mb-3 flex flex-wrap items-center gap-2">
      <button type="button" className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm" >
        Collapse All
      </button>
      <button type="button" className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm" >
        View Progress
      </button>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/ModulesControls.tsx",
    codeHighlightLines: [1, 3],
  },
  {
    id: "controls-part-2",
    title: "Publish All select and ModuleEditor",
    kind: "content",
    code: `      <select defaultValue="publish-all" className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm" >
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
    title: "Delete and Rename Buttons on a Row",
    kind: "content",
    bullets: [
      "Each module row needs a way to delete it and a way to rename it",
      "Goal: a red trash can and a pencil next to the row's existing buttons",
      "Deleting a module also removes the lessons inside it",
      "The next slide adds both icons to the row's button group",
    ],
    density: "spacious",
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

export default function ModuleControlButtons({ moduleId }: { moduleId: string }) {
  const deleteModule = useModulesStore((state) => state.deleteModule);
  const editModule = useModulesStore((state) => state.editModule);
  return (
    <div className="flex items-center gap-2">
      <FaPencilAlt title="Edit module" className="cursor-pointer text-blue-600"
        onClick={() => editModule(moduleId)} />
      <FaTrash title="Delete module" className="cursor-pointer text-red-600"
        onClick={() => deleteModule(moduleId)} />
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
    title: "Showing One Module Row",
    kind: "content",
    bullets: [
      "A module row shows its name, its buttons and its lessons",
      "To rename, the name becomes a text input; Enter saves it",
      "The next three slides show this row component, `Module`, in parts",
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
            <input defaultValue={module.name} className="w-1/2 rounded border border-neutral-300 px-2 py-1 text-base"
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
    id: "page-intro",
    title: "Reading Modules from the Store",
    kind: "content",
    bullets: [
      "The Modules screen now reads its list from the shared store",
      "It shows only the modules of the course in the URL",
      "Each row and the toolbar handle their own actions, so it passes no callbacks",
      "The next two slides show the updated Modules screen",
    ],
  },
  {
    id: "page",
    title: "Read cid and modules from the store",
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
    title: "Controls plus one Module per module",
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
