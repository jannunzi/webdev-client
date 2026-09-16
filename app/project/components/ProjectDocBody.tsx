import type { ReactNode } from "react";
import type { ProjectDocBlock, ProjectDocImage } from "../types";
import ProjectFigure from "./ProjectFigure";

type ListNode = {
  text: string;
  figures: ProjectDocImage[];
  children: ListNode[];
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function toTree(items: { text: string; depth: number; figures: ProjectDocImage[] }[]) {
  const root: ListNode[] = [];
  const stack: { depth: number; children: ListNode[] }[] = [
    { depth: -1, children: root },
  ];

  for (const item of items) {
    while (stack[stack.length - 1]!.depth >= item.depth) {
      stack.pop();
    }
    const node: ListNode = {
      text: item.text,
      figures: item.figures,
      children: [],
    };
    stack[stack.length - 1]!.children.push(node);
    stack.push({ depth: item.depth, children: node.children });
  }

  return root;
}

function ListTree({ items }: { items: ListNode[] }) {
  return (
    <ul className="list-disc space-y-1 pl-6">
      {items.map((item, index) => (
        <li key={`${index}-${item.text.slice(0, 48)}`}>
          {item.text}
          {item.figures.map((figure) => (
            <ProjectFigure key={figure.src} {...figure} />
          ))}
          {item.children.length > 0 ? <ListTree items={item.children} /> : null}
        </li>
      ))}
    </ul>
  );
}

function Heading({
  id,
  level,
  children,
}: {
  id: string;
  level: 1 | 2 | 3;
  children: ReactNode;
}) {
  if (level === 1) {
    return (
      <h2
        id={id}
        className="scroll-mt-32 border-b border-neutral-300 pb-2 pt-4 font-sans text-2xl font-semibold tracking-tight"
      >
        {children}
      </h2>
    );
  }

  if (level === 2) {
    return (
      <h3
        id={id}
        className="scroll-mt-32 pt-2 font-sans text-xl font-semibold tracking-tight"
      >
        {children}
      </h3>
    );
  }

  return (
    <h4 id={id} className="scroll-mt-32 pt-1 font-sans text-lg font-semibold">
      {children}
    </h4>
  );
}

export default function ProjectDocBody({ blocks }: { blocks: readonly ProjectDocBlock[] }) {
  const usedIds = new Map<string, number>();
  const nodes: ReactNode[] = [];
  let pending: { text: string; depth: number; figures: ProjectDocImage[] }[] = [];

  const headingId = (text: string) => {
    const base = slugify(text) || "section";
    const seen = usedIds.get(base) ?? 0;
    usedIds.set(base, seen + 1);
    return seen === 0 ? base : `${base}-${seen + 1}`;
  };

  const flushList = () => {
    if (pending.length === 0) return;
    nodes.push(
      <ListTree
        key={`list-${nodes.length}`}
        items={toTree(pending)}
      />,
    );
    pending = [];
  };

  for (const block of blocks) {
    if (block.type === "li") {
      pending.push({ text: block.text, depth: block.depth, figures: [] });
      continue;
    }
    if (block.type === "img" && pending.length > 0) {
      pending[pending.length - 1]!.figures.push(block);
      continue;
    }

    flushList();

    if (block.type === "img") {
      nodes.push(<ProjectFigure key={block.src} {...block} />);
      continue;
    }
    if (block.type === "h") {
      const id = headingId(block.text);
      nodes.push(
        <Heading key={id} id={id} level={block.level}>
          {block.text}
        </Heading>,
      );
      continue;
    }
    nodes.push(<p key={`${block.text.slice(0, 40)}-${nodes.length}`}>{block.text}</p>);
  }

  flushList();

  return <div className="space-y-3 text-[1.05rem]">{nodes}</div>;
}
