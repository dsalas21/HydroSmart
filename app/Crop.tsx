
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

interface CultivoDetalle {
  id: string;
  nombre: string;
  tipo: string;
  variedad: string;
  fechaSiembra: string;
  ubicacion: string;
  etapaActual: string;
  diasHastaCosecha: number;
  
  // Riego
  frecuenciaRiego: number;
  duracionRiego: number;
  humedadOptima: string;
  metodoRiego: string;
  estadoRiego: "activo" | "pausado";
  ultimoRiego: string;
  proximoRiego: string;
  
  // Ambiente
  temperaturaMin: number;
  temperaturaMax: number;
  humedadAmbiental: string;
  horasLuz: number;
  
  // Nutrición
  phOptimo: string;
  ecOptimo: string;
  tipoFertilizante: string;
  
  // Lecturas actuales
  temperaturaActual: number;
  humedadActual: number;
  phActual: number;
}

export default function DetalleCultivo() {
  const { id } = useLocalSearchParams();
  
  // En producción, esto vendría de tu base de datos/API
  const [cultivo, setCultivo] = useState<CultivoDetalle>({
    id: id as string,
    nombre: "Tomates Cherry",
    tipo: "Tomate",
    variedad: "Cherry",
    fechaSiembra: "2025-10-15",
    ubicacion: "Invernadero A",
    etapaActual: "Floración",
    diasHastaCosecha: 45,
    
    frecuenciaRiego: 12,
    duracionRiego: 15,
    humedadOptima: "60-70",
    metodoRiego: "Goteo",
    estadoRiego: "activo",
    ultimoRiego: "2025-11-04 08:30",
    proximoRiego: "2025-11-04 20:30",
    
    temperaturaMin: 18,
    temperaturaMax: 28,
    humedadAmbiental: "60-80",
    horasLuz: 14,
    
    phOptimo: "5.5-6.5",
    ecOptimo: "2.0-3.0",
    tipoFertilizante: "NPK 10-10-10",
    
    temperaturaActual: 24,
    humedadActual: 65,
    phActual: 6.1,
  });

  const [riegoActivo, setRiegoActivo] = useState(cultivo.estadoRiego === "activo");

  const historialRiego = [
    { fecha: "04/11/2025", hora: "08:30", duracion: 15, modo: "Automático", exitoso: true },
    { fecha: "03/11/2025", hora: "20:30", duracion: 15, modo: "Automático", exitoso: true },
    { fecha: "03/11/2025", hora: "08:30", duracion: 15, modo: "Automático", exitoso: true },
    { fecha: "02/11/2025", hora: "20:30", duracion: 12, modo: "Manual", exitoso: true },
  ];

  const toggleRiego = (value: boolean) => {
    setRiegoActivo(value);
    setCultivo({ ...cultivo, estadoRiego: value ? "activo" : "pausado" });
    Alert.alert(
      value ? "Riego Activado" : "Riego Pausado",
      value 
        ? "El sistema de riego automático está activo." 
        : "El riego automático ha sido pausado."
    );
  };

  const iniciarRiegoManual = () => {
    Alert.alert(
      "Riego Manual",
      "¿Iniciar riego manual ahora?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Iniciar",
          onPress: () => {
            Alert.alert("Riego iniciado", "El sistema regará durante 15 minutos");
          },
        },
      ]
    );
  };

  const editarCultivo = () => {
    // Aquí navegarías a la pantalla de edición
    Alert.alert("Editar Cultivo", "Funcionalidad de edición próximamente");
  };

  const eliminarCultivo = () => {
    Alert.alert(
      "Eliminar Cultivo",
      "¿Estás seguro de eliminar este cultivo? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            router.back();
          },
        },
      ]
    );
  };

  const getEstadoColor = () => {
    return riegoActivo ? "#51cf66" : "#ff6b6b";
  };

  const calcularDiasTranscurridos = () => {
    const inicio = new Date(cultivo.fechaSiembra);
    const hoy = new Date();
    const diff = Math.floor((hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {cultivo.nombre}
        </Text>
        <TouchableOpacity onPress={editarCultivo} style={styles.editButton}>
          <Text style={styles.editButtonText}>✎</Text>
        </TouchableOpacity>
      </View>

      {/* Información General */}
      <View style={styles.section}>
        <View style={styles.mainInfoCard}>
          <Text style={styles.cultivoTipo}>{cultivo.tipo}</Text>
          {cultivo.variedad && (
            <Text style={styles.cultivoVariedad}>Variedad: {cultivo.variedad}</Text>
          )}
          
          <View style={styles.etapaContainer}>
            <Text style={styles.etapaLabel}>Etapa actual</Text>
            <View style={styles.etapaBadge}>
              <Text style={styles.etapaTexto}>{cultivo.etapaActual}</Text>
            </View>
          </View>

          <View style={styles.diasContainer}>
            <View style={styles.diasItem}>
              <Text style={styles.diasValue}>{calcularDiasTranscurridos()}</Text>
              <Text style={styles.diasLabel}>Días transcurridos</Text>
            </View>
            <View style={styles.diasSeparator} />
            <View style={styles.diasItem}>
              <Text style={styles.diasValue}>{cultivo.diasHastaCosecha}</Text>
              <Text style={styles.diasLabel}>Días hasta cosecha</Text>
            </View>
          </View>

          <Text style={styles.ubicacionTexto}>📍 {cultivo.ubicacion}</Text>
        </View>
      </View>

      {/* Lecturas Actuales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Estado Actual</Text>
        <View style={styles.lecturasGrid}>
          <View style={styles.lecturaCard}>
            <Text style={styles.lecturaIcon}>🌡️</Text>
            <Text style={styles.lecturaValue}>{cultivo.temperaturaActual}°C</Text>
            <Text style={styles.lecturaLabel}>Temperatura</Text>
            <Text style={styles.lecturaRango}>
              Óptimo: {cultivo.temperaturaMin}-{cultivo.temperaturaMax}°C
            </Text>
          </View>

          <View style={styles.lecturaCard}>
            <Text style={styles.lecturaIcon}>💧</Text>
            <Text style={styles.lecturaValue}>{cultivo.humedadActual}%</Text>
            <Text style={styles.lecturaLabel}>Humedad Suelo</Text>
            <Text style={styles.lecturaRango}>Óptimo: {cultivo.humedadOptima}%</Text>
          </View>

          <View style={styles.lecturaCard}>
            <Text style={styles.lecturaIcon}>🧪</Text>
            <Text style={styles.lecturaValue}>{cultivo.phActual}</Text>
            <Text style={styles.lecturaLabel}>pH</Text>
            <Text style={styles.lecturaRango}>Óptimo: {cultivo.phOptimo}</Text>
          </View>
        </View>
      </View>

      {/* Control de Riego */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💧 Control de Riego</Text>
        
        <View style={styles.riegoCard}>
          <View style={styles.riegoHeader}>
            <View>
              <Text style={styles.riegoEstadoLabel}>Sistema de riego automático</Text>
              <Text style={[styles.riegoEstado, { color: getEstadoColor() }]}>
                {riegoActivo ? "● Activo" : "● Pausado"}
              </Text>
            </View>
            <Switch
              value={riegoActivo}
              onValueChange={toggleRiego}
              trackColor={{ false: "#ccc", true: "#51cf66" }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.riegoInfo}>
            <View style={styles.riegoInfoItem}>
              <Text style={styles.riegoInfoLabel}>Frecuencia</Text>
              <Text style={styles.riegoInfoValue}>Cada {cultivo.frecuenciaRiego}h</Text>
            </View>
            <View style={styles.riegoInfoItem}>
              <Text style={styles.riegoInfoLabel}>Duración</Text>
              <Text style={styles.riegoInfoValue}>{cultivo.duracionRiego} min</Text>
            </View>
            <View style={styles.riegoInfoItem}>
              <Text style={styles.riegoInfoLabel}>Método</Text>
              <Text style={styles.riegoInfoValue}>{cultivo.metodoRiego}</Text>
            </View>
          </View>

          <View style={styles.riegoTiempos}>
            <Text style={styles.riegoTiempo}>
              ⏱️ Último riego: {new Date(cultivo.ultimoRiego).toLocaleString('es-ES')}
            </Text>
            <Text style={styles.riegoTiempo}>
              ⏰ Próximo riego: {new Date(cultivo.proximoRiego).toLocaleString('es-ES')}
            </Text>
          </View>

          <TouchableOpacity style={styles.riegoManualButton} onPress={iniciarRiegoManual}>
            <Text style={styles.riegoManualButtonText}>🚿 Iniciar Riego Manual</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Historial de Riego */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📜 Historial de Riego</Text>
        {historialRiego.map((riego, index) => (
          <View key={index} style={styles.historialCard}>
            <View style={styles.historialHeader}>
              <Text style={styles.historialFecha}>{riego.fecha} - {riego.hora}</Text>
              {riego.exitoso && <Text style={styles.historialExito}>✓</Text>}
            </View>
            <View style={styles.historialDetalle}>
              <Text style={styles.historialTexto}>Duración: {riego.duracion} min</Text>
              <Text style={styles.historialTexto}>Modo: {riego.modo}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Información Adicional */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ Información Adicional</Text>
        
        <View style={styles.infoAdicionalCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Humedad ambiental:</Text>
            <Text style={styles.infoValue}>{cultivo.humedadAmbiental}%</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Horas de luz:</Text>
            <Text style={styles.infoValue}>{cultivo.horasLuz}h/día</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>EC óptimo:</Text>
            <Text style={styles.infoValue}>{cultivo.ecOptimo} mS/cm</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fertilizante:</Text>
            <Text style={styles.infoValue}>{cultivo.tipoFertilizante}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha de siembra:</Text>
            <Text style={styles.infoValue}>
              {new Date(cultivo.fechaSiembra).toLocaleDateString('es-ES')}
            </Text>
          </View>
        </View>
      </View>

      {/* Botón Eliminar */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.deleteButton} onPress={eliminarCultivo}>
          <Text style={styles.deleteButtonText}>🗑️ Eliminar Cultivo</Text>
        </TouchableOpacity>
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
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 24,
    color: "#4fb0fa",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  mainInfoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cultivoTipo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 5,
  },
  cultivoVariedad: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  etapaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  etapaLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  etapaBadge: {
    backgroundColor: "#4fb0fa",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  etapaTexto: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  diasContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  diasItem: {
    alignItems: "center",
  },
  diasSeparator: {
    width: 1,
    backgroundColor: "#e0e0e0",
  },
  diasValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#4fb0fa",
  },
  diasLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  ubicacionTexto: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  lecturasGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  lecturaCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: "30%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lecturaIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  lecturaValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#000",
    marginBottom: 4,
  },
  lecturaLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  lecturaRango: {
    fontSize: 10,
    color: "#999",
    textAlign: "center",
  },
  riegoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  riegoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  riegoEstadoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  riegoEstado: {
    fontSize: 16,
    fontWeight: "700",
  },
  riegoInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  riegoInfoItem: {
    alignItems: "center",
  },
  riegoInfoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  riegoInfoValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  riegoTiempos: {
    marginBottom: 15,
  },
  riegoTiempo: {
    fontSize: 13,
    color: "#666",
    marginBottom: 5,
  },
  riegoManualButton: {
    backgroundColor: "#4fb0fa",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  riegoManualButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  historialCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  historialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  historialFecha: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  historialExito: {
    fontSize: 18,
    color: "#51cf66",
  },
  historialDetalle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historialTexto: {
    fontSize: 13,
    color: "#666",
  },
  infoAdicionalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  deleteButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
