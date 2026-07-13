import { formatDate } from '../../../utils/dates'

export default function LocationHeader({ location, country, date, favorite }) {
  return (
    <header className="location-header">
      <div className="location-row">
        <h1 className="location-name">{location}</h1>
        {favorite}
      </div>
      <p className="country">{country}</p>
      <p className="date">{formatDate(date)}</p>
    </header>
  )
}
