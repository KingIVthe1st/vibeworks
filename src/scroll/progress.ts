export function localProgress(global: number, [a, b]: [number, number]): number {
  if (b <= a) return global >= a ? 1 : 0
  return Math.min(1, Math.max(0, (global - a) / (b - a)))
}
