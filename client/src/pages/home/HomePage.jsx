import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLocation, reverseGeocode, searchLocation } from '../../utils/weather'
import LoadingScreen from '../../components/common/LoadingScreen'
import ErrorScreen from '../../components/common/ErrorScreen'
import { LOCATION_TIP } from '../../constants/messages'

export default function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null)
      return
    }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const data = await searchLocation(query)
        setResults(data)
      } finally {
        setSearching(false)
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [query])

  function handleSelectLocation(r) {
    navigate('/location', {
      state: { lat: r.latitude, lon: r.longitude, location: r.name, country: r.country ?? '' },
    })
  }

  async function handleUseLocation() {
    setLocating(true)
    try {
      const pos = await getLocation()
      const { latitude, longitude } = pos.coords
      const geo = await reverseGeocode(latitude, longitude)
      navigate('/location', {
        state: { lat: latitude, lon: longitude, location: geo.location, country: geo.country },
      })
    } catch (err) {
      setError(
        err.code === 1
          ? `Location access was denied.\n${LOCATION_TIP}`
          : `Failed to get your location.\n${LOCATION_TIP}`
      )
      setLocating(false)
    }
  }

  if (locating) return <LoadingScreen />
  if (error) return <ErrorScreen message={error} onBack={() => setError('')} />

  return (
    <div className="app">
      <div className="search-screen">
        <h1 className="search-title">Weather</h1>
        <p className="search-subtitle">Search for a location or use your current location</p>

        <div className="search-box">
          <input
            className="search-input"
            type="text"
            placeholder="Search location…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {searching && <p className="search-hint">Searching…</p>}
          {!searching && results !== null && results.length === 0 && (
            <p className="search-hint">No locations found.</p>
          )}
          {!searching && results !== null && results.length > 0 && (
            <ul className="search-results">
              {results.map((r) => (
                <li key={`${r.latitude}-${r.longitude}`}>
                  <button className="search-result-btn" onClick={() => handleSelectLocation(r)}>
                    <span className="result-location">{r.name}</span>
                    <span className="result-country">
                      {r.admin1 ? `${r.admin1}, ` : ''}{r.country}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="search-divider"><span>or</span></div>

        <button className="location-btn" onClick={handleUseLocation}>
          Use my location
        </button>
      </div>
    </div>
  )
}
