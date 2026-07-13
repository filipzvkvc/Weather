export default function LoadingScreen({ message = 'Detecting your location…' }) {
  return (
    <div className="app">
      <div className="centered">
        <div className="spinner" />
        <p className="hint">{message}</p>
      </div>
    </div>
  )
}
