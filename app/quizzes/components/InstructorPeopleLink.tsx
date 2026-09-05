import Link from "next/link";
import { isCurrentUserStaff } from "@/lib/roster/staff-access";

export default async function InstructorPeopleLink({
  asLine = false,
}: {
  asLine?: boolean;
}) {
  if (!(await isCurrentUserStaff())) return null;
  const link = <Link href="/people">People</Link>;
  if (asLine) {
    return (
      <p className="mb-4 text-sm">
        {link}
        <span className="text-neutral-500"> — Canvas roster (staff)</span>
      </p>
    );
  }
  return (
    <>
      {" · "}
      {link}
    </>
  );
}
