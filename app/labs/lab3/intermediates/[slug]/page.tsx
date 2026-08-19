import type { ComponentType } from "react";
import VariablesAndConstants from "../../VariablesAndConstants";
import VariableTypes from "../../VariableTypes";
import BooleanVariables from "../../BooleanVariables";
import IfElse from "../../IfElse";
import TernaryOperator from "../../TernaryOperator";
import ConditionalOutputIfElse from "../../ConditionalOutputIfElse";
import ConditionalOutputInline from "../../ConditionalOutputInline";
import NullUndefined from "../../NullUndefined";
import LegacyFunctions from "../../LegacyFunctions";
import ArrowFunctions from "../../ArrowFunctions";
import ImpliedReturn from "../../ImpliedReturn";
import TemplateLiterals from "../../TemplateLiterals";
import SimpleArrays from "../../SimpleArrays";
import ArrayIndexAndLength from "../../ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "../../AddingAndRemovingToFromArrays";
import ForLoops from "../../ForLoops";
import MapFunction from "../../MapFunction";
import FindFunction from "../../FindFunction";
import FindIndex from "../../FindIndex";
import FilterFunction from "../../FilterFunction";
import JsonStringify from "../../JsonStringify";
import House from "../../House";
import Spreader from "../../Spreader";
import Destructing from "../../Destructing";
import FunctionDestructing from "../../FunctionDestructing";
import DestructingImports from "../../DestructingImports";
import Classes from "../../Classes";
import Styles from "../../Styles";
import ClientComponentDemo from "../../ClientComponentDemo";
import ServerComponentDemo from "../../ServerComponentDemo";
import Add from "../../Add";
import Square from "../../Square";
import Highlight from "../../Highlight";
import PathParameters from "../../PathParameters";
import TodoItem from "../../todos/TodoItem";
import TodoList from "../../todos/TodoList";
import IncludesSomeEvery from "../../IncludesSomeEvery";
import ReduceFunction from "../../ReduceFunction";
import OptionalChaining from "../../OptionalChaining";
import { notFound } from "next/navigation";

function AddDemo() {
  return <Add a={3} b={4} />;
}

function SquareDemo() {
  return (
    <>
      <h4>Square of 4</h4>
      <Square>4</Square>
      <hr />
    </>
  );
}

function HighlightDemo() {
  return (
    <Highlight>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Highlight>
  );
}

const STEPS: Record<string, ComponentType> = {
  VariablesAndConstants,
  VariableTypes,
  BooleanVariables,
  IfElse,
  TernaryOperator,
  ConditionalOutputIfElse,
  ConditionalOutputInline,
  NullUndefined,
  LegacyFunctions,
  ArrowFunctions,
  ImpliedReturn,
  TemplateLiterals,
  SimpleArrays,
  ArrayIndexAndLength,
  AddingAndRemovingToFromArrays,
  ForLoops,
  MapFunction,
  FindFunction,
  FindIndex,
  FilterFunction,
  JsonStringify,
  House,
  Spreader,
  Destructing,
  FunctionDestructing,
  DestructingImports,
  Classes,
  Styles,
  ClientComponentDemo,
  ServerComponentDemo,
  Add: AddDemo,
  Square: SquareDemo,
  Highlight: HighlightDemo,
  PathParameters,
  TodoItem,
  TodoList,
  IncludesSomeEvery,
  ReduceFunction,
  OptionalChaining,
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
