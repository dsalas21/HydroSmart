import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ScrollView 
} from "react-native";
import { Link, router } from "expo-router";

interface Cultivo {
  id: string;
  nombre: string;
  tipo: string;
  fechaSiembra: string;
  estadoRiego: "activo" | "pausado" | "programado";
  humedad: number;
  temperatura: number;
  diasHastaCosecha: number;
}

export default function MisCultivos() {
  const [cultivos, setCultivos] = useState<Cultivo[]>([
    {
      id: "1",
      nombre: "Tomates Cherry",
      tipo: "Tomate",
      fechaSiembra: "2025-10-15",
      estadoRiego: "activo",
      humedad: 65,
      temperatura: 24,
      diasHastaCosecha: 45,
    },
    {
      id: "2",
      nombre: "Lechugas Orgánicas",
      tipo: "Lechuga",
      fechaSiembra: "2025-10-20",
      estadoRiego: "programado",
      humedad: 70,
      temperatura: 22,
      diasHastaCosecha: 25,
    },
  ]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "#4fb0fa";
      case "pausado":
        return "#ff6b6b";
      case "programado":
        return "#51cf66";
      default:
        return "#999";
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case "activo":
        return "Riego Activo";
      case "pausado":
        return "Pausado";
      case "programado":
        return "Programado";
      default:
        return "Desconocido";
    }
  };

  const renderCultivo = ({ item }: { item: Cultivo }) => (
    <TouchableOpacity 
      style={styles.cultivoCard}
   //   onPress={() => router.push(`/Crop/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cultivoNombre}>{item.nombre}</Text>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estadoRiego) }]}>
          <Text style={styles.estadoTexto}>{getEstadoTexto(item.estadoRiego)}</Text>
        </View>
      </View>

      <Text style={styles.cultivoTipo}>{item.tipo}</Text>
      
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>💧 Humedad</Text>
          <Text style={styles.infoValue}>{item.humedad}%</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>🌡️ Temp.</Text>
          <Text style={styles.infoValue}>{item.temperatura}°C</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>📅 Cosecha</Text>
          <Text style={styles.infoValue}>{item.diasHastaCosecha}d</Text>
        </View>
      </View>

      <Text style={styles.fechaSiembra}>
        Sembrado: {new Date(item.fechaSiembra).toLocaleDateString('es-ES')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header con botones de navegación */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>HydroSmart</Text>
          <Text style={styles.headerSubtitle}>Mis Cultivos</Text>
        </View>
        
        <View style={styles.headerButtons}>
          {/* Botón de Clima */}
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/WeatherModule')}
          >
            <Text style={styles.headerButtonIcon}>🌤️</Text>
          </TouchableOpacity>

          {/* Botón de Perfil */}
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/Account')}
          >
            <Text style={styles.headerButtonIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Widget de Clima Rápido */}
      <TouchableOpacity 
        style={styles.weatherWidget}
        onPress={() => router.push('/WeatherModule')}
      >
        <View style={styles.weatherWidgetLeft}>
          <Text style={styles.weatherWidgetIcon}>☀️</Text>
          <View>
            <Text style={styles.weatherWidgetTemp}>24°C</Text>
            <Text style={styles.weatherWidgetCondition}>Parcialmente nublado</Text>
          </View>
        </View>
        
        <View style={styles.weatherWidgetRight}>
          <View style={styles.weatherWidgetDetail}>
            <Text style={styles.weatherWidgetDetailLabel}>💧 Humedad</Text>
            <Text style={styles.weatherWidgetDetailValue}>65%</Text>
          </View>
          <View style={styles.weatherWidgetDetail}>
            <Text style={styles.weatherWidgetDetailLabel}>🌧️ Lluvia</Text>
            <Text style={styles.weatherWidgetDetailValue}>20%</Text>
          </View>
        </View>

        <View style={styles.weatherWidgetArrow}>
          <Text style={styles.arrowIcon}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Lista de cultivos */}
      {cultivos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🌱</Text>
          <Text style={styles.emptyTitle}>No tienes cultivos</Text>
          <Text style={styles.emptyText}>
            Comienza agregando tu primer cultivo
          </Text>
        </View>
      ) : (
        <FlatList
          data={cultivos}
          renderItem={renderCultivo}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Botón flotante para agregar cultivo */}
      <TouchableOpacity 
        style={styles.fabButton}
        onPress={() => router.push('/AddCrop')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#000",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    backgroundColor: "#4fb0fa",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerButtonIcon: {
    fontSize: 22,
  },
  weatherWidget: {
    backgroundColor: "#fff",
    margin: 20,
    marginBottom: 10,
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  weatherWidgetLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  weatherWidgetIcon: {
    fontSize: 48,
    marginRight: 12,
  },
  weatherWidgetTemp: {
    fontSize: 24,
    fontWeight: "900",
    color: "#000",
  },
  weatherWidgetCondition: {
    fontSize: 12,
    color: "#666",
  },
  weatherWidgetRight: {
    marginLeft: 16,
  },
  weatherWidgetDetail: {
    marginBottom: 8,
  },
  weatherWidgetDetailLabel: {
    fontSize: 11,
    color: "#999",
  },
  weatherWidgetDetailValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
  weatherWidgetArrow: {
    marginLeft: 12,
  },
  arrowIcon: {
    fontSize: 28,
    color: "#4fb0fa",
    fontWeight: "300",
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  cultivoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cultivoNombre: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    flex: 1,
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  estadoTexto: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  cultivoTipo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  fechaSiembra: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  fabButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4fb0fa",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "300",
  },
});
