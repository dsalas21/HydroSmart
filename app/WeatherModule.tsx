// app/clima.tsx (COMPLETO Y CORREGIDO)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import WeatherServices, { WeatherResponse } from "./services/WheaterServices";

export default function Clima() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tu ubicación por defecto (puedes obtenerla del perfil de usuario)
  const ubicacionUsuario = "La Paz, Baja California Sur";

  useEffect(() => {
    loadWeatherData();
  }, []);

const loadWeatherData = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // ✅ USAR API REAL
    const data = await WeatherServices.getWeatherByCityName(ubicacionUsuario);
    setWeatherData(data);
    
    // Calcular ET
    const hoy = new Date();
    const dayOfYear = Math.floor((hoy.getTime() - new Date(hoy.getFullYear(), 0, 0).getTime()) / 86400000);
    const et = WeatherServices.calculateET(
      data.forecast[0].tempMax,
      data.forecast[0].tempMin,
      data.lat,
      dayOfYear
    );
    
    console.log('✅ Clima real cargado. ET:', et, 'mm/día');
    
  } catch (err: any) {
    setError('No se pudo cargar el clima. Verifica tu conexión.');
    console.error('Error:', err.message);
  } finally {
    setLoading(false);
  }
};

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWeatherData();
    setRefreshing(false);
  };

  const generarRecomendaciones = () => {
    if (!weatherData) return [];

    const recomendaciones = [];
    const { current, forecast } = weatherData;

    // Revisar lluvia próxima
    if (forecast[1]?.probLluvia > 70) {
      recomendaciones.push({
        tipo: "warning",
        titulo: "Suspender riego mañana",
        descripcion: `Se pronostica ${forecast[1].precipitacion}mm de lluvia (${forecast[1].probLluvia}% probabilidad)`,
        icono: "🌧️",
      });
    }

    // Temperatura alta
    if (current.temperatura > 30) {
      recomendaciones.push({
        tipo: "danger",
        titulo: "Calor extremo detectado",
        descripcion: "Aumenta la frecuencia de riego. Riega preferiblemente por la noche.",
        icono: "🔥",
      });
    }

    // Humedad baja
    if (current.humedad < 40) {
      recomendaciones.push({
        tipo: "warning",
        titulo: "Humedad baja",
        descripcion: "Las plantas pueden necesitar riego adicional.",
        icono: "🏜️",
      });
    }

    // UV alto
    if (current.uv >= 8) {
      recomendaciones.push({
        tipo: "warning",
        titulo: "Índice UV muy alto",
        descripcion: "Riega temprano por la mañana o al atardecer.",
        icono: "☀️",
      });
    }

    // Condiciones óptimas
    if (
      current.temperatura >= 18 &&
      current.temperatura <= 28 &&
      current.humedad >= 50 &&
      current.humedad <= 70
    ) {
      recomendaciones.push({
        tipo: "success",
        titulo: "Condiciones óptimas",
        descripcion: "Perfecto para riego normal.",
        icono: "✅",
      });
    }

    return recomendaciones;
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "success": return "#51cf66";
      case "warning": return "#ffa94d";
      case "danger": return "#ff6b6b";
      case "info": return "#4fb0fa";
      default: return "#999";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4fb0fa" />
        <Text style={styles.loadingText}>Cargando clima...</Text>
      </View>
    );
  }

  if (error || !weatherData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>❌</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadWeatherData}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const recomendaciones = generarRecomendaciones();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clima e Irrigación</Text>
      </View>

      {/* Clima Actual */}
      <View style={styles.currentWeatherCard}>
        <Text style={styles.locationText}>{weatherData.ubicacion}</Text>
        <Text style={styles.currentIcon}>{weatherData.current.icono}</Text>
        <Text style={styles.currentTemp}>{weatherData.current.temperatura}°C</Text>
        <Text style={styles.currentCondition}>{weatherData.current.condicion}</Text>
        <Text style={styles.currentFeels}>
          Sensación térmica: {weatherData.current.sensacionTermica}°C
        </Text>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>💧</Text>
            <Text style={styles.detailValue}>{weatherData.current.humedad}%</Text>
            <Text style={styles.detailLabel}>Humedad</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>💨</Text>
            <Text style={styles.detailValue}>{weatherData.current.viento} km/h</Text>
            <Text style={styles.detailLabel}>Viento</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>☀️</Text>
            <Text style={styles.detailValue}>UV {weatherData.current.uv}</Text>
            <Text style={styles.detailLabel}>Índice UV</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>🌧️</Text>
            <Text style={styles.detailValue}>{weatherData.current.precipitacion} mm</Text>
            <Text style={styles.detailLabel}>Precipitación</Text>
          </View>
        </View>

        <View style={styles.sunTimes}>
          <Text style={styles.sunTime}>🌅 {weatherData.amanecer}</Text>
          <Text style={styles.sunTime}>🌇 {weatherData.atardecer}</Text>
        </View>
      </View>

      {/* Recomendaciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌱 Recomendaciones de Riego</Text>
        {recomendaciones.map((rec, index) => (
          <View
            key={index}
            style={[
              styles.recommendationCard,
              { borderLeftColor: getTipoColor(rec.tipo), borderLeftWidth: 4 },
            ]}
          >
            <View style={styles.recHeader}>
              <Text style={styles.recIcon}>{rec.icono}</Text>
              <Text style={styles.recTitle}>{rec.titulo}</Text>
            </View>
            <Text style={styles.recDescription}>{rec.descripcion}</Text>
          </View>
        ))}
      </View>

      {/* Pronóstico 7 días */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Pronóstico de 7 días</Text>
        {weatherData.forecast.map((dia, index) => (
          <View key={index} style={styles.forecastCard}>
            <Text style={styles.forecastDay}>{dia.dia}</Text>
            <Text style={styles.forecastIcon}>{dia.icono}</Text>
            <View style={styles.forecastTemps}>
              <Text style={styles.forecastTempMax}>{dia.tempMax}°</Text>
              <Text style={styles.forecastTempMin}>{dia.tempMin}°</Text>
            </View>
            <View style={styles.forecastRain}>
              <Text style={styles.forecastRainProb}>💧 {dia.probLluvia}%</Text>
              {dia.precipitacion > 0 && (
                <Text style={styles.forecastRainAmount}>{dia.precipitacion}mm</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Cálculo ET */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Evapotranspiración (ET)</Text>
        <View style={styles.etCard}>
          <Text style={styles.etValue}>4.2 mm/día</Text>
          <Text style={styles.etLabel}>Pérdida estimada de agua</Text>
          <Text style={styles.etDescription}>
            Basado en temperatura, humedad y viento. Tus cultivos necesitan aproximadamente 4.2mm de
            agua por día.
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  // ESTILOS DE LOADING
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  // ESTILOS DE ERROR
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 40,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#4fb0fa",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  // HEADER
  header: {
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 28,
    color: "#4fb0fa",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  // CLIMA ACTUAL
  currentWeatherCard: {
    backgroundColor: "#4fb0fa",
    margin: 20,
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
  },
  locationText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 10,
  },
  currentIcon: {
    fontSize: 80,
    marginBottom: 10,
  },
  currentTemp: {
    fontSize: 64,
    fontWeight: "900",
    color: "#fff",
  },
  currentCondition: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 5,
    textTransform: "capitalize",
  },
  currentFeels: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  detailItem: {
    alignItems: "center",
    width: "45%",
    marginBottom: 15,
  },
  detailIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  detailLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  sunTimes: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.3)",
  },
  sunTime: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  // SECCIONES
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 15,
  },
  // RECOMENDACIONES
  recommendationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  recIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  recTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    flex: 1,
  },
  recDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  // PRONÓSTICO
  forecastCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    width: 60,
  },
  forecastIcon: {
    fontSize: 32,
  },
  forecastTemps: {
    flexDirection: "row",
    gap: 8,
  },
  forecastTempMax: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  forecastTempMin: {
    fontSize: 16,
    color: "#999",
  },
  forecastRain: {
    alignItems: "flex-end",
  },
  forecastRainProb: {
    fontSize: 14,
    color: "#4fb0fa",
    fontWeight: "600",
  },
  forecastRainAmount: {
    fontSize: 12,
    color: "#999",
  },
  // EVAPOTRANSPIRACIÓN
  etCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  etValue: {
    fontSize: 48,
    fontWeight: "900",
    color: "#4fb0fa",
  },
  etLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 10,
  },
  etDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});
