import fs from "fs";
for (const f of ["LabExercises","KambazServer"]) {
  const s = fs.readFileSync(`app/book/ch5/sections/${f}.tsx`,"utf8");
  const re = /<CodeBlock([^>]*)>\{`([\s\S]*?)`\}<\/CodeBlock>/g; let m;
  while ((m = re.exec(s))) { if (!/language="tsx"/.test(m[1])) continue;
    const body = Function(`"use strict"; return \`${m[2]}\`;`)();
    console.log("=====", f, m[1].trim().replace(/\s+/g," "), "lines", body.split("\n").length, "maxw", Math.max(...body.split("\n").map(l=>l.length)));
    console.log(body);
  }
}
