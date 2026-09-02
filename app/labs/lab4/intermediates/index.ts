export { default as ClickEvent } from "../ClickEvent";
export { default as PassingDataOnEvent } from "../PassingDataOnEvent";
export { default as PassingFunctions } from "../PassingFunctions";
export { default as CounterBroken } from "../CounterBroken";
export { default as Counter } from "../Counter";
export { default as BooleanStateVariables } from "../BooleanStateVariables";
export { default as StringStateVariables } from "../StringStateVariables";
export { default as DateStateVariable } from "../DateStateVariable";
export { default as ObjectStateVariable } from "../ObjectStateVariable";
export { default as ArrayStateVariable } from "../ArrayStateVariable";
export { default as ParentStateComponent } from "../ParentStateComponent";
export { default as PropDrilling } from "../PropDrilling";
export { default as UrlEncoding } from "../UrlEncoding";
export { default as Effect } from "../Effect";
export { default as ContextExamples } from "../context/ContextExamples";
export { default as ZustandExamples } from "../zustand/ZustandExamples";
export { default as ReduxExamples } from "../redux/ReduxExamples";

export const LAB4_INTERMEDIATES = [
  { slug: "ClickEvent", title: "4.2.1 Click Event", file: "ClickEvent" },
  { slug: "PassingDataOnEvent", title: "4.2.2 Passing Data on Event", file: "PassingDataOnEvent" },
  { slug: "PassingFunctions", title: "4.2.3 Passing Functions", file: "PassingFunctions" },
  { slug: "CounterBroken", title: "4.2.4 Broken Counter", file: "CounterBroken" },
  { slug: "Counter", title: "4.2.4 Counter", file: "Counter" },
  { slug: "BooleanStateVariables", title: "4.2.5 Boolean State", file: "BooleanStateVariables" },
  { slug: "StringStateVariables", title: "4.2.6 String State", file: "StringStateVariables" },
  { slug: "DateStateVariable", title: "4.2.7 Date State", file: "DateStateVariable" },
  { slug: "ObjectStateVariable", title: "4.2.8 Object State", file: "ObjectStateVariable" },
  { slug: "ArrayStateVariable", title: "4.2.9 Array State", file: "ArrayStateVariable" },
  { slug: "ParentStateComponent", title: "4.3 Sharing State", file: "ParentStateComponent" },
  { slug: "PropDrilling", title: "4.3.2 Prop Drilling", file: "PropDrilling" },
  { slug: "UrlEncoding", title: "4.3.3 URL Encoding", file: "UrlEncoding" },
  { slug: "Effect", title: "4.7 useEffect", file: "Effect" },
  { slug: "ContextExamples", title: "4.4 React Context", file: "ContextExamples" },
  { slug: "ZustandExamples", title: "4.5 Zustand", file: "ZustandExamples" },
  { slug: "ReduxExamples", title: "4.6 Redux Toolkit (Hello, Counter, Add, Todos)", file: "ReduxExamples" },
] as const;
