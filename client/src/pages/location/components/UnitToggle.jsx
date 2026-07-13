export default function UnitToggle({ unit, onChange }) {
  return (
    <div className="unit-toggle">
      <button
        className={`unit-btn ${unit === 'C' ? 'unit-btn--active' : ''}`}
        onClick={() => onChange('C')}
      >
        °C
      </button>
      <button
        className={`unit-btn ${unit === 'F' ? 'unit-btn--active' : ''}`}
        onClick={() => onChange('F')}
      >
        °F
      </button>
    </div>
  )
}
