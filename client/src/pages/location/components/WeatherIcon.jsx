import { getWeatherInfo } from '../../../utils/weatherCodes'

export default function WeatherIcon({ code, size = 'md' }) {
  const { icon, label } = getWeatherInfo(code)
  return (
    <span className={`weather-icon weather-icon--${size}`} role="img" aria-label={label}>
      {icon}
    </span>
  )
}
