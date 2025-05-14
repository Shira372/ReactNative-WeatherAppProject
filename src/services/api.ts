import { WeatherData, ForecastData, AirQualityData, UvIndexData } from '../../types/types';

// 🔑 מפתח API של OpenWeather
const API_KEY = 'c8c4865b1ee49e2fec98a3a3b96d8b6c';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// 🛡️ פונקציית fetch עם timeout (כדי למנוע "התלייה" של הבקשה אם אין תגובה מהשרת)
const fetchWithTimeout = (url: string, options: RequestInit = {}, timeout = 8000): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    ),
  ]);
};


// 📍 1. מזג אוויר נוכחי לפי שם עיר
export const fetchCurrentWeather = async (city: string): Promise<WeatherData> => {
  try {
    const response = await fetchWithTimeout(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.status}`);
    }

    const data = await response.json();
    return data as WeatherData;

  } catch (error) {
    console.error('❌ שגיאה בקבלת מזג אוויר נוכחי:', error);
    throw error;
  }
};

// 📍 2. תחזית ל־5 ימים לפי עיר
export const fetchWeatherForecast = async (city: string): Promise<ForecastData> => {
  try {
    const response = await fetchWithTimeout(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Forecast API Error: ${response.status}`);
    }

    const data = await response.json();
    return data as ForecastData;

  } catch (error) {
    console.error('❌ שגיאה בקבלת תחזית:', error);
    throw error;
  }
};

// 📍 3. איכות אוויר לפי עיר (דורש חיפוש קואורדינטות קודם)
export const fetchAirQuality = async (city: string): Promise<AirQualityData> => {
  try {
    const geoRes = await fetchWithTimeout(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
    );

    if (!geoRes.ok) {
      throw new Error(`Geo API Error: ${geoRes.status}`);
    }

    const geoData = await geoRes.json();
    if (!geoData.length) {
      throw new Error('עיר לא נמצאה');
    }

    const { lat, lon } = geoData[0];

    const airRes = await fetchWithTimeout(
      `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    if (!airRes.ok) {
      throw new Error(`Air Quality API Error: ${airRes.status}`);
    }

    const data = await airRes.json();

    return {
      aqi: data.list[0].main.aqi,
      pm25: data.list[0].components.pm2_5,
      pm10: data.list[0].components.pm10,
      no2: data.list[0].components.no2,
      o3: data.list[0].components.o3,
      so2: data.list[0].components.so2,
      co: data.list[0].components.co,
      nh3: data.list[0].components.nh3,
      city,
    } as AirQualityData;

  } catch (error) {
    console.error('❌ שגיאה בקבלת איכות אוויר:', error);
    throw error;
  }
};

// 📍 4. מדד קרינת UV לפי עיר
export const fetchUvIndex = async (city: string): Promise<UvIndexData> => {
  try {
    const geoRes = await fetchWithTimeout(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
    );

    if (!geoRes.ok) {
      throw new Error(`Geo API Error: ${geoRes.status}`);
    }

    const geoData = await geoRes.json();
    if (!geoData.length) {
      throw new Error('עיר לא נמצאה');
    }

    const { lat, lon } = geoData[0];

    const uvRes = await fetchWithTimeout(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${API_KEY}`
    );

    if (!uvRes.ok) {
      throw new Error(`UV Index API Error: ${uvRes.status}`);
    }

    const data = await uvRes.json();

    return {
      value: data.current.uvi,
      date: new Date(data.current.dt * 1000).toISOString(),
      city,
    } as UvIndexData;

  } catch (error) {
    console.error('❌ שגיאה בקבלת UV Index:', error);
    // Fallback עבור דמו בלבד
    return {
      value: 5.2,
      city,
    };
  }
};
