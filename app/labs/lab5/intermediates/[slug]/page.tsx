import type { ComponentType } from "react";
import Environment from "../5-2-1-Environment";
import PathParameters from "../5-2-2-1-PathParameters";
import QueryParameters from "../5-2-2-2-QueryParameters";
import WorkingWithRemoteObjects from "../5-2-3-WorkingWithRemoteObjects";
import WorkingWithRemoteArrays from "../5-2-4-WorkingWithRemoteArrays";
import HttpClient from "../5-2-5-HttpClient";
import WorkingWithRemoteObjectsAsynchronously from "../5-2-5-WorkingWithRemoteObjectsAsync";
import WorkingWithRemoteArraysAsynchronously from "../5-2-6-WorkingWithRemoteArraysAsync";
import HelloRoute from "../5-3-1-HelloRoute";
import CalculatorNextWebApiClient from "../5-3-1-Calculator";
import { notFound } from "next/navigation";

const STEPS: Record<string, ComponentType> = {
  "5-2-1-Environment": Environment,
  "5-2-2-1-PathParameters": PathParameters,
  "5-2-2-2-QueryParameters": QueryParameters,
  "5-2-3-WorkingWithRemoteObjects": WorkingWithRemoteObjects,
  "5-2-4-WorkingWithRemoteArrays": WorkingWithRemoteArrays,
  "5-2-5-HttpClient": HttpClient,
  "5-2-5-WorkingWithRemoteObjectsAsync": WorkingWithRemoteObjectsAsynchronously,
  "5-2-6-WorkingWithRemoteArraysAsync": WorkingWithRemoteArraysAsynchronously,
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
