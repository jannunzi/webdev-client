"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "@/app/labs/lab2/tailwind/utilities.css";
import Module from "./Module";
import Lesson from "./Lesson";
import ModuleControlButtons from "./ModuleControlButtons";
import ModulesControls from "./ModulesControls";
import type { CourseModule } from "@/app/api/kambaz/types";
import { apiUrl } from "@/app/lib/apiUrl";

export default function Modules() {
  const { cid } = useParams();
  const courseId = typeof cid === "string" ? cid : "RS101";
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [moduleName, setModuleName] = useState("");

  async function loadModules() {
    const response = await fetch(apiUrl(`/api/modules?course=${courseId}`));
    setModules(await response.json());
  }

  useEffect(() => {
    loadModules();
  }, [courseId]);

  async function addModule() {
    if (!moduleName.trim()) return;
    await fetch(apiUrl("/api/modules"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: moduleName, course: courseId }),
    });
    setModuleName("");
    await loadModules();
  }

  async function deleteModule(moduleId: string) {
    await fetch(apiUrl(`/api/modules/${moduleId}`), { method: "DELETE" });
    await loadModules();
  }

  async function updateModule(module: CourseModule) {
    await fetch(apiUrl(`/api/modules/${module._id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(module),
    });
    await loadModules();
  }

  function editModule(moduleId: string) {
    setModules((current) =>
      current.map((m) =>
        m._id === moduleId ? { ...m, editing: true } : m,
      ),
    );
  }

  return (
    <div className="wd-modules">
      <ModulesControls
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={addModule}
      />
      <ul id="wd-modules" className="m-0 list-none p-0">
        {modules.map((module) => (
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
                    setModules((current) =>
                      current.map((m) =>
                        m._id === module._id
                          ? { ...m, name: e.target.value }
                          : m,
                      ),
                    )
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
