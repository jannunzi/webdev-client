"use client";

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

  return (
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
}
