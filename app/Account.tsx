// app/perfil.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
} from "react-native";
import { router } from "expo-router";

interface UserData {
  nombre: string;
  email: string;
  telefono: string;
  ubicacion: string;
  nombreFinca: string;
  fotoPerfil: string;
  fechaRegistro: string;
}

interface Estadisticas {
  cultivosActivos: number;
  litrosAhorrados: number;
  diasEnPlataforma: number;
  cosechasCompletadas: number;
  horasRiego: number;
}

interface ConfigNotificaciones {
  alertasRiego: boolean;
  alertasClima: boolean;
  alertasCriticas: boolean;
  reportesSemanales: boolean;
}

export default function Perfil() {
  const [userData, setUserData] = useState<UserData>({
    nombre: "Juan Pérez",
    email: "juan.perez@email.com",
    telefono: "+52 123 456 7890",
    ubicacion: "Guadalajara, Jalisco",
    nombreFinca: "Huerto Verde",
    fotoPerfil: "", // URL de la foto
    fechaRegistro: "2025-09-15",
  });

  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    cultivosActivos: 5,
    litrosAhorrados: 1240,
    diasEnPlataforma: 50,
    cosechasCompletadas: 3,
    horasRiego: 87,
  });

  const [notificaciones, setNotificaciones] = useState<ConfigNotificaciones>({
    alertasRiego: true,
    alertasClima: true,
    alertasCriticas: true,
    reportesSemanales: false,
  });

  const [temaOscuro, setTemaOscuro] = useState(false);
  const [biometria, setBiometria] = useState(false);

  const toggleNotificacion = (key: keyof ConfigNotificaciones) => {
    setNotificaciones((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const editarPerfil = () => {
    Alert.alert("Editar Perfil", "Funcionalidad próximamente");
  };

  const cambiarContrasena = () => {
    Alert.alert("Cambiar Contraseña", "Funcionalidad próximamente");
  };

  const cerrarSesion = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: () => router.replace("/Login"),
        },
      ]
    );
  };

  const eliminarCuenta = () => {
    Alert.alert(
      "Eliminar Cuenta",
      "Esta acción es permanente y eliminará todos tus datos. ¿Estás seguro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            Alert.alert("Cuenta eliminada", "Tu cuenta ha sido eliminada exitosamente");
            router.replace("/Register");
          },
        },
      ]
    );
  };

  const calcularDiasEnPlataforma = () => {
    const inicio = new Date(userData.fechaRegistro);
    const hoy = new Date();
    return Math.floor((hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Información del Usuario */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {userData.fotoPerfil ? (
            <Image source={{ uri: userData.fotoPerfil }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{userData.nombre.charAt(0)}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.editAvatarButton}>
            <Text style={styles.editAvatarIcon}>📷</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{userData.nombre}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
        {userData.nombreFinca && (
          <Text style={styles.userFinca}>🏡 {userData.nombreFinca}</Text>
        )}
        <Text style={styles.userUbicacion}>📍 {userData.ubicacion}</Text>

        <TouchableOpacity style={styles.editProfileButton} onPress={editarPerfil}>
          <Text style={styles.editProfileButtonText}>✎ Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Estadísticas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Mis Estadísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{estadisticas.cultivosActivos}</Text>
            <Text style={styles.statLabel}>Cultivos Activos</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{estadisticas.litrosAhorrados}L</Text>
            <Text style={styles.statLabel}>Agua Ahorrada</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{calcularDiasEnPlataforma()}</Text>
            <Text style={styles.statLabel}>Días Activo</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{estadisticas.cosechasCompletadas}</Text>
            <Text style={styles.statLabel}>Cosechas</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{estadisticas.horasRiego}h</Text>
            <Text style={styles.statLabel}>Riego Auto</Text>
          </View>
        </View>
      </View>

      {/* Notificaciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔔 Notificaciones</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Alertas de riego</Text>
              <Text style={styles.settingDescription}>
                Notifica cuando se active el riego
              </Text>
            </View>
            <Switch
              value={notificaciones.alertasRiego}
              onValueChange={() => toggleNotificacion("alertasRiego")}
              trackColor={{ false: "#ccc", true: "#4fb0fa" }}
            />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Alertas de clima</Text>
              <Text style={styles.settingDescription}>
                Lluvia, heladas y temperaturas extremas
              </Text>
            </View>
            <Switch
              value={notificaciones.alertasClima}
              onValueChange={() => toggleNotificacion("alertasClima")}
              trackColor={{ false: "#ccc", true: "#4fb0fa" }}
            />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Alertas críticas</Text>
              <Text style={styles.settingDescription}>
                Fallas del sistema y sensores
              </Text>
            </View>
            <Switch
              value={notificaciones.alertasCriticas}
              onValueChange={() => toggleNotificacion("alertasCriticas")}
              trackColor={{ false: "#ccc", true: "#4fb0fa" }}
            />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Reportes semanales</Text>
              <Text style={styles.settingDescription}>
                Resumen de actividad cada semana
              </Text>
            </View>
            <Switch
              value={notificaciones.reportesSemanales}
              onValueChange={() => toggleNotificacion("reportesSemanales")}
              trackColor={{ false: "#ccc", true: "#4fb0fa" }}
            />
          </View>
        </View>
      </View>

      {/* Preferencias */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Preferencias</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingRowClickable}>
            <Text style={styles.settingLabel}>Idioma</Text>
            <Text style={styles.settingValue}>Español ›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRowClickable}>
            <Text style={styles.settingLabel}>Unidades</Text>
            <Text style={styles.settingValue}>Métrico ›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRowClickable}>
            <Text style={styles.settingLabel}>Temperatura</Text>
            <Text style={styles.settingValue}>Celsius (°C) ›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Seguridad */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔐 Seguridad</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingRowClickable} onPress={cambiarContrasena}>
            <Text style={styles.settingLabel}>Cambiar contraseña</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Autenticación biométrica</Text>
            <Switch
              value={biometria}
              onValueChange={setBiometria}
              trackColor={{ false: "#ccc", true: "#4fb0fa" }}
            />
          </View>

          <TouchableOpacity style={styles.settingRowClickable}>
            <Text style={styles.settingLabel}>Dispositivos conectados</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sensores y Conexiones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📡 Sensores y Conexiones</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingRowClickable}>
            <View>
              <Text style={styles.settingLabel}>Estado de conexión</Text>
              <Text style={styles.connectionStatus}>● Conectado</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRowClickable}>
            <Text style={styles.settingLabel}>Sensores conectados</Text>
            <Text style={styles.settingValue}>3 activos ›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRowClickable}>
            <Text style={styles.settingLabel}>Sincronización de datos</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Acciones de Cuenta */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
          <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={eliminarCuenta}>
          <Text style={styles.deleteButtonText}>🗑️ Eliminar Cuenta</Text>
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
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    width: 40,
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
  profileSection: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4fb0fa",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "900",
    color: "#fff",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editAvatarIcon: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  userFinca: {
    fontSize: 14,
    color: "#4fb0fa",
    marginBottom: 3,
  },
  userUbicacion: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  editProfileButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4fb0fa",
  },
  editProfileButtonText: {
    color: "#4fb0fa",
    fontSize: 14,
    fontWeight: "600",
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
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
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#4fb0fa",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
  },
  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingRowClickable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLabel: {
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  settingValue: {
    fontSize: 14,
    color: "#666",
  },
  settingArrow: {
    fontSize: 20,
    color: "#ccc",
  },
  connectionStatus: {
    fontSize: 12,
    color: "#51cf66",
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: "#4fb0fa",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff6b6b",
  },
  deleteButtonText: {
    color: "#ff6b6b",
    fontSize: 16,
    fontWeight: "700",
  },
});
