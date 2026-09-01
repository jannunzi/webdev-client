"use client";

import { useState } from "react";
import { httpServer } from "@/app/lib/httpServer";

export default function WorkingWithObjects() {
  const HTTP_SERVER = httpServer();
  const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`;
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });
  const [module, setModule] = useState({
    id: "M1",
    name: "Introduction to Node.js",
    description: "Learn Express HTTP routes",
    course: "RS101",
  });
  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>
      <h4>Retrieving Objects</h4>
      <a
        id="wd-retrieve-assignments"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
        href={`${HTTP_SERVER}/lab5/assignment`}
      >
        Get Assignment
      </a>
      <h4 className="mt-3">Retrieving Properties</h4>
      <a
        id="wd-retrieve-assignment-title"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
        href={`${HTTP_SERVER}/lab5/assignment/title`}
      >
        Get Title
      </a>
      <h4 className="mt-3">Modifying Properties</h4>
      <a
        id="wd-update-assignment-title"
        className="mb-2 inline-block rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
        href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}
      >
        Update Title
      </a>
      <input
        className="mb-2 ml-2 rounded border border-neutral-300 px-2 py-1"
        id="wd-assignment-title"
        value={assignment.title}
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />
      <div className="mt-2">
        <a
          id="wd-update-assignment-score"
          className="mr-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
          href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}
        >
          Update Score
        </a>
        <input
          id="wd-assignment-score"
          type="number"
          className="rounded border border-neutral-300 px-2 py-1"
          value={assignment.score}
          onChange={(e) =>
            setAssignment({ ...assignment, score: Number(e.target.value) })
          }
        />
      </div>
      <div className="mt-2">
        <a
          id="wd-update-assignment-completed"
          className="mr-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
          href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}
        >
          Update Completed
        </a>
        <input
          id="wd-assignment-completed"
          type="checkbox"
          checked={assignment.completed}
          onChange={(e) =>
            setAssignment({ ...assignment, completed: e.target.checked })
          }
        />
      </div>
      <h4 className="mt-3">Module (On Your Own)</h4>
      <a
        id="wd-retrieve-module"
        className="mr-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
        href={`${HTTP_SERVER}/lab5/module`}
      >
        Get Module
      </a>
      <a
        id="wd-retrieve-module-name"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
        href={`${HTTP_SERVER}/lab5/module/name`}
      >
        Get Module Name
      </a>
      <div className="mt-2">
        <a
          id="wd-update-module-name"
          className="mr-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
          href={`${MODULE_API_URL}/name/${module.name}`}
        >
          Update Module Name
        </a>
        <input
          id="wd-module-name"
          className="rounded border border-neutral-300 px-2 py-1"
          value={module.name}
          onChange={(e) => setModule({ ...module, name: e.target.value })}
        />
      </div>
      <div className="mt-2">
        <a
          id="wd-update-module-description"
          className="mr-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
          href={`${MODULE_API_URL}/description/${module.description}`}
        >
          Update Module Description
        </a>
        <input
          id="wd-module-description"
          className="rounded border border-neutral-300 px-2 py-1"
          value={module.description}
          onChange={(e) =>
            setModule({ ...module, description: e.target.value })
          }
        />
      </div>
      <hr />
    </div>
  );
}
