export type WheelInput = {
  deltaX: number;
  deltaY: number;
  deltaMode: number;
  width: number;
  controlKey: boolean;
  interactive: boolean;
  canScrollVertically: boolean;
};

export function horizontalWheelDelta(input: WheelInput): number | null {
  if (input.controlKey || input.interactive || input.canScrollVertically || Math.abs(input.deltaX) >= Math.abs(input.deltaY)) return null;
  const unit = input.deltaMode === 1 ? 16 : input.deltaMode === 2 ? input.width : 1;
  const limit = input.width * 0.8;
  return Math.max(-limit, Math.min(limit, input.deltaY * unit));
}
