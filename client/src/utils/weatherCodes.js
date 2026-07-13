import { WEATHER_CODES } from '../constants/weatherCodes'

export function getWeatherInfo(code) {
  return WEATHER_CODES.find((c) => code <= c.max) ?? WEATHER_CODES[WEATHER_CODES.length - 1]
}
