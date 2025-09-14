interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  snow?: {
    '1h'?: number;
    '3h'?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      '3h': number;
    };
    snow?: {
      '3h': number;
    };
    sys: {
      pod: string;
    };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

interface AirPollutionData {
  coord: [number, number];
  list: Array<{
    dt: number;
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }>;
}

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

if (!OPENWEATHER_API_KEY) {
  console.warn('OpenWeatherMap API key is not set. Weather data will not be available.');
}

export const getWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  if (!OPENWEATHER_API_KEY) {
    console.error('OpenWeatherMap API key is not defined');
    throw new Error('OpenWeatherMap API key is not defined. Please check your environment variables.');
  }

  const response = await fetch(
    `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }

  return response.json();
};

export const getWeatherByCity = async (city: string, countryCode?: string): Promise<WeatherData> => {
  if (!OPENWEATHER_API_KEY) {
    console.error('OpenWeatherMap API key is not defined');
    throw new Error('OpenWeatherMap API key is not defined. Please check your environment variables.');
  }

  const query = countryCode ? `${city},${countryCode}` : city;
  const response = await fetch(
    `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(query)}&appid=${OPENWEATHER_API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }

  return response.json();
};

export const getForecastByCoords = async (lat: number, lon: number): Promise<ForecastData> => {
  if (!OPENWEATHER_API_KEY) {
    console.error('OpenWeatherMap API key is not defined');
    throw new Error('OpenWeatherMap API key is not defined. Please check your environment variables.');
  }

  const response = await fetch(
    `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&cnt=40`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch forecast data: ${response.statusText}`);
  }

  return response.json();
};

export const getAirPollution = async (lat: number, lon: number): Promise<AirPollutionData> => {
  if (!OPENWEATHER_API_KEY) {
    console.error('OpenWeatherMap API key is not defined');
    throw new Error('OpenWeatherMap API key is not defined. Please check your environment variables.');
  }

  const response = await fetch(
    `${OPENWEATHER_BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch air pollution data: ${response.statusText}`);
  }

  return response.json();
};

export const getLocationName = async (lat: number, lon: number): Promise<{ name: string; country: string }> => {
  if (!OPENWEATHER_API_KEY) {
    throw new Error('OpenWeatherMap API key is not defined');
  }

  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to get location name');
  }

  const data = await response.json();
  if (!data || data.length === 0) {
    throw new Error('No location found for the given coordinates');
  }

  return {
    name: data[0].name,
    country: data[0].country
  };
};

export const searchLocations = async (query: string): Promise<Array<{
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}>> => {
  if (!OPENWEATHER_API_KEY) {
    console.error('OpenWeatherMap API key is not defined');
    throw new Error('OpenWeatherMap API key is not defined. Please check your environment variables.');
  }

  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${OPENWEATHER_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`Failed to search locations: ${response.statusText}`);
  }

  const data = await response.json();
  return data.map((location: any) => ({
    name: location.name,
    lat: location.lat,
    lon: location.lon,
    country: location.country,
    state: location.state,
  }));
};
