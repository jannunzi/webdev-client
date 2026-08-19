import type { ComponentType } from "react";
import StyleAttribute from "../2-1-1-StyleAttribute";
import CssImport from "../2-1-2-CssImport";
import IdSelectors from "../2-1-3-IdSelectors";
import ClassSelectors from "../2-1-4-ClassSelectors";
import DocumentStructureSelectors from "../2-1-5-DocumentStructureSelectors";
import ForegroundColors from "../2-1-7-ForegroundColors";
import BackgroundColors from "../2-1-8-BackgroundColors";
import Borders from "../2-1-9-Borders";
import Padding from "../2-1-10a-Padding";
import Margins from "../2-1-10b-Margins";
import BoxModel from "../2-1-10c-BoxModel";
import Corners from "../2-1-11-Corners";
import Dimensions from "../2-1-12-Dimensions";
import Display from "../2-1-12b-Display";
import PositionRelative from "../2-1-13-PositionRelative";
import PositionAbsolute from "../2-1-14-PositionAbsolute";
import PositionFixed from "../2-1-15-PositionFixed";
import Zindex from "../2-1-16-Zindex";
import Float from "../2-1-17-Float";
import GridLayout from "../2-1-18-GridLayout";
import FlexRow from "../2-1-19a-FlexRow";
import FlexGrow from "../2-1-19b-FlexGrow";
import FlexWidth from "../2-1-19c-FlexWidth";
import MediaQueries from "../2-1-20-MediaQueries";
import ReactIconsSampler from "../2-2-ReactIconsSampler";
import { notFound } from "next/navigation";

const STEPS: Record<string, ComponentType> = {
  "2-1-1-StyleAttribute": StyleAttribute,
  "2-1-2-CssImport": CssImport,
  "2-1-3-IdSelectors": IdSelectors,
  "2-1-4-ClassSelectors": ClassSelectors,
  "2-1-5-DocumentStructureSelectors": DocumentStructureSelectors,
  "2-1-7-ForegroundColors": ForegroundColors,
  "2-1-8-BackgroundColors": BackgroundColors,
  "2-1-9-Borders": Borders,
  "2-1-10a-Padding": Padding,
  "2-1-10b-Margins": Margins,
  "2-1-10c-BoxModel": BoxModel,
  "2-1-11-Corners": Corners,
  "2-1-12-Dimensions": Dimensions,
  "2-1-12b-Display": Display,
  "2-1-13-PositionRelative": PositionRelative,
  "2-1-14-PositionAbsolute": PositionAbsolute,
  "2-1-15-PositionFixed": PositionFixed,
  "2-1-16-Zindex": Zindex,
  "2-1-17-Float": Float,
  "2-1-18-GridLayout": GridLayout,
  "2-1-19a-FlexRow": FlexRow,
  "2-1-19b-FlexGrow": FlexGrow,
  "2-1-19c-FlexWidth": FlexWidth,
  "2-1-20-MediaQueries": MediaQueries,
  "2-2-ReactIconsSampler": ReactIconsSampler,
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
