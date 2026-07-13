import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { api } from '../utils/api'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setFavorites([])
      setLoading(false)
      return
    }
    setLoading(true)
    api.getFavorites()
      .then(setFavorites)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  function getFavoriteId(location, country) {
    const match = favorites.find((f) => f.location === location && f.country === country)
    return match ? match.id : null
  }

  async function addFavorite(location, country, latitude, longitude) {
    const result = await api.addFavorite(location, country, latitude, longitude)
    setFavorites((prev) => [...prev, result])
    return result
  }

  async function removeFavorite(id) {
    await api.removeFavorite(id)
    setFavorites((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <FavoritesContext.Provider value={{ favorites, loading, getFavoriteId, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}
