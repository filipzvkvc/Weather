export default function ErrorScreen({ message, onBack }) {
  return (
    <div className="app">
      <div className="centered">
        <p className="error-icon">⚠</p>
        <p className="hint">{message}</p>
        {onBack && (
          <button className="location-btn" onClick={onBack}>
            Back to search
          </button>
        )}
      </div>
    </div>
  )
}
