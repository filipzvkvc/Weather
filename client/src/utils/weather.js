export function getLocation() {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 15000 })
  )
}

export async function searchLocation(query) {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`
  )
  const data = await res.json()
  return data.results ?? []
}

export async function reverseGeocode(lat, lon) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    { headers: { 'Accept-Language': 'en' } }
  )
  const data = await res.json()
  const location =
    data.address.city ||
    data.address.town ||
    data.address.village ||
    data.address.municipality ||
    data.address.county ||
    'Unknown'
  return { location, country: data.address.country || '' }
}

export async function fetchWeather(lat, lon) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=12`
  )
  return res.json()
}
