import { formatTemp } from '../../../utils/temperature'
import WeatherIcon from './WeatherIcon'

export default function DayCard({ name, date, max, min, code, unit }) {
  const [, month, day] = date.split('-')
  const formatted = `${day}.${month}`

  return (
    <div className={`day-card ${name === 'Today' ? 'day-card--today' : ''}`}>
      <p className="day-card__date">{name === 'Today' ? 'Today' : formatted}</p>
      <p className="day-card__name">{name === 'Today' ? formatted : name}</p>
      <WeatherIcon code={code} size="sm" />
      <p className="day-card__max">{formatTemp(max, unit)}°</p>
      <p className="day-card__min">{formatTemp(min, unit)}°</p>
    </div>
  )
}
