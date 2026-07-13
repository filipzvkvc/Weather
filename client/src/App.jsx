import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import Navbar from './components/layout/Navbar'
import HomePage from './pages/home/HomePage'
import LocationPage from './pages/location/LocationPage'
import LoginPage from './pages/login/LoginPage'
import RegisterPage from './pages/register/RegisterPage'
import FavoritesPage from './pages/favorites/FavoritesPage'
import AdminPage from './pages/admin/AdminPage'
import AdminUserPage from './pages/admin/AdminUserPage'
import ForgotPasswordPage from './pages/forgot-password/ForgotPasswordPage'
import ResetPasswordPage from './pages/reset-password/ResetPasswordPage'
import ProfilePage from './pages/profile/ProfilePage'
import VerifyResultPage from './pages/verify-result/VerifyResultPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
        <div className="layout">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/users/:id" element={<AdminUserPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/verify-result" element={<VerifyResultPage />} />
          </Routes>
        </div>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
