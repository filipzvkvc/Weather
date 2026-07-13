import { useState, useEffect } from 'react'
import { getTimeString } from '../../../utils/time'

export default function LocalTime({ timezone }) {
  const [time, setTime] = useState(() => getTimeString(timezone))

  useEffect(() => {
    setTime(getTimeString(timezone))
    const id = setInterval(() => setTime(getTimeString(timezone)), 1000)
    return () => clearInterval(id)
  }, [timezone])

  return <p className="local-time">{time}</p>
}
