/**
 * Largest uniform scale that fits a diagram in the leftover slide slot.
 * Height grows to the slot when the aspect ratio allows; width follows
 * the same scale. The result never exceeds the slot on either axis.
 */
export function diagramFitScale(
  slotWidth: number,
  slotHeight: number,
  naturalWidth: number,
  naturalHeight: number,
): number {
  if (
    slotWidth <= 0 ||
    slotHeight <= 0 ||
    naturalWidth <= 0 ||
    naturalHeight <= 0
  ) {
    return 1;
  }
  return Math.min(slotWidth / naturalWidth, slotHeight / naturalHeight);
}
