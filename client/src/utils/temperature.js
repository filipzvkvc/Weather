export function formatTemp(celsius, unit) {
  if (unit === 'F') return Math.round((celsius * 9) / 5 + 32)
  return celsius
}
