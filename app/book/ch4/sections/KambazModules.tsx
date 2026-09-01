import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import BookFigure from "../../components/BookFigure";
import FigureLink from "../../components/FigureLink";
import { OnYourOwn, WithAI } from "../../components/Practice";
import Link from "next/link";

export default function KambazModules() {
  return (
    <Section
      level={3}
      id="sec-4-10-4"
      title="4.10.4 Adding State to the Modules Screen"
    >
      <p>
        Modules have the same job courses had: create, rename, and remove
        items, then share that list with Home, which already embeds the
        Modules page. The walkthrough below starts from the list you
        already have, adds a dialog for new names, puts trash and pencil
        on each row, and finishes with a Zustand store so Home sees the
        same array. Reuse the HTML and CSS
        from earlier chapters for the list itself — the screenshots show
        the target controls, not a new visual language.
      </p>

      <Section
        level={3}
        id="sec-4-10-4-1"
        title="4.10.4.1 Creating a Module"
      >
        <p>
          Clicking the red + Module button should open a dialog where you
          type a name and confirm. That is a small piece of UI state: a{" "}
          <code>show</code>{" "}boolean plus the draft{" "}
          <code>moduleName</code> string. Create{" "}
          <code>ModuleEditor.tsx</code>{" "}as a dialog with the same props
          the PDF used for Bootstrap&apos;s <code>Modal</code> —{" "}
          <code>show</code>, <code>handleClose</code>,{" "}
          <code>dialogTitle</code>, <code>moduleName</code>,{" "}
          <code>setModuleName</code>, and <code>addModule</code> — styled
          with Tailwind so you are not adding Bootstrap to this project:
        </p>
        <CodeBlock
          language="tsx"
          name="ModuleEditor"
          file="app/(kambaz)/courses/[cid]/modules/ModuleEditor.tsx"
        >{`"use client";

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
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      id="wd-add-module-dialog"
    >
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <h3 className="m-0 text-lg font-semibold">{dialogTitle}</h3>
          <button type="button" onClick={handleClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="px-4 py-3">
          <input
            className="w-full rounded border border-neutral-300 px-3 py-1.5"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            id="wd-add-module-name"
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-neutral-200 px-4 py-3">
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
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          The toolbar that already has Collapse All, View Progress, and
          Publish All should own that dialog. Move those controls into{" "}
          <code>ModulesControls.tsx</code>. The red + Module button sets{" "}
          <code>show</code>{" "}to true; Cancel or the × sets it back to
          false. The target dialog and toolbar look like{" "}
          <FigureLink to="4.10.4a" />{" "}and <FigureLink to="4.10.4b" />:
        </p>
        <BookFigure
          sources={[
            {
              id: "fig-4.10.4a",
              src: "/images/book/ch4/figures/fig-4-10-4a-module-editor.png",
              alt: "Add Module dialog with a name field, Cancel, and Add Module",
              caption: "Figure 4.10.4a — Module editor dialog",
            },
            {
              id: "fig-4.10.4b",
              src: "/images/book/ch4/figures/fig-4-10-4b-modules-controls.png",
              alt: "Publish All dropdown and red + Module button",
              caption: "Figure 4.10.4b — Modules controls",
            },
          ]}
        />
        <CodeBlock
          language="tsx"
          name="ModulesControls"
          file="app/(kambaz)/courses/[cid]/modules/ModulesControls.tsx"
        >{`"use client";

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
  const handleShow = () => setShow(true);
  return (
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
}`}</CodeBlock>
        <p>
          On the Modules page, keep <code>moduleName</code>{" "}in{" "}
          <code>useState</code>. Pass it, <code>setModuleName</code>, and
          an <code>addModule</code>{" "}that appends{" "}
          <code>{`{ name: moduleName, course: courseId }`}</code>{" "}into the
          store (or into a local array while you are still proving the
          dialog). After Add Module, clear the name. Confirm the new row
          appears on{" "}
          <Link href="/courses/RS101/modules">/courses/RS101/modules</Link>.
        </p>
        <OnYourOwn>
          Type a module name that includes your initials and add it from
          the dialog so you can tell your row apart from the JSON seed.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/courses/[cid]/modules/ModuleEditor.tsx, keep any extra field I added. After the name input, add a sample placeholder "Module name" if the input has none. Do not rename my personal field.`}
        >
          Ask the assistant to add a sample placeholder after your own
          extra field:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-10-4-2"
        title="4.10.4.2 Deleting a Module"
      >
        <p>
          Add a trash icon to{" "}
          <code>ModuleControlButtons</code>. Pass{" "}
          <code>deleteModule</code>{" "}and the row&apos;s{" "}
          <code>moduleId</code>{" "}so the icon can remove that module. The
          row with a red trash can looks like{" "}
          <FigureLink to="4.10.4c" />:
        </p>
        <BookFigure
          id="fig-4.10.4c"
          src="/images/book/ch4/figures/fig-4-10-4c-delete-module.png"
          alt="Module title row with a red trash can among the control icons"
          caption="Figure 4.10.4c — Deleting a module"
        />
        <CodeBlock
          language="tsx"
          name="ModuleControlButtons"
          file="app/(kambaz)/courses/[cid]/modules/ModuleControlButtons.tsx"
        >{`import { FaPencilAlt, FaTrash } from "react-icons/fa";
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
}`}</CodeBlock>
        <p>
          <code>deleteModule</code>{" "}filters the modules array by{" "}
          <code>_id</code>. Pass both the function and{" "}
          <code>module._id</code>{" "}into <code>ModuleControlButtons</code>{" "}
          from the map. Confirm a trash click removes that module and
          leaves the others.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-4-10-4-3"
        title="4.10.4.3 Editing a Module"
      >
        <p>
          The pencil calls <code>editModule(moduleId)</code>, which sets
          that module&apos;s <code>editing</code>{" "}flag to true. While the
          flag is false, render the name. While it is true, render a text
          field bound to <code>updateModule</code>. Pressing Enter sets{" "}
          <code>editing</code>{" "}back to false so the name shows again.
          The pencil on the row looks like <FigureLink to="4.10.4d" />;
          the field that replaces the title looks like{" "}
          <FigureLink to="4.10.4e" />:
        </p>
        <BookFigure
          sources={[
            {
              id: "fig-4.10.4d",
              src: "/images/book/ch4/figures/fig-4-10-4d-edit-module.png",
              alt: "Module row with a blue pencil and a red trash can",
              caption: "Figure 4.10.4d — Pencil to edit a module",
            },
            {
              id: "fig-4.10.4e",
              src: "/images/book/ch4/figures/fig-4-10-4e-editing-module.png",
              alt: "Module row showing an input field instead of the title",
              caption: "Figure 4.10.4e — Editing a module name",
            },
          ]}
        />
        <p>
          In the Modules map, the title is no longer a plain string:
        </p>
        <CodeBlock language="tsx">{`title={
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
}`}</CodeBlock>
        <p>
          Confirm you can rename a module, press Enter, and see the new
          name on both Modules and Home — once the store in{" "}
          <SectionLink to="4.10.4.4" />{" "}is in place. Until then the edit
          only lives on this page.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-4-10-4-4"
        title="4.10.4.4 A Modules Store"
      >
        <p>
          Local <code>useState</code>{" "}on Modules cannot update Home,
          because Home is a different screen and does not sit under that
          component. Move the array into Zustand the same way courses
          moved in{" "}
          <SectionLink to="4.10.1" />. Seed from{" "}
          <code>modules.json</code>. Export{" "}
          <code>addModule</code>, <code>deleteModule</code>,{" "}
          <code>updateModule</code>, and <code>editModule</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="modulesStore"
          file="app/(kambaz)/store/modulesStore.ts"
        >{`"use client";

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
}));`}</CodeBlock>
        <p>
          The Modules page then keeps only the draft name in{" "}
          <code>useState</code>. Filter the store by <code>cid</code>,
          pass store functions into <code>ModulesControls</code>{" "}and{" "}
          <code>ModuleControlButtons</code>, and Home updates for free
          because it already renders <code>Modules</code>.
        </p>
        <OnYourOwn>
          Add a module on Modules, switch to Home without reloading, and
          confirm the new row is there. Rename it with the pencil, press
          Enter, then delete it with the trash can.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/courses/[cid]/modules/page.tsx, keep any extra field I added. If moduleName is empty, do not call addModule. Do not rename my personal field.`}
        >
          Ask the assistant to skip empty names after your own extra field:
        </WithAI>
      </Section>
    </Section>
  );
}
