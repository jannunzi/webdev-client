import { Arrow, BLUE, Box, Caption, RED, YELLOW, linesHeight } from "./SchemaRelationBoxes";

/** Embedded arrays on both sides, beside one enrollments collection. */
export default function EnrollmentsMnDiagram() {
  const rowH = linesHeight(3);
  const top = 16;
  const yFor = (lines: number) => top + (rowH - linesHeight(lines)) / 2;
  const coursesW = 196;
  const usersW = 196;
  const enrollW = 196;
  const pairGap = 92;
  const joinGap = 60;
  const groupGap = 72;

  const leftX = 8;
  const leftUsersX = leftX + coursesW + pairGap;
  const leftW = leftUsersX + usersW - leftX;

  const rightX = leftUsersX + usersW + groupGap;
  const enrollX = rightX + coursesW + joinGap;
  const rightUsersX = enrollX + enrollW + joinGap;
  const rightW = rightUsersX + usersW - rightX;

  const width = rightUsersX + usersW + 8;
  const captionY = top + rowH + 36;
  const height = captionY + 10;

  const mid = top + rowH / 2;

  return (
    <svg role="img" viewBox={`0 0 ${width} ${height}`} aria-label="Two ways to store many users in many courses">
      <title>Arrays in both documents, or one enrollments collection</title>
      <Box
        x={leftX}
        y={yFor(3)}
        w={coursesW}
        h={linesHeight(3)}
        title="courses"
        lines={["_id", "name", "[ user _id ]"]}
        tone={BLUE}
      />
      <Box
        x={leftUsersX}
        y={yFor(3)}
        w={usersW}
        h={linesHeight(3)}
        title="users"
        lines={["_id", "username", "[ course _id ]"]}
        tone={RED}
      />
      <Arrow x1={leftX + coursesW + 8} x2={leftUsersX - 8} y={mid - 16} />
      <Arrow x1={leftUsersX - 8} x2={leftX + coursesW + 8} y={mid + 16} />
      <Caption x={leftX} y={captionY} width={leftW} text="Arrays in both documents" />

      <Box
        x={rightX}
        y={yFor(2)}
        w={coursesW}
        h={linesHeight(2)}
        title="courses"
        lines={["_id", "name"]}
        tone={BLUE}
      />
      <Box
        x={enrollX}
        y={yFor(3)}
        w={enrollW}
        h={linesHeight(3)}
        title="enrollments"
        lines={["_id", "user", "course"]}
        tone={YELLOW}
      />
      <Box
        x={rightUsersX}
        y={yFor(2)}
        w={usersW}
        h={linesHeight(2)}
        title="users"
        lines={["_id", "username"]}
        tone={RED}
      />
      <Arrow x1={enrollX - 8} x2={rightX + coursesW + 8} y={mid} />
      <Arrow x1={enrollX + enrollW + 8} x2={rightUsersX - 8} y={mid} />
      <Caption x={rightX} y={captionY} width={rightW} text="Enrollments collection" />
    </svg>
  );
}
