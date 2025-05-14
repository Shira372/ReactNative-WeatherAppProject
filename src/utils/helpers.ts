// utils/helpers.ts
export const getWeatherIconName = (weatherMain: string): string => {
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return 'weather-sunny';
      case 'clouds':
        return 'weather-cloudy';
      case 'rain':
        return 'weather-rainy';
      case 'drizzle':
        return 'weather-pouring';
      case 'thunderstorm':
        return 'weather-lightning';
      case 'snow':
        return 'weather-snowy';
      case 'mist':
      case 'smoke':
      case 'haze':
      case 'dust':
      case 'fog':
        return 'weather-fog';
      default:
        return 'weather-partly-cloudy';
    }
  };
  
  export const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  export const formatTemperature = (temp: number): string => {
    return `${Math.round(temp)}°C`;
  };
  
  export const getUVIndexCategory = (value: number): { level: string; color: string } => {
    if (value <= 2) return { level: 'Low', color: '#299501' };
    if (value <= 5) return { level: 'Moderate', color: '#F7E400' };
    if (value <= 7) return { level: 'High', color: '#F85900' };
    if (value <= 10) return { level: 'Very High', color: '#D80011' };
    return { level: 'Extreme', color: '#6B49C8' };
  };
  
  export const getAirQualityCategory = (aqi: number): { level: string; color: string } => {
    if (aqi <= 50) return { level: 'Good', color: '#00E400' };
    if (aqi <= 100) return { level: 'Moderate', color: '#FFFF00' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#FF7E00' };
    if (aqi <= 200) return { level: 'Unhealthy', color: '#FF0000' };
    if (aqi <= 300) return { level: 'Very Unhealthy', color: '#99004C' };
    return { level: 'Hazardous', color: '#7E0023' };
  };