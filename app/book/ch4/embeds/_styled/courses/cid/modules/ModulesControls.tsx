"use client";

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
      </button>
      <select
        defaultValue="publish-all"
        className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm"
      >
        <option value="publish-all">Publish All</option>
        <option value="unpublish-all">Unpublish All</option>
      </select>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded border border-red-600 bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
        id="wd-add-module-btn"
        onClick={handleShow}
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
}
