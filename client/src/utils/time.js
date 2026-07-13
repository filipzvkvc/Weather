export function getTimeString(timezone) {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const [hours, minutes] = timeStr.split(':')
  const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM'
  return `${hours}:${minutes} ${ampm}`
}
