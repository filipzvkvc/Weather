import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  function navClass(path) {
    return location.pathname === path ? 'nav-link nav-link--active' : 'nav-link'
  }

  return (
    <nav className="navbar">
      <Link to="/" className={navClass('/')}>Home</Link>
      {user && <Link to="/favorites" className={navClass('/favorites')}>Favorites</Link>}
      {user && <Link to="/profile" className={navClass('/profile')}>Profile</Link>}
      {user?.is_admin === 1 && <Link to="/admin" className={navClass('/admin')}>Admin</Link>}
      {user ? (
        <button className="nav-link nav-logout" onClick={handleLogout}>Log out</button>
      ) : (
        <>
          <Link to="/login" className={navClass('/login')}>Log in</Link>
          <Link to="/register" className={navClass('/register')}>Register</Link>
        </>
      )}
    </nav>
  )
}
