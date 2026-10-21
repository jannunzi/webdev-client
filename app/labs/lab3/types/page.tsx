import TypeAnnotations from "./TypeAnnotations";
import ObjectTypes from "./ObjectTypes";
import Interfaces from "./Interfaces";
import UnionTypes from "./UnionTypes";
import Enums from "./Enums";
import FunctionTypes from "./FunctionTypes";
import TypedProps from "./TypedProps";
import Narrowing from "./Narrowing";
import AnyVsUnknown from "./AnyVsUnknown";
import UtilityTypes from "./UtilityTypes";

export default function TypesPage() {
  return (
    <div id="wd-lab3-types" className="p-4">
      <h2>TypeScript Types</h2>
      <TypeAnnotations />
      <ObjectTypes />
      <Interfaces />
      <UnionTypes />
      <Enums />
      <FunctionTypes />
      <TypedProps />
      <Narrowing />
      <AnyVsUnknown />
      <UtilityTypes />
    </div>
  );
}
