import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { fetchWeather } from '../../utils/weather'
import { buildForecastDays } from '../../utils/dates'
import LoadingScreen from '../../components/common/LoadingScreen'
import ErrorScreen from '../../components/common/ErrorScreen'
import LocationHeader from './components/LocationHeader'
import CurrentTemp from './components/CurrentTemp'
import Forecast from './components/Forecast'
import LocalTime from './components/LocalTime'
import UnitToggle from './components/UnitToggle'
import WeatherIcon from './components/WeatherIcon'
import FavoriteButton from './components/FavoriteButton'

export default function LocationPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [days, setDays] = useState([])
  const [error, setError] = useState('')
  const [unit, setUnit] = useState(() => localStorage.getItem('unit') || 'C')
  const [timezone, setTimezone] = useState('')
  const [currentTemp, setCurrentTemp] = useState(null)
  const [currentCode, setCurrentCode] = useState(0)

  useEffect(() => {
    if (!state?.lat) {
      navigate('/')
      return
    }
    fetchWeather(state.lat, state.lon)
      .then((weather) => {
        setTimezone(weather.timezone)
        setCurrentTemp(Math.round(weather.current.temperature_2m))
        setCurrentCode(weather.current.weathercode)
        setDays(buildForecastDays(weather))
        setStatus('success')
      })
      .catch(() => {
        setError('Failed to load weather data. Please check your connection and try again.')
        setStatus('error')
      })
  }, [state])

  if (status === 'loading') return <LoadingScreen message="Loading weather…" />
  if (status === 'error') return <ErrorScreen message={error} onBack={() => navigate('/')} />

  return (
    <div className="app">
      <div className="container">
        <LocationHeader
          location={state.location}
          country={state.country}
          date={days[0].date}
          favorite={<FavoriteButton key={`${state.location}-${state.country}`} location={state.location} country={state.country} latitude={state.lat} longitude={state.lon} initialFavoriteId={state.favoriteId ?? null} />}
        />
        <UnitToggle unit={unit} onChange={(v) => { setUnit(v); localStorage.setItem('unit', v) }} />
        <WeatherIcon code={currentCode} size="lg" />
        <CurrentTemp current={currentTemp} unit={unit} />
        <LocalTime timezone={timezone} />
        <Forecast days={days} unit={unit} />
        <Link to="/" className="back-btn">Search new location</Link>
      </div>
    </div>
  )
}
