import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'
import { ADMIN_PER_PAGE } from '../../constants/pagination'
import Modal from '../../components/common/Modal'

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

export default function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.is_admin) return
    api.admin.getUsers().then(setUsers).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  if (!user?.is_admin) {
    return (
      <div className="app">
        <div className="centered">
          <p className="error-icon">🔒</p>
          <p className="hint">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  async function confirmDelete() {
    const { id, email } = confirm
    setConfirm(null)
    setDeletingId(id)
    try {
      await api.admin.deleteUser(id)
      setUsers((prev) => {
        const updated = prev.filter((u) => u.id !== id)
        const totalPages = Math.ceil(updated.length / ADMIN_PER_PAGE)
        if (page > totalPages) setPage(Math.max(1, totalPages))
        return updated
      })
      setToast(`${email} deleted`)
      setTimeout(() => setToast(''), 2500)
    } finally {
      setDeletingId(null)
    }
  }

  const totalPages = Math.ceil(users.length / ADMIN_PER_PAGE)
  const paginated = users.slice((page - 1) * ADMIN_PER_PAGE, page * ADMIN_PER_PAGE)
  const pageNumbers = getPageNumbers(page, totalPages)

  return (
    <div className="app">
      {toast && <div className="toast">{toast}</div>}

      {confirm && (
        <Modal onClose={() => setConfirm(null)}>
          <h2 className="modal-title">Delete user</h2>
          <p className="modal-text">Are you sure you want to delete <strong>{confirm.email}</strong>? This cannot be undone.</p>
          <div className="modal-actions">
            <button className="admin-btn admin-btn--delete" onClick={confirmDelete}>Yes, delete</button>
            <button className="modal-cancel" onClick={() => setConfirm(null)}>Cancel</button>
          </div>
        </Modal>
      )}

      <div className="admin-container">
        <h1 className="admin-title">Users</h1>
        {loading ? (
          <div className="centered"><div className="spinner" /></div>
        ) : (
          <>
          <p className="admin-subtitle">{users.length} registered {users.length === 1 ? 'user' : 'users'}</p>

          <div className="admin-table">
          <div className="admin-table__header">
            <span>Email</span>
            <span>Role</span>
            <span>Verified</span>
            <span>Registered</span>
            <span>Actions</span>
          </div>

          {paginated.map((u) => (
            <div key={u.id} className="admin-table__row">
              <span className="admin-table__email">{u.email}</span>
              <span className={`admin-badge ${u.is_admin ? 'admin-badge--admin' : 'admin-badge--user'}`}>
                {u.is_admin ? 'Admin' : 'User'}
              </span>
              <span className={`admin-badge ${u.is_verified ? 'admin-badge--verified' : 'admin-badge--unverified'}`}>
                {u.is_verified ? 'Yes' : 'No'}
              </span>
              <span className="admin-table__date">
                {new Date(u.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
              <div className="admin-table__actions">
                <button className="admin-btn admin-btn--edit" onClick={() => navigate(`/admin/users/${u.id}`)}>
                  Edit
                </button>
                {u.id !== user.id && (
                  <button
                    className="admin-btn admin-btn--delete"
                    onClick={() => setConfirm({ id: u.id, email: u.email })}
                    disabled={deletingId === u.id}
                  >
                    {deletingId === u.id ? <span className="btn-spinner" /> : 'Delete'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

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
