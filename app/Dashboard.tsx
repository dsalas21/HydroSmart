import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "./DB/supabase";

interface Cultivo {
  id: string;
  nombre: string;
  tipo: string;
  fecha_siembra: string;
  estado: "activo" | "pausado" | "programado" | string;
  humedad?: number; // Campo para simulación rápida de tabla; los datos reales vendrán de sensores
  temperatura?: number;
  dias_hasta_cosecha?: number;
}

export default function MisCultivos() {
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    cargarCultivos();
  }, []);

  const cargarCultivos = async () => {
    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("No hay usuario autentificado");

      const { data, error } = await supabase
        .from("cultivos")
        .select("*")
        .eq("usuario_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCultivos(data as Cultivo[]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudieron cargar los cultivos.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarCultivos();
  };

  const eliminarCultivo = async (id: string) => {
    Alert.alert(
      "Eliminar Cultivo",
      "¿Estás seguro de que quieres eliminar este cultivo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.from("cultivos").delete().eq("id", id);
            if (error) {
              Alert.alert("Error", "No se pudo eliminar.");
            } else {
              setCultivos(cultivos.filter((c) => c.id !== id));
            }
          },
        },
      ]
    );
  };

  const renderCultivo = ({ item }: { item: Cultivo }) => (
    <TouchableOpacity
      style={styles.cultivoCard}
      onPress={() => router.push(`./Crop/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cultivoNombre}>{item.nombre}</Text>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
          <Text style={styles.estadoTexto}>{getEstadoTexto(item.estado)}</Text>
        </View>
      </View>
      <Text style={styles.cultivoTipo}>{item.tipo}</Text>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Siembra</Text>
          <Text style={styles.infoValue}>
            {new Date(item.fecha_siembra).toLocaleDateString("es-ES")}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Cosecha estimada</Text>
          <Text style={styles.infoValue}>
            {item.dias_hasta_cosecha ? `${item.dias_hasta_cosecha} días` : "N/A"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => eliminarCultivo(item.id)}
      >
        <Text style={styles.deleteBtnText}>🗑️ Eliminar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  function getEstadoColor(estado: string) {
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
  }

  function getEstadoTexto(estado: string) {
    switch (estado) {
      case "activo":
        return "Activo";
      case "pausado":
        return "Pausado";
      case "programado":
        return "Programado";
      default:
        return `${(estado || "").charAt(0).toUpperCase() + (estado || "").slice(1)}`;
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>HydroSmart</Text>
          <Text style={styles.headerSubtitle}>Mis Cultivos</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.push("./WeatherModule")}>
            <Text style={styles.headerButtonIcon}>🌤️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.push("./Account")}>
            <Text style={styles.headerButtonIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#4fb0fa" />
          <Text style={{ marginTop: 16, color: "#666" }}>Cargando cultivos...</Text>
        </View>
      ) : cultivos.length === 0 ? (
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* Botón para agregar nuevo cultivo */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => router.push("./AddCrop")}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
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
  headerTitle: { fontSize: 28, fontWeight: "900", color: "#000", marginBottom: 5 },
  headerSubtitle: { fontSize: 16, color: "#666" },
  headerButtons: { flexDirection: "row", gap: 10 },
  headerButton: {
    width: 44,
    height: 44,
    backgroundColor: "#4fb0fa",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerButtonIcon: { fontSize: 22 },
  listContent: { padding: 20, paddingBottom: 120, paddingTop: 10 },
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
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cultivoNombre: { fontSize: 20, fontWeight: "700", color: "#000", flex: 1 },
  estadoBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  estadoTexto: { color: "#fff", fontSize: 12, fontWeight: "600" },
  cultivoTipo: { fontSize: 14, color: "#666", marginBottom: 16 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  infoItem: { flex: 1, alignItems: "center" },
  infoLabel: { fontSize: 12, color: "#666", marginBottom: 4 },
  infoValue: { fontSize: 14, color: "#000", fontWeight: "600" },
  fechaSiembra: { fontSize: 12, color: "#999", fontStyle: "italic" },
  deleteBtn: { marginTop: 10, alignSelf: "flex-end" },
  deleteBtnText: { color: "#ff6b6b", fontWeight: "700" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40, marginTop: 60 },
  emptyIcon: { fontSize: 80, marginBottom: 20 },
  emptyTitle: { fontSize: 22, fontWeight: "700", color: "#000", marginBottom: 10 },
  emptyText: { fontSize: 16, color: "#666", textAlign: "center" },
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
  fabIcon: { fontSize: 32, color: "#fff", fontWeight: "300" },
});
