import {
  Arrow,
  BLUE,
  Box,
  Caption,
  CrowsFoot,
  GapLabel,
  YELLOW,
  linesHeight,
} from "./SchemaRelationBoxes";

function rowLayout(lines: number) {
  const rowH = linesHeight(lines);
  const top = 16;
  const yFor = (count: number) => top + (rowH - linesHeight(count)) / 2;
  const captionY = top + rowH + 36;
  const height = captionY + 12;
  const mid = top + rowH / 2;
  return { rowH, top, yFor, captionY, height, mid };
}

/** Course 1:N Module, beside the relational primary-key / foreign-key tables. */
export function ModulesOneToNDiagram() {
  const { yFor, captionY, height, mid } = rowLayout(3);
  const boxW = 220;
  const gap = 132;
  const groupGap = 76;
  const side = 12;

  const courseX = side;
  const moduleX = courseX + boxW + gap;
  const leftW = moduleX + boxW - courseX;

  const tableCourseX = moduleX + boxW + groupGap;
  const tableModuleX = tableCourseX + boxW + gap;
  const rightW = tableModuleX + boxW - tableCourseX;
  const width = tableModuleX + boxW + side;

  const footTip = moduleX - 8;

  return (
    <svg
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      aria-label="One course has many modules, stored with a foreign key"
    >
      <title>Course to module, one to many, and a foreign key</title>
      <Box
        x={courseX}
        y={yFor(2)}
        w={boxW}
        h={linesHeight(2)}
        title="Course"
        lines={["_id", "title"]}
        tone={BLUE}
      />
      <Box
        x={moduleX}
        y={yFor(3)}
        w={boxW}
        h={linesHeight(3)}
        title="Module"
        lines={["_id", "name", "course"]}
        tone={YELLOW}
      />
      <line
        x1={courseX + boxW + 8}
        y1={mid}
        x2={footTip - 18}
        y2={mid}
        stroke="#171717"
        strokeWidth={3.5}
      />
      <CrowsFoot x={footTip} y={mid} />
      <GapLabel x={courseX + boxW + 36} y={mid - 18} text="1" />
      <GapLabel x={moduleX - 36} y={mid - 18} text="N" />
      <Caption x={courseX} y={captionY} width={leftW} text="One to many" />

      <Box
        x={tableCourseX}
        y={yFor(2)}
        w={boxW}
        h={linesHeight(2)}
        title="Course"
        lines={["_id PK", "title"]}
        tone={BLUE}
      />
      <Box
        x={tableModuleX}
        y={yFor(3)}
        w={boxW}
        h={linesHeight(3)}
        title="Module"
        lines={["_id", "name", "course FK"]}
        tone={YELLOW}
      />
      <Arrow x1={tableModuleX - 8} x2={tableCourseX + boxW + 8} y={mid} />
      <GapLabel x={tableCourseX + boxW + 40} y={mid - 18} text="PK" />
      <GapLabel x={tableModuleX - 40} y={mid - 18} text="FK" />
      <Caption x={tableCourseX} y={captionY} width={rightW} text="Foreign key" />
    </svg>
  );
}

/** Module ids on the course, beside modules embedded in the course document. */
export function ModulesShapesDiagram() {
  const rowH = linesHeight(5);
  const top = 6;
  const yFor = (count: number) => top + (rowH - linesHeight(count)) / 2;
  const height = top + rowH + 6;
  const mid = top + rowH / 2;
  const courseW = 270;
  const moduleW = 200;
  const embedW = 320;
  const gap = 110;
  const groupGap = 72;
  const side = 16;

  const courseX = side;
  const moduleX = courseX + courseW + gap;
  const embedX = moduleX + moduleW + groupGap;
  const width = embedX + embedW + side;

  return (
    <svg
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      aria-label="Module ids on the course, or module objects embedded in the course"
    >
      <title>Array of module ids, or embedded module objects</title>
      <Box
        x={courseX}
        y={top}
        w={courseW}
        h={rowH}
        title="Course"
        lines={["modules: [", '  "M101",', '  "M102",', "  ...", "]"]}
        tone={BLUE}
      />
      <Box
        x={moduleX}
        y={yFor(2)}
        w={moduleW}
        h={linesHeight(2)}
        title="Module"
        lines={["_id", "name"]}
        tone={YELLOW}
      />
      <Arrow x1={courseX + courseW + 8} x2={moduleX - 8} y={mid} />
      <GapLabel x={courseX + courseW + gap / 2} y={mid - 20} text="id" />
      <Box
        x={embedX}
        y={top}
        w={embedW}
        h={rowH}
        title="Course"
        lines={["modules: [", "  { module1 },", "  { module2 },", "  ...", "]"]}
        tone={BLUE}
      />
    </svg>
  );
}
