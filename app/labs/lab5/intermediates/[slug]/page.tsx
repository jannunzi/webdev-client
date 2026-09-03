import type { ComponentType } from "react";
import Environment from "../5-2-1-Environment";
import PathParameters from "../5-2-2-1-PathParameters";
import QueryParameters from "../5-2-2-2-QueryParameters";
import WorkingWithObjects from "../5-2-3-WorkingWithObjects";
import WorkingWithArrays from "../5-2-4-WorkingWithArrays";
import HttpClient from "../5-2-5-HttpClient";
import WorkingWithObjectsAsynchronously from "../5-2-5-WorkingWithObjectsAsync";
import WorkingWithArraysAsynchronously from "../5-2-6-WorkingWithArraysAsync";
import HelloRoute from "../5-3-1-HelloRoute";
import CalculatorNextWebApiClient from "../5-3-1-Calculator";
import { notFound } from "next/navigation";

const STEPS: Record<string, ComponentType> = {
  "5-2-1-Environment": Environment,
  "5-2-2-1-PathParameters": PathParameters,
  "5-2-2-2-QueryParameters": QueryParameters,
  "5-2-3-WorkingWithObjects": WorkingWithObjects,
  "5-2-4-WorkingWithArrays": WorkingWithArrays,
  "5-2-5-HttpClient": HttpClient,
  "5-2-5-WorkingWithObjectsAsync": WorkingWithObjectsAsynchronously,
  "5-2-6-WorkingWithArraysAsync": WorkingWithArraysAsynchronously,
  "5-3-1-HelloRoute": HelloRoute,
  "5-3-1-Calculator": CalculatorNextWebApiClient,
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
