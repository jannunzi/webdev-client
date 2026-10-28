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
    title: "Add module name field and close button",
    kind: "content",
    code: `  return (
    <div id="wd-add-module-dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <h3 className="m-0 text-lg font-semibold">{dialogTitle}</h3>
          <button type="button" className="text-2xl leading-none text-neutral-500" aria-label="Close"
            onClick={handleClose} >
            ×
          </button>
        </div>
        <div className="px-4 py-3">
          <input value={moduleName} id="wd-add-module-name" placeholder="Module name" className="w-full rounded border border-neutral-300 px-3 py-1.5"
            onChange={(e) => setModuleName(e.target.value)} />
        </div>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/ModuleEditor.tsx",
    codeStartLine: 19,
  },
  {
    id: "editor-part-3",
    title: "Add Cancel and Add Module buttons",
    kind: "content",
    code: `        <div className="flex justify-end gap-2 border-t border-neutral-200 px-4 py-3">
          <button id="wd-add-module-cancel" type="button" className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm"
            onClick={handleClose} >
            Cancel
          </button>
          <button id="wd-add-module-submit" type="button" className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
            onClick={() => {
              addModule();
              handleClose();
            }} >
            Add Module
          </button>
        </div>
      </div>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/ModuleEditor.tsx",
    codeStartLine: 33,
    codeHighlightLines: [7, 8],
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
    title: "+ Module opens the dialog (1/3)",
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
    title: "Collapse All, View Progress, Publish All",
    kind: "content",
    code: `  return (
    <div id="wd-modules-controls" className="mb-3 flex flex-wrap items-center gap-2">
      <button type="button" className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm">
        Collapse All
      </button>
      <button type="button" className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm">
        View Progress
      </button>
      <select defaultValue="publish-all" className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm">
        <option value="publish-all">Publish All</option>
        <option value="unpublish-all">Unpublish All</option>
      </select>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/ModulesControls.tsx",
    codeStartLine: 19,
  },
  {
    id: "controls-part-3",
    title: "+ Module button opens the dialog",
    kind: "content",
    code: `      <button id="wd-add-module-btn" type="button" className="inline-flex items-center gap-1 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
        onClick={handleShow} >
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
    codeStartLine: 31,
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
    embed: "kambaz-ch4-module-row",
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
  moduleId, deleteModule, editModule,
}: {
  moduleId: string; deleteModule: (moduleId: string) => void; editModule: (moduleId: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <FaPencilAlt title="Edit module" className="cursor-pointer text-blue-600"
        onClick={() => editModule(moduleId)} />
      <FaTrash title="Delete module" className="cursor-pointer text-red-600"
        onClick={() => deleteModule(moduleId)} />
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
    id: "green-checkmark",
    title: "GreenCheckmark (repeat from Chapter 2)",
    kind: "content",
    bullets: [
      "`ModuleControlButtons` imports it — same file as Chapter 2",
      "Stack `FaCheckCircle` on `FaCircle` — green on white",
    ],
    code: `import { FaCheckCircle, FaCircle } from "react-icons/fa";

export default function GreenCheckmark() {
  return (
    <span className="relative me-1 inline-flex">
      <FaCheckCircle
        className="absolute text-xl text-green-600"
        style={{ top: "2px" }}
      />
      <FaCircle className="text-base text-white" />
    </span>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/GreenCheckmark.tsx",
  },
  {
    id: "module",
    title: "Module takes a title node and extra",
    kind: "content",
    bullets: [
      "`title` is a `ReactNode`, so it can be the name or an input",
      "`extra` holds the control buttons; no extra shows the checkmark",
    ],
    code: `import type { ReactNode } from "react";
import GreenCheckmark from "./GreenCheckmark";

export default function Module({
  title,
  extra,
  children,
}: {
  title: ReactNode;
  extra?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <li className="wd-module mb-5 overflow-hidden border border-neutral-400 p-0 text-xl">
      <div className="wd-title flex items-center justify-between bg-neutral-200 p-3 ps-2">
        <span className="min-w-0 flex-1">{title}</span>
        <span className="ms-2 flex items-center gap-2">
          {extra}
          {!extra ? <GreenCheckmark /> : null}
        </span>
      </div>
      <ul className="wd-lessons m-0 list-none p-0">{children}</ul>
    </li>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/Module.tsx",
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
      "Read `modules` and the CRUD actions from `useModulesStore`",
      "`editModule` sets `editing: true`; the title swaps the name for an input",
      "Each `onChange` calls `updateModule`; Enter sets `editing` back to false",
    ],
  },
  {
    id: "page",
    title: "Modules page wires the store (1/2)",
    kind: "content",
    code: `"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Module from "./Module";
import Lesson from "./Lesson";
import ModuleControlButtons from "./ModuleControlButtons";
import ModulesControls from "./ModulesControls";
import { useModulesStore } from "../../../store/modulesStore";

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const modules = useModulesStore((state) => state.modules);
  const addModule = useModulesStore((state) => state.addModule);
  const deleteModule = useModulesStore((state) => state.deleteModule);
  const updateModule = useModulesStore((state) => state.updateModule);
  const editModule = useModulesStore((state) => state.editModule);
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
      <ModulesControls
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={() => {
          addModule({ name: moduleName, course: String(cid) });
          setModuleName("");
        }}
      />
      <ul id="wd-modules" className="m-0 list-none p-0">
        {modules
          .filter((module) => module.course === cid)
          .map((module) => (
            <Module
              key={module._id}
              extra={
                <ModuleControlButtons
                  moduleId={module._id}
                  deleteModule={deleteModule}
                  editModule={editModule}
                />
              }
              title={
                module.editing ? (
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
                )
              }
            >
              {module.lessons?.map((lesson) => (
                <Lesson key={lesson._id} title={lesson.name} />
              ))}
            </Module>
          ))}
      </ul>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/modules/page.tsx",
    codeStartLine: 20,
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
