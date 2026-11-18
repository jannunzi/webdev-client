import { redirect } from "next/navigation";
import { sectionIdFromLegacyTab, legacySectionPath } from "@/lib/courses/offerings";
import SyllabusPage from "./SyllabusPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ section?: string | string[] }>;
}) {
  const { section } = await searchParams;
  const raw = Array.isArray(section) ? section[0] : section;
  const sectionId = sectionIdFromLegacyTab(raw);
  const destination = sectionId ? legacySectionPath(sectionId) : undefined;
  if (destination) redirect(destination);
  return <SyllabusPage />;
}
