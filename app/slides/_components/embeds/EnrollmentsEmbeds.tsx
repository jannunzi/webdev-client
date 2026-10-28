"use client";

import LectureDemoFrame from "./LectureDemoFrame";
import {
  AccountProvider,
  useAccountContext,
} from "./enrollments/account/AccountContext";
import Dashboard from "./enrollments/dashboard/Dashboard";
import PeopleTable from "./enrollments/courses/cid/people/table/PeopleTable";
import { useUsersStore } from "./enrollments/store/usersStore";

/**
 * Assignment solution demos (§4.10.7 Enrollments, People CRUD).
 * The files under ./enrollments are the exact code shown on the
 * kambaz-account-context slides; this wrapper only adds a user picker
 * in place of the Sign in screen so enroll / unenroll are visible.
 */
function UserPicker() {
  const { currentUser, setCurrentUser } = useAccountContext();
  const users = useUsersStore((state) => state.users);
  return (
    <label className="mb-3 flex items-center gap-2 text-sm">
      Signed in as
      <select
        className="rounded border border-neutral-300 px-2 py-1"
        value={currentUser?._id ?? ""}
        onChange={(e) =>
          setCurrentUser(users.find((u) => u._id === e.target.value) ?? null)
        }
      >
        <option value="">Nobody</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.firstName} {u.lastName} ({u.username})
          </option>
        ))}
      </select>
    </label>
  );
}

export function KambazEnrollmentsEmbed() {
  return (
    <LectureDemoFrame label="dashboard/page.tsx" url="/dashboard">
      <AccountProvider>
        <div className="font-sans">
          <UserPicker />
          <Dashboard />
        </div>
      </AccountProvider>
    </LectureDemoFrame>
  );
}

export function KambazPeopleCrudEmbed() {
  const cid = "RS101";
  return (
    <LectureDemoFrame
      label="people/table/PeopleTable.tsx"
      url={`/courses/${cid}/people/table`}
    >
      <div className="font-sans">
        <PeopleTable cid={cid} />
      </div>
    </LectureDemoFrame>
  );
}
