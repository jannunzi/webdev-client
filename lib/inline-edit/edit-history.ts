/** Local undo stack for one inline edit. Nothing here is written until Save. */
export type EditHistory = {
  past: string[];
  present: string;
  future: string[];
};

export function createHistory(present: string): EditHistory {
  return { past: [], present, future: [] };
}

export function pushHistory(history: EditHistory, next: string): EditHistory {
  if (next === history.present) return history;
  return { past: [...history.past, history.present], present: next, future: [] };
}

export function undoHistory(history: EditHistory): EditHistory {
  const previous = history.past[history.past.length - 1];
  if (previous === undefined) return history;
  return {
    past: history.past.slice(0, -1),
    present: previous,
    future: [history.present, ...history.future],
  };
}

export function redoHistory(history: EditHistory): EditHistory {
  const [next, ...rest] = history.future;
  if (next === undefined) return history;
  return {
    past: [...history.past, history.present],
    present: next,
    future: rest,
  };
}

/** Drop suggestion steps and return to the html captured before them. */
export function discardUntil(history: EditHistory, html: string): EditHistory {
  const stack = [...history.past, history.present];
  const index = stack.lastIndexOf(html);
  if (index === -1) return { past: history.past, present: html, future: [] };
  return { past: stack.slice(0, index), present: html, future: [] };
}
