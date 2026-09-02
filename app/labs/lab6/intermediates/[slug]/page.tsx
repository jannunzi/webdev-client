import type { ComponentType } from "react";
import ConnectionStatus from "../6-2-1-Connection";
import Lab6Todos from "../6-2-5-Todos";
import Lab6Users from "../6-2-6-Users";
import { notFound } from "next/navigation";

const STEPS: Record<string, ComponentType> = {
  "6-2-1-Connection": ConnectionStatus,
  "6-2-5-Todos": Lab6Todos,
  "6-2-6-Users": Lab6Users,
};

export default async function IntermediateStepPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const Step = STEPS[slug];
  if (!Step) notFound();
  return <Step />;
}
