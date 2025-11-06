// services/weatherService.ts (VERSIÓN GRATUITA COMPLETA)
import axios from 'axios';

const OPENWEATHER_API_KEY = 'c34f4d4b9e009a7f874576874e6fbe7a';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

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

class WeatherService {
  async getCoordinates(ciudad: string): Promise<{ lat: number; lon: number }> {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: ciudad,
          appid: OPENWEATHER_API_KEY,
          units: 'metric',
        },
      });

      return {
        lat: response.data.coord.lat,
        lon: response.data.coord.lon,
      };
    } catch (error: any) {
      console.error('Error obteniendo coordenadas:', error.response?.data || error.message);
      throw new Error('No se pudo obtener la ubicación.');
    }
  }

  async getWeatherData(
    lat: number,
    lon: number,
    ciudad: string = 'Tu ubicación'
  ): Promise<WeatherResponse> {
    try {
      // 1. Clima actual
      const currentResponse = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: 'metric',
          lang: 'es',
        },
      });

      const currentData = currentResponse.data;

      // 2. Pronóstico 5 días
      const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: 'metric',
          lang: 'es',
        },
      });

      const forecastData = forecastResponse.data;

      // Procesar clima actual
      const current: WeatherCurrent = {
        temperatura: Math.round(currentData.main.temp),
        sensacionTermica: Math.round(currentData.main.feels_like),
        humedad: currentData.main.humidity,
        precipitacion: currentData.rain?.['1h'] || 0,
        viento: Math.round(currentData.wind.speed * 3.6),
        condicion: currentData.weather[0].description,
        icono: this.getWeatherIcon(currentData.weather[0].icon),
        uv: this.estimateUV(lat, currentData.clouds.all),
        presion: currentData.main.pressure,
        visibilidad: (currentData.visibility || 10000) / 1000,
      };

      // Procesar pronóstico
      const forecast = this.processForecast(forecastData.list, lat);

      return {
        current,
        forecast,
        ubicacion: ciudad,
        lat,
        lon,
        amanecer: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        atardecer: new Date(currentData.sys.sunset * 1000).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    } catch (error: any) {
      console.error('Error:', error.response?.data || error.message);
      throw new Error('No se pudo obtener el clima.');
    }
  }

  private processForecast(forecastList: any[], lat: number): PronosticoDia[] {
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const pronosticoPorDia: { [key: string]: any[] } = {};

    forecastList.forEach((item: any) => {
      const fecha = new Date(item.dt * 1000);
      const fechaStr = fecha.toISOString().split('T')[0];
      
      if (!pronosticoPorDia[fechaStr]) {
        pronosticoPorDia[fechaStr] = [];
      }
      pronosticoPorDia[fechaStr].push(item);
    });

    const forecast: PronosticoDia[] = Object.keys(pronosticoPorDia)
      .slice(0, 7)
      .map((fechaStr, index) => {
        const items = pronosticoPorDia[fechaStr];
        const fecha = new Date(fechaStr);
        
        const temps = items.map((i: any) => i.main.temp);
        const tempMax = Math.round(Math.max(...temps));
        const tempMin = Math.round(Math.min(...temps));
        
        const probLluvia = Math.round(Math.max(...items.map((i: any) => (i.pop || 0) * 100)));
        const precipitacion = items.reduce((sum: number, i: any) => sum + (i.rain?.['3h'] || 0), 0);
        
        const itemMediodia = items.find((i: any) => {
          const hora = new Date(i.dt * 1000).getHours();
          return hora >= 12 && hora <= 15;
        }) || items[0];
        
        return {
          fecha: fechaStr,
          dia: index === 0 ? 'Hoy' : index === 1 ? 'Mañana' : diasSemana[fecha.getDay()],
          tempMax,
          tempMin,
          probLluvia,
          precipitacion: Math.round(precipitacion * 10) / 10,
          icono: this.getWeatherIcon(itemMediodia.weather[0].icon),
          condicion: itemMediodia.weather[0].description,
          humedad: Math.round(items.reduce((sum: number, i: any) => sum + i.main.humidity, 0) / items.length),
          viento: Math.round(items.reduce((sum: number, i: any) => sum + i.wind.speed, 0) / items.length * 3.6),
          uv: this.estimateUV(lat, itemMediodia.clouds.all),
        };
      });

    return forecast;
  }

  private estimateUV(lat: number, cloudCover: number): number {
    const absLat = Math.abs(lat);
    let baseUV = 10;
    
    if (absLat > 40) baseUV = 6;
    else if (absLat > 30) baseUV = 8;
    else if (absLat < 20) baseUV = 11;
    
    const uvReduction = (cloudCover / 100) * 0.5;
    return Math.round(baseUV * (1 - uvReduction));
  }

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

  async getWeatherByCityName(ciudad: string): Promise<WeatherResponse> {
    const coords = await this.getCoordinates(ciudad);
    return this.getWeatherData(coords.lat, coords.lon, ciudad);
  }

  calculateET(tempMax: number, tempMin: number, lat: number, dayOfYear: number): number {
    const tempMedia = (tempMax + tempMin) / 2;
    const rangoTemp = tempMax - tempMin;
    const Ra = this.calcularRadiacionExtraterrestre(lat, dayOfYear);
    const et0 = 0.0023 * (tempMedia + 17.8) * Math.pow(rangoTemp, 0.5) * Ra;
    return Math.round(et0 * 10) / 10;
  }

  private calcularRadiacionExtraterrestre(lat: number, dayOfYear: number): number {
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

export default new WeatherService();
