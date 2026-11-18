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
  const sectionId = sectionIdFromLegacyTab(raw) ?? "cs5610-02";
  const destination = legacySectionPath(sectionId);
  if (destination) redirect(destination);
  return <SyllabusPage />;
}
