import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "./DB/supabase";

export default function EditarCultivo() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    variedad: "",
    fecha_siembra: "",
    ubicacion: "",
    dias_hasta_cosecha: "",
    etapa_actual: "Germinación",
    estado: "activo",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    cargarCultivo();
  }, [id]);

  const cargarCultivo = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cultivos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setFormData({
        nombre: data.nombre || "",
        tipo: data.tipo || "",
        variedad: data.variedad || "",
        fecha_siembra: data.fecha_siembra || "",
        ubicacion: data.ubicacion || "",
        dias_hasta_cosecha: data.dias_hasta_cosecha?.toString() || "",
        etapa_actual: data.etapa_actual || "Germinación",
        estado: data.estado || "activo",
      });
    } catch (err: any) {
      Alert.alert("Error", err.message || "No se pudo cargar el cultivo.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.tipo || !formData.fecha_siembra) {
      Alert.alert("Completa los campos obligatorios (*)");
      return;
    }
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("cultivos")
        .update({
          nombre: formData.nombre,
          tipo: formData.tipo,
          variedad: formData.variedad,
          fecha_siembra: formData.fecha_siembra,
          ubicacion: formData.ubicacion || null,
          dias_hasta_cosecha: formData.dias_hasta_cosecha
            ? parseInt(formData.dias_hasta_cosecha, 10)
            : null,
          etapa_actual: formData.etapa_actual,
          estado: formData.estado,
        })
        .eq("id", id);

      if (error) throw error;

      Alert.alert("Éxito", "El cultivo fue actualizado correctamente", [
        { text: "OK", onPress: () => router.replace("./Dashboard") },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "No se pudo actualizar el cultivo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}>
        <ActivityIndicator size="large" color="#4fb0fa" />
        <Text style={{ marginTop: 18, color: "#999" }}>Cargando cultivo...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Cultivo</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nombre del cultivo *</Text>
        <TextInput
          style={styles.input}
          value={formData.nombre}
          onChangeText={(value) => handleInputChange("nombre", value)}
          placeholder="Ej: Tomates Orgánicos"
          placeholderTextColor="#9e9e9e"
        />

        <Text style={styles.label}>Tipo de planta *</Text>
        <TextInput
          style={styles.input}
          value={formData.tipo}
          onChangeText={(value) => handleInputChange("tipo", value)}
          placeholder="Ej: Tomate, Lechuga"
          placeholderTextColor="#9e9e9e"
        />

        <Text style={styles.label}>Variedad</Text>
        <TextInput
          style={styles.input}
          value={formData.variedad}
          onChangeText={(value) => handleInputChange("variedad", value)}
          placeholder="Ej: Cherry, Romana"
          placeholderTextColor="#9e9e9e"
        />

        <Text style={styles.label}>Fecha de siembra *</Text>
        <TextInput
          style={styles.input}
          value={formData.fecha_siembra}
          onChangeText={(value) => handleInputChange("fecha_siembra", value)}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#9e9e9e"
        />

        <Text style={styles.label}>Ubicación/Zona</Text>
        <TextInput
          style={styles.input}
          value={formData.ubicacion}
          onChangeText={(value) => handleInputChange("ubicacion", value)}
          placeholder="Ej: Invernadero 1"
          placeholderTextColor="#9e9e9e"
        />

        <Text style={styles.label}>Días hasta cosecha</Text>
        <TextInput
          style={styles.input}
          value={formData.dias_hasta_cosecha}
          onChangeText={(value) => handleInputChange("dias_hasta_cosecha", value)}
          placeholder="Ej: 60"
          placeholderTextColor="#9e9e9e"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Etapa actual</Text>
        <View style={styles.buttonGroup}>
          {["Germinación", "Crecimiento", "Floración", "Fructificación"].map((etapa) => (
            <TouchableOpacity
              key={etapa}
              style={[
                styles.optionButton,
                formData.etapa_actual === etapa && styles.optionButtonActive,
              ]}
              onPress={() => handleInputChange("etapa_actual", etapa)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  formData.etapa_actual === etapa && styles.optionButtonTextActive,
                ]}
              >
                {etapa}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btnSubmit, submitting && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnSubmitText}>Actualizar</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  contentContainer: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: "row", alignItems: "center", marginTop: 30 },
  headerIcon: { fontSize: 34, color: "#4fb0fa", marginRight: 10 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#000", flex: 1 },
  form: { marginTop: 28 },
  label: { fontSize: 13, fontWeight: "600", color: "#333", marginBottom: 6, marginTop: 16 },
  input: {
    width: "100%", height: 44, borderWidth: 1, borderColor: "#4fb0fa",
    borderRadius: 10, paddingHorizontal: 14, fontSize: 16, color: "#000", backgroundColor: "#fff",
  },
  buttonGroup: { flexDirection: "row", gap: 6, marginTop: 10 },
  optionButton: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: "#4fb0fa", backgroundColor: "#fff", marginRight: 6,
  },
  optionButtonActive: { backgroundColor: "#4fb0fa" },
  optionButtonText: { fontSize: 13, color: "#4fb0fa", fontWeight: "600" },
  optionButtonTextActive: { color: "#fff" },
  btnSubmit: {
    width: "100%", height: 48, backgroundColor: "#4fb0fa", borderRadius: 12,
    justifyContent: "center", alignItems: "center", marginTop: 28,
  },
  btnDisabled: { opacity: 0.6 },
  btnSubmitText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
