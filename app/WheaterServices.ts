import axios from 'axios';

const OPENWEATHER_API_KEY = 'c34f4d4b9e009a7f874576874e6fbe7a'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const ONE_CALL_URL = 'https://api.openweathermap.org/data/3.0/onecall';

export interface WeatherCurrent {
  temperatura: number;
  sensacionTermica: number;
  humedad: number;
  precipitacion: number;
  viento: number;
  condicion: string;
  icono: string;
  uv: number;
  presion: number;
  visibilidad: number;
}

export interface PronosticoDia {
  fecha: string;
  dia: string;
  tempMax: number;
  tempMin: number;
  probLluvia: number;
  precipitacion: number;
  icono: string;
  condicion: string;
  humedad: number;
  viento: number;
  uv: number;
}

export interface WeatherResponse {
  current: WeatherCurrent;
  forecast: PronosticoDia[];
  ubicacion: string;
  lat: number;
  lon: number;
  amanecer: string;
  atardecer: string;
}

class WeatherServices {
  /**
   * Obtiene coordenadas desde nombre de ciudad
   */
  async getCoordinates(ciudad: string): Promise<{ lat: number; lon: number }> {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: ciudad,
          appid: OPENWEATHER_API_KEY,
        },
      });

      return {
        lat: response.data.coord.lat,
        lon: response.data.coord.lon,
      };
    } catch (error) {
      console.error('Error obteniendo coordenadas:', error);
      throw new Error('No se pudo obtener la ubicación');
    }
  }

  /**
   * Obtiene clima actual y pronóstico de 7 días
   */
  async getWeatherData(
    lat: number,
    lon: number,
    ciudad: string = 'Tu ubicación'
  ): Promise<WeatherResponse> {
    try {
      // Llamada a One Call API 3.0 (incluye actual + pronóstico 7 días)
      const response = await axios.get(ONE_CALL_URL, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: 'metric', // Para Celsius
          lang: 'es',
          exclude: 'minutely,hourly', // Excluir datos innecesarios
        },
      });

      const data = response.data;

      // Procesar clima actual
      const current: WeatherCurrent = {
        temperatura: Math.round(data.current.temp),
        sensacionTermica: Math.round(data.current.feels_like),
        humedad: data.current.humidity,
        precipitacion: data.current.rain?.['1h'] || 0,
        viento: Math.round(data.current.wind_speed * 3.6), // m/s a km/h
        condicion: data.current.weather[0].description,
        icono: this.getWeatherIcon(data.current.weather[0].icon),
        uv: Math.round(data.current.uvi),
        presion: data.current.pressure,
        visibilidad: data.current.visibility / 1000, // metros a km
      };

      // Procesar pronóstico 7 días
      const forecast: PronosticoDia[] = data.daily.slice(0, 7).map((day: any, index: number) => {
        const fecha = new Date(day.dt * 1000);
        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        
        return {
          fecha: fecha.toISOString().split('T')[0],
          dia: index === 0 ? 'Hoy' : index === 1 ? 'Mañana' : diasSemana[fecha.getDay()],
          tempMax: Math.round(day.temp.max),
          tempMin: Math.round(day.temp.min),
          probLluvia: Math.round(day.pop * 100), // Probabilidad de precipitación
          precipitacion: day.rain || 0,
          icono: this.getWeatherIcon(day.weather[0].icon),
          condicion: day.weather[0].description,
          humedad: day.humidity,
          viento: Math.round(day.wind_speed * 3.6),
          uv: Math.round(day.uvi),
        };
      });

      return {
        current,
        forecast,
        ubicacion: ciudad,
        lat,
        lon,
        amanecer: new Date(data.current.sunrise * 1000).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        atardecer: new Date(data.current.sunset * 1000).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    } catch (error) {
      console.error('Error obteniendo datos del clima:', error);
      throw new Error('No se pudo obtener el clima');
    }
  }

  /**
   * Convierte código de icono de OpenWeather a emoji
   */
  private getWeatherIcon(code: string): string {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️',
    };

    return iconMap[code] || '🌤️';
  }

  /**
   * Obtiene clima por ciudad
   */
  async getWeatherByCityName(ciudad: string): Promise<WeatherResponse> {
    const coords = await this.getCoordinates(ciudad);
    return this.getWeatherData(coords.lat, coords.lon, ciudad);
  }

  /**
   * Calcula Evapotranspiración (ET) usando fórmula simplificada de Hargreaves
   */
  calculateET(tempMax: number, tempMin: number, lat: number, dayOfYear: number): number {
    const tempMedia = (tempMax + tempMin) / 2;
    const rangoTemp = tempMax - tempMin;
    
    // Radiación extraterrestre aproximada (MJ/m²/día)
    const Ra = this.calcularRadiacionExtraterrestre(lat, dayOfYear);
    
    // Fórmula de Hargreaves: ET0 = 0.0023 × (Tmean + 17.8) × (Tmax - Tmin)^0.5 × Ra
    const et0 = 0.0023 * (tempMedia + 17.8) * Math.pow(rangoTemp, 0.5) * Ra;
    
    return Math.round(et0 * 10) / 10; // Redondear a 1 decimal
  }

  private calcularRadiacionExtraterrestre(lat: number, dayOfYear: number): number {
    // Simplificación para el ejemplo - en producción usar fórmula completa FAO-56
    const latRad = (lat * Math.PI) / 180;
    const dr = 1 + 0.033 * Math.cos((2 * Math.PI * dayOfYear) / 365);
    const delta = 0.409 * Math.sin((2 * Math.PI * dayOfYear) / 365 - 1.39);
    
    const ws = Math.acos(-Math.tan(latRad) * Math.tan(delta));
    const Ra = (24 * 60 / Math.PI) * 0.082 * dr * 
               (ws * Math.sin(latRad) * Math.sin(delta) + 
                Math.cos(latRad) * Math.cos(delta) * Math.sin(ws));
    
    return Ra;
  }
}

export default new WeatherServices();
