"use client";

import type { ReactNode } from "react";
import Environment from "@/app/labs/lab5/intermediates/5-2-1-Environment";
import HelloRoute from "@/app/labs/lab5/intermediates/5-3-1-HelloRoute";
import CalculatorNextWebApiClient from "@/app/labs/lab5/intermediates/5-3-1-Calculator";
import PathParameters from "@/app/labs/lab5/intermediates/5-2-2-1-PathParameters";
import QueryParameters from "@/app/labs/lab5/intermediates/5-2-2-2-QueryParameters";
import WorkingWithRemoteObjects from "@/app/labs/lab5/intermediates/5-2-3-WorkingWithRemoteObjects";
import WorkingWithArrays from "@/app/labs/lab5/intermediates/5-2-4-WorkingWithArrays";
import HttpClient from "@/app/labs/lab5/intermediates/5-2-5-HttpClient";
import WorkingWithRemoteObjectsAsynchronously from "@/app/labs/lab5/intermediates/5-2-5-WorkingWithRemoteObjectsAsync";
import WorkingWithArraysAsynchronously from "@/app/labs/lab5/intermediates/5-2-6-WorkingWithArraysAsync";
import LectureDemoFrame from "./LectureDemoFrame";

function Lab5Demo({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <LectureDemoFrame label={label} url="/labs/lab5">
      <div className="font-sans text-base [&_h2]:mt-0 [&_h3]:mt-0 [&_h4]:mt-0 [&_h5]:mt-2">
        {children}
      </div>
    </LectureDemoFrame>
  );
}

export function Lab5EnvEmbed() {
  return (
    <Lab5Demo label="app/labs/lab5/Environment.tsx">
      <Environment />
    </Lab5Demo>
  );
}

export function Lab5HelloEmbed() {
  return (
    <Lab5Demo label="app/labs/lab5/HelloRoute.tsx">
      <HelloRoute />
    </Lab5Demo>
  );
}

export function Lab5CalculatorEmbed() {
  return (
    <Lab5Demo label="app/labs/lab5/Calculator.tsx">
      <CalculatorNextWebApiClient />
    </Lab5Demo>
  );
}

export function Lab5PathEmbed() {
  return (
    <Lab5Demo label="app/labs/lab5/PathParameters.tsx">
      <PathParameters />
    </Lab5Demo>
  );
}

export function Lab5QueryEmbed() {
  return (
    <Lab5Demo label="app/labs/lab5/QueryParameters.tsx">
      <QueryParameters />
    </Lab5Demo>
  );
}

export function Lab5ObjectsEmbed() {
  return (
    <Lab5Demo label="app/labs/lab5/WorkingWithRemoteObjects.tsx">
      <WorkingWithRemoteObjects />
    </Lab5Demo>
  );
}

export function Lab5ArraysEmbed() {
  return (
    <Lab5Demo label="app/labs/lab5/WorkingWithArrays.tsx">
      <WorkingWithArrays />
    </Lab5Demo>
  );
}

export function Lab5HttpClientEmbed() {
  return (
    <Lab5Demo label="app/labs/lab5/HttpClient.tsx">
      <HttpClient />
    </Lab5Demo>
  );
}

export function Lab5ObjectsAsyncEmbed() {
  return (
    <Lab5Demo label="app/labs/lab5/WorkingWithRemoteObjectsAsync.tsx">
      <WorkingWithRemoteObjectsAsynchronously />
    </Lab5Demo>
  );
}

export function Lab5ArraysAsyncEmbed() {
  return (
    <Lab5Demo label="app/labs/lab5/WorkingWithArraysAsync.tsx">
      <WorkingWithArraysAsynchronously />
    </Lab5Demo>
  );
}
