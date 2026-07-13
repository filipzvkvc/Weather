import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useFavorites } from '../../../context/FavoritesContext'
import Modal from '../../../components/common/Modal'

export default function FavoriteButton({ location, country, latitude, longitude }) {
  const { user } = useAuth()
  const { getFavoriteId, addFavorite, removeFavorite } = useFavorites()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState({ message: '', success: false })

  const favoriteId = getFavoriteId(location, country)
  const saved = favoriteId !== null

  async function handleClick() {
    if (!user) {
      setShowModal(true)
      return
    }
    try {
      if (favoriteId) {
        await removeFavorite(favoriteId)
        setToast({ message: `${location} removed from favorites`, success: false })
      } else {
        await addFavorite(location, country, latitude, longitude)
        setToast({ message: `${location} added to favorites`, success: true })
      }
      setTimeout(() => setToast({ message: '', success: false }), 2500)
    } catch (err) {
      setToast({ message: err.message || 'Something went wrong', success: false })
      setTimeout(() => setToast({ message: '', success: false }), 3000)
    }
  }

  return (
    <div className="favorite-wrapper">
      <button className="favorite-btn" onClick={handleClick} aria-label="Save to favorites">
        {saved ? '❤️' : '🤍'}
      </button>

      {toast.message && (
        <div className={`toast${toast.success ? ' toast--success' : ''}`}>{toast.message}</div>
      )}

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 className="modal-title">Login required</h2>
          <p className="modal-text">
            You need to be logged in to save favorite locations.
          </p>
          <div className="modal-actions">
            <button className="auth-btn" onClick={() => navigate('/login')}>
              Log in
            </button>
            <button className="modal-cancel" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
