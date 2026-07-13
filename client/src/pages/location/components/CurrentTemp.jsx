import { formatTemp } from '../../../utils/temperature'

export default function CurrentTemp({ current, unit }) {
  return (
    <div className="current-temp">
      <span className="temp-value">{formatTemp(current, unit)}°</span>
      <span className="temp-unit">{unit}</span>
    </div>
  )
}
