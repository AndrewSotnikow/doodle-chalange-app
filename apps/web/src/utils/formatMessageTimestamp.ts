const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

export function formatMessageTimestamp(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown time'
  }

  const day = date.getDate()
  const month = MONTHS[date.getMonth()]
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${day} ${month} ${year} ${hours}:${minutes}`
}
