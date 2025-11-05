import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";

interface CultivoFormData {
  nombre: string;
  tipo: string;
  variedad: string;
  fechaSiembra: string;
  ubicacion: string;
  // Configuración de riego
  frecuenciaRiego: string;
  duracionRiego: string;
  humedadOptima: string;
  metodoRiego: string;
  // Parámetros ambientales
  temperaturaMin: string;
  temperaturaMax: string;
  humedadAmbiental: string;
  horasLuz: string;
  // Nutrición
  phOptimo: string;
  ecOptimo: string;
  tipoFertilizante: string;
  // Ciclo
  diasHastaCosecha: string;
  etapaActual: string;
}

export default function AgregarCultivo() {
  const [formData, setFormData] = useState<CultivoFormData>({
    nombre: "",
    tipo: "",
    variedad: "",
    fechaSiembra: new Date().toISOString().split('T')[0],
    ubicacion: "",
    frecuenciaRiego: "",
    duracionRiego: "",
    humedadOptima: "",
    metodoRiego: "Goteo",
    temperaturaMin: "",
    temperaturaMax: "",
    humedadAmbiental: "",
    horasLuz: "",
    phOptimo: "",
    ecOptimo: "",
    tipoFertilizante: "",
    diasHastaCosecha: "",
    etapaActual: "Germinación",
  });

  const handleInputChange = (field: keyof CultivoFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Validación básica
    if (!formData.nombre || !formData.tipo || !formData.frecuenciaRiego) {
      Alert.alert("Error", "Por favor completa los campos obligatorios (*)");
      return;
    }

    // Aquí guardarías el cultivo en tu base de datos o estado global
    console.log("Cultivo guardado:", formData);
    Alert.alert("Éxito", "Cultivo agregado correctamente", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar Cultivo</Text>
      </View>

      <View style={styles.form}>
        {/* INFORMACIÓN BÁSICA */}
        <Text style={styles.sectionTitle}>📋 Información Básica</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre del cultivo *</Text>
          <TextInput
            style={styles.input}
            value={formData.nombre}
            onChangeText={(value) => handleInputChange("nombre", value)}
            placeholder="Ej: Tomates del Jardín"
            placeholderTextColor="#9e9e9e"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo de planta *</Text>
          <TextInput
            style={styles.input}
            value={formData.tipo}
            onChangeText={(value) => handleInputChange("tipo", value)}
            placeholder="Ej: Tomate, Lechuga, Fresa"
            placeholderTextColor="#9e9e9e"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Variedad (opcional)</Text>
          <TextInput
            style={styles.input}
            value={formData.variedad}
            onChangeText={(value) => handleInputChange("variedad", value)}
            placeholder="Ej: Cherry, Romana"
            placeholderTextColor="#9e9e9e"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Ubicación/Zona</Text>
          <TextInput
            style={styles.input}
            value={formData.ubicacion}
            onChangeText={(value) => handleInputChange("ubicacion", value)}
            placeholder="Ej: Invernadero A, Zona 1"
            placeholderTextColor="#9e9e9e"
          />
        </View>

        {/* CONFIGURACIÓN DE RIEGO */}
        <Text style={styles.sectionTitle}>💧 Configuración de Riego</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Frecuencia de riego (horas) *</Text>
          <TextInput
            style={styles.input}
            value={formData.frecuenciaRiego}
            onChangeText={(value) => handleInputChange("frecuenciaRiego", value)}
            placeholder="Ej: 12 (cada 12 horas)"
            placeholderTextColor="#9e9e9e"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Duración del riego (minutos)</Text>
          <TextInput
            style={styles.input}
            value={formData.duracionRiego}
            onChangeText={(value) => handleInputChange("duracionRiego", value)}
            placeholder="Ej: 15"
            placeholderTextColor="#9e9e9e"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Humedad óptima del suelo (%)</Text>
          <TextInput
            style={styles.input}
            value={formData.humedadOptima}
            onChangeText={(value) => handleInputChange("humedadOptima", value)}
            placeholder="Ej: 60-70"
            placeholderTextColor="#9e9e9e"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Método de riego</Text>
          <View style={styles.buttonGroup}>
            {["Goteo", "Aspersión", "Inundación"].map((metodo) => (
              <TouchableOpacity
                key={metodo}
                style={[
                  styles.optionButton,
                  formData.metodoRiego === metodo && styles.optionButtonActive,
                ]}
                onPress={() => handleInputChange("metodoRiego", metodo)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    formData.metodoRiego === metodo && styles.optionButtonTextActive,
                  ]}
                >
                  {metodo}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* PARÁMETROS AMBIENTALES */}
        <Text style={styles.sectionTitle}>🌡️ Parámetros Ambientales</Text>

        <View style={styles.rowGroup}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Temp. mínima (°C)</Text>
            <TextInput
              style={styles.input}
              value={formData.temperaturaMin}
              onChangeText={(value) => handleInputChange("temperaturaMin", value)}
              placeholder="Ej: 18"
              placeholderTextColor="#9e9e9e"
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Temp. máxima (°C)</Text>
            <TextInput
              style={styles.input}
              value={formData.temperaturaMax}
              onChangeText={(value) => handleInputChange("temperaturaMax", value)}
              placeholder="Ej: 28"
              placeholderTextColor="#9e9e9e"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Humedad ambiental (%)</Text>
          <TextInput
            style={styles.input}
            value={formData.humedadAmbiental}
            onChangeText={(value) => handleInputChange("humedadAmbiental", value)}
            placeholder="Ej: 60-80"
            placeholderTextColor="#9e9e9e"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Horas de luz por día</Text>
          <TextInput
            style={styles.input}
            value={formData.horasLuz}
            onChangeText={(value) => handleInputChange("horasLuz", value)}
            placeholder="Ej: 12-16"
            placeholderTextColor="#9e9e9e"
            keyboardType="numeric"
          />
        </View>

        {/* NUTRICIÓN */}
        <Text style={styles.sectionTitle}>🧪 Nutrición</Text>

        <View style={styles.rowGroup}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>pH óptimo</Text>
            <TextInput
              style={styles.input}
              value={formData.phOptimo}
              onChangeText={(value) => handleInputChange("phOptimo", value)}
              placeholder="Ej: 5.5-6.5"
              placeholderTextColor="#9e9e9e"
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>EC óptimo (mS/cm)</Text>
            <TextInput
              style={styles.input}
              value={formData.ecOptimo}
              onChangeText={(value) => handleInputChange("ecOptimo", value)}
              placeholder="Ej: 1.5-2.5"
              placeholderTextColor="#9e9e9e"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo de fertilizante</Text>
          <TextInput
            style={styles.input}
            value={formData.tipoFertilizante}
            onChangeText={(value) => handleInputChange("tipoFertilizante", value)}
            placeholder="Ej: NPK 10-10-10, Orgánico"
            placeholderTextColor="#9e9e9e"
          />
        </View>

        {/* CICLO DE CRECIMIENTO */}
        <Text style={styles.sectionTitle}>📅 Ciclo de Crecimiento</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Días hasta cosecha</Text>
          <TextInput
            style={styles.input}
            value={formData.diasHastaCosecha}
            onChangeText={(value) => handleInputChange("diasHastaCosecha", value)}
            placeholder="Ej: 60-90"
            placeholderTextColor="#9e9e9e"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Etapa actual</Text>
          <View style={styles.buttonGroup}>
            {["Germinación", "Crecimiento", "Floración", "Fructificación"].map((etapa) => (
              <TouchableOpacity
                key={etapa}
                style={[
                  styles.optionButton,
                  formData.etapaActual === etapa && styles.optionButtonActive,
                ]}
                onPress={() => handleInputChange("etapaActual", etapa)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    formData.etapaActual === etapa && styles.optionButtonTextActive,
                  ]}
                >
                  {etapa}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* BOTONES DE ACCIÓN */}
        <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit}>
          <Text style={styles.btnText}>Guardar Cultivo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnCancel} onPress={() => router.back()}>
          <Text style={styles.btnCancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    paddingBottom: 40,
  },
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
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginTop: 20,
    marginBottom: 15,
  },
  formGroup: {
    marginBottom: 20,
  },
  rowGroup: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#4fb0fa",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4fb0fa",
    backgroundColor: "#fff",
  },
  optionButtonActive: {
    backgroundColor: "#4fb0fa",
  },
  optionButtonText: {
    fontSize: 14,
    color: "#4fb0fa",
    fontWeight: "600",
  },
  optionButtonTextActive: {
    color: "#fff",
  },
  btnSubmit: {
    width: "100%",
    height: 50,
    backgroundColor: "#4fb0fa",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  btnCancel: {
    width: "100%",
    height: 50,
    backgroundColor: "transparent",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#999",
  },
  btnCancelText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});
