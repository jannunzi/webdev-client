import VariablesAndConstants from "@/app/labs/lab3/VariablesAndConstants";
import VariableTypes from "@/app/labs/lab3/VariableTypes";
import BooleanVariables from "@/app/labs/lab3/BooleanVariables";
import IfElse from "@/app/labs/lab3/IfElse";
import TernaryOperator from "@/app/labs/lab3/TernaryOperator";
import ConditionalOutputIfElse from "@/app/labs/lab3/ConditionalOutputIfElse";
import ConditionalOutputInline from "@/app/labs/lab3/ConditionalOutputInline";
import NullUndefined from "@/app/labs/lab3/NullUndefined";
import LegacyFunctions from "@/app/labs/lab3/LegacyFunctions";
import ArrowFunctions from "@/app/labs/lab3/ArrowFunctions";
import ImpliedReturn from "@/app/labs/lab3/ImpliedReturn";
import TemplateLiterals from "@/app/labs/lab3/TemplateLiterals";
import type { ReactNode } from "react";
import LectureDemoFrame from "./LectureDemoFrame";

function Lab3Demo({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <LectureDemoFrame label={label} url="/labs/lab3">
      <div className="max-h-72 overflow-auto font-sans text-base [&_h2]:mt-0 [&_h4]:mt-0 [&_h5]:mt-2">
        {children}
      </div>
    </LectureDemoFrame>
  );
}

export function Lab3StubEmbed() {
  return (
    <Lab3Demo label="app/labs/lab3/page.tsx">
      <div id="wd-lab3">
        <h2>Lab 3</h2>
      </div>
    </Lab3Demo>
  );
}

export function JsVariablesEmbed() {
  return (
    <Lab3Demo label="VariablesAndConstants.tsx">
      <VariablesAndConstants />
    </Lab3Demo>
  );
}

export function JsVariableTypesEmbed() {
  return (
    <Lab3Demo label="VariableTypes.tsx">
      <VariableTypes />
    </Lab3Demo>
  );
}

export function JsBooleansEmbed() {
  return (
    <Lab3Demo label="BooleanVariables.tsx">
      <BooleanVariables />
    </Lab3Demo>
  );
}

export function JsIfElseEmbed() {
  return (
    <Lab3Demo label="IfElse.tsx">
      <IfElse />
    </Lab3Demo>
  );
}

export function JsTernaryEmbed() {
  return (
    <Lab3Demo label="TernaryOperator.tsx">
      <TernaryOperator />
    </Lab3Demo>
  );
}

export function JsConditionalIfElseEmbed() {
  return (
    <Lab3Demo label="ConditionalOutputIfElse.tsx">
      <ConditionalOutputIfElse />
    </Lab3Demo>
  );
}

export function JsConditionalInlineEmbed() {
  return (
    <Lab3Demo label="ConditionalOutputInline.tsx">
      <ConditionalOutputInline />
    </Lab3Demo>
  );
}

export function JsNullUndefinedEmbed() {
  return (
    <Lab3Demo label="NullUndefined.tsx">
      <NullUndefined />
    </Lab3Demo>
  );
}

export function JsLegacyFunctionsEmbed() {
  return (
    <Lab3Demo label="LegacyFunctions.tsx">
      <LegacyFunctions />
    </Lab3Demo>
  );
}

export function JsArrowFunctionsEmbed() {
  return (
    <Lab3Demo label="ArrowFunctions.tsx">
      <ArrowFunctions />
    </Lab3Demo>
  );
}

export function JsImpliedReturnEmbed() {
  return (
    <Lab3Demo label="ImpliedReturn.tsx">
      <ImpliedReturn />
    </Lab3Demo>
  );
}

export function JsTemplateLiteralsEmbed() {
  return (
    <Lab3Demo label="TemplateLiterals.tsx">
      <TemplateLiterals />
    </Lab3Demo>
  );
}
