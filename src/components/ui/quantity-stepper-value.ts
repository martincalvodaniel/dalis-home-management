export function adjustQuantity(
  value: number,
  step: number,
  direction: "decrease" | "increase",
  minimum: number
): number {
  const stepPosition = value / step
  const stepTolerance = 1e-9
  const nextStepPosition =
    direction === "increase"
      ? Math.floor(stepPosition + stepTolerance) + 1
      : Math.ceil(stepPosition - stepTolerance) - 1
  const adjustedValue = Math.round(nextStepPosition * step * 1000) / 1000
  return Math.min(999_999, Math.max(minimum, adjustedValue))
}
