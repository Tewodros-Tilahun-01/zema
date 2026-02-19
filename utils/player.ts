export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function formatTime(seconds: number) {
  const safeValue = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeValue / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(safeValue % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${secs}`;
}
