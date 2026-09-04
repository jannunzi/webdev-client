import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/config";
import { isInstructorUser } from "@/lib/roster/instructors";

export default async function InstructorPeopleLink({
  asLine = false,
}: {
  asLine?: boolean;
}) {
  if (!isClerkConfigured()) return null;
  const user = await currentUser();
  if (!isInstructorUser(user)) return null;
  const link = <Link href="/people">People</Link>;
  if (asLine) {
    return (
      <p className="mb-4 text-sm">
        {link}
        <span className="text-neutral-500"> — Canvas roster (instructor)</span>
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
