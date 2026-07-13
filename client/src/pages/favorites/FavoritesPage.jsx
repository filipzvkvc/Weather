import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useFavorites } from '../../context/FavoritesContext'

import { FAVORITES_PER_PAGE } from '../../constants/pagination'

function getPageNumbers(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

  const nearby = new Set(
    [1, total, current, current - 1, current + 1].filter((p) => p >= 1 && p <= total)
  )
  const sorted = [...nearby].sort((a, b) => a - b)

  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...')
    result.push(sorted[i])
  }
  return result
}

export default function FavoritesPage() {
  const { user } = useAuth()
  const { favorites, loading, removeFavorite } = useFavorites()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState('')
  const [removingId, setRemovingId] = useState(null)

  if (!user) {
    return (
      <div className="app">
        <div className="centered">
          <p className="error-icon">🔒</p>
          <p className="hint">You need to be logged in to see your favorite locations.</p>
          <button className="location-btn" onClick={() => navigate('/login')}>Log in</button>
        </div>
      </div>
    )
  }

  async function handleRemove(id, location) {
    setRemovingId(id)
    try {
      await removeFavorite(id)
      const updated = favorites.filter((f) => f.id !== id)
      const totalPages = Math.ceil(updated.length / FAVORITES_PER_PAGE)
      if (page > totalPages) setPage(Math.max(1, totalPages))
      setToast(`${location} removed from favorites`)
      setTimeout(() => setToast(''), 2500)
    } finally {
      setRemovingId(null)
    }
  }

  const totalPages = Math.ceil(favorites.length / FAVORITES_PER_PAGE)
  const paginated = favorites.slice((page - 1) * FAVORITES_PER_PAGE, page * FAVORITES_PER_PAGE)
  const pageNumbers = getPageNumbers(page, totalPages)

  return (
    <div className="app">
      {toast && <div className="toast">{toast}</div>}
      <div className="favorites-container">
        <h1 className="favorites-title">My Locations</h1>
        {favorites.length > 0 && <p className="favorites-subtitle">Your saved favorite locations</p>}

        {loading ? (
          <div className="centered"><div className="spinner" /></div>
        ) : favorites.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon">🌍</span>
            <p className="empty-state__title">No saved locations yet</p>
            <p className="empty-state__hint">Search for a location and tap the ❤️ to save it here</p>
            <button className="location-btn" onClick={() => navigate('/')}>Search locations</button>
          </div>
        ) : (
          <>
            <ul className="favorites-list">
              {paginated.map((fav) => (
                <li key={fav.id} className="favorite-item">
                  <button
                    className="favorite-item__location"
                    onClick={() => navigate('/location', { state: { lat: fav.latitude, lon: fav.longitude, location: fav.location, country: fav.country } })}
                  >
                    <span className="favorite-item__name">{fav.location}</span>
                    <span className="favorite-item__country">{fav.country}</span>
                  </button>
                  <button
                    className="favorite-item__remove"
                    aria-label="Remove"
                    onClick={() => handleRemove(fav.id, fav.location)}
                    disabled={removingId === fav.id}
                  >
                    {removingId === fav.id ? <span className="btn-spinner" /> : '✕'}
                  </button>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination__btn"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <div className="pagination__pages">
                  {pageNumbers.map((p, i) =>
                    p === '...' ? (
                      <span key={`ellipsis-${i}`} className="pagination__ellipsis">…</span>
                    ) : (
                      <button
                        key={p}
                        className={`pagination__page${page === p ? ' pagination__page--active' : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                <button
                  className="pagination__btn"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
