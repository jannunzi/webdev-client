import type { Metadata } from "next";
import { listChapterTopicGroups } from "@/lib/lectures";
import SlidesHub from "./_components/SlidesHub";

export const metadata: Metadata = {
  title: "Slides — Web Dev",
};

export default async function SlidesIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  return (
    <SlidesHub
      editMode={edit === "1"}
      chapters={listChapterTopicGroups()}
    />
  );
}
