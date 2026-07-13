import { DAY_NAMES } from '../constants/days'

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function buildForecastDays(weatherData) {
  return weatherData.daily.time.map((date, i) => ({
    date,
    name: i === 0 ? 'Today' : DAY_NAMES[new Date(date).getDay()],
    max: Math.round(weatherData.daily.temperature_2m_max[i]),
    min: Math.round(weatherData.daily.temperature_2m_min[i]),
    code: weatherData.daily.weathercode[i],
  }))
}
