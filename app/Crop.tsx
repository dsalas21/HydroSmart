import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { supabase } from "./DB/supabase";

export default function DetalleCultivo() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [cultivo, setCultivo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDetalle();
  }, [id]);

  const cargarDetalle = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cultivos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setCultivo(data);
    } catch (err: any) {
      Alert.alert("Error", err.message || "No se pudo cargar el cultivo.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const eliminarCultivo = async () => {
    Alert.alert(
      "Eliminar Cultivo",
      "¿Estás seguro de eliminar este cultivo? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            const { error } = await supabase.from("cultivos").delete().eq("id", id);
            if (!error) {
              Alert.alert("Eliminado", "El cultivo ha sido eliminado.");
              router.replace("./Dashboard");
            } else {
              Alert.alert("Error", error.message);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (loading || !cultivo) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}>
        <ActivityIndicator size="large" color="#4fb0fa" />
        <Text style={{ marginTop: 18, color: "#999" }}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{cultivo.nombre}</Text>
        <TouchableOpacity onPress={() => router.push(`./Crop/${id}/EditCrop`)}>
          <Text style={styles.headerEdit}>✎</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.label}>Tipo de planta:</Text>
        <Text style={styles.value}>{cultivo.tipo}</Text>
        <Text style={styles.label}>Variedad:</Text>
        <Text style={styles.value}>{cultivo.variedad || "-"}</Text>
        <Text style={styles.label}>Fecha de siembra:</Text>
        <Text style={styles.value}>{cultivo.fecha_siembra}</Text>
        <Text style={styles.label}>Ubicación:</Text>
        <Text style={styles.value}>{cultivo.ubicacion || "-"}</Text>
        <Text style={styles.label}>Días hasta cosecha:</Text>
        <Text style={styles.value}>{cultivo.dias_hasta_cosecha ?? "-"}</Text>
        <Text style={styles.label}>Etapa actual:</Text>
        <Text style={styles.value}>{cultivo.etapa_actual}</Text>
        <Text style={styles.label}>Estado:</Text>
        <Text style={[styles.value, { color: getEstadoColor(cultivo.estado) }]}>
          {getEstadoTexto(cultivo.estado)}
        </Text>
      </View>

      <View style={styles.sectionRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push(`./Crop/${id}/EditCrop`)}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={eliminarCultivo}>
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Utilidades de colores y textos de estado
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
      return `${estado?.charAt(0).toUpperCase() + estado?.slice(1)}`;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  contentContainer: { padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginTop: 30, marginBottom: 22 },
  headerIcon: { fontSize: 34, color: "#4fb0fa", marginRight: 10 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#000", flex: 1 },
  headerEdit: { fontSize: 24, color: "#4fb0fa", marginLeft: 10 },
  detailSection: { backgroundColor: "#fff", borderRadius: 14, padding: 22, marginBottom: 30, shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 8, elevation: 2 },
  label: { color: "#4fb0fa", fontWeight: "600", marginTop: 12 },
  value: { color: "#222", fontSize: 16, marginBottom: 6 },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", gap: 16, marginBottom: 25 },
  editButton: { flex: 1, backgroundColor: "#4fb0fa", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginRight: 8 },
  editButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  deleteButton: { flex: 1, backgroundColor: "#fff", borderWidth: 1, borderColor: "#ff6b6b", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginLeft: 8 },
  deleteButtonText: { color: "#ff6b6b", fontWeight: "bold", fontSize: 16 },
});
