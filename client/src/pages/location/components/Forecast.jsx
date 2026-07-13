import { useState } from 'react'
import DayCard from './DayCard'
import { FORECAST_PAGE_SIZE } from '../../../constants/pagination'

export default function Forecast({ days, unit }) {
  const [page, setPage] = useState(0)

  const start = page * FORECAST_PAGE_SIZE
  const visible = days.slice(start, start + FORECAST_PAGE_SIZE)
  const hasPrev = page > 0
  const hasNext = start + FORECAST_PAGE_SIZE < days.length

  return (
    <div className="forecast-wrapper">
      <div className="forecast">
        {visible.map((day) => (
          <DayCard key={day.date} name={day.name} date={day.date} max={day.max} min={day.min} code={day.code} unit={unit} />
        ))}
      </div>
      <div className="forecast-nav">
        <button className="nav-btn" onClick={() => setPage((p) => p - 1)} disabled={!hasPrev}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="nav-btn" onClick={() => setPage((p) => p + 1)} disabled={!hasNext}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
