export type ChapterEditMode = "reading" | "editing";

export type ChapterEditState = {
  mode: ChapterEditMode;
  dirty: boolean;
};

export const UNSAVED_EDIT_MESSAGE =
  "Save the chapter before leaving. Done does not discard unsaved changes.";

/** Reading is the start. Edit stays on this page. Done and other navigation wait for Save. */
export function nextChapterEdit(
  state: ChapterEditState,
  event: "edit" | "change" | "save" | "done" | "navigate",
): { state: ChapterEditState; blocked: boolean } {
  if (event === "edit") {
    return { state: { mode: "editing", dirty: state.mode === "editing" ? state.dirty : false }, blocked: false };
  }
  if (event === "change") {
    if (state.mode !== "editing") return { state, blocked: false };
    return { state: { mode: "editing", dirty: true }, blocked: false };
  }
  if (event === "save") {
    if (state.mode !== "editing") return { state, blocked: false };
    return { state: { mode: "editing", dirty: false }, blocked: false };
  }
  if (state.mode === "editing" && state.dirty) return { state, blocked: true };
  if (event === "done") return { state: { mode: "reading", dirty: false }, blocked: false };
  return { state, blocked: false };
}
