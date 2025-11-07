import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "./DB/supabase";

interface Perfil {
  nombre: string;
  telefono: string | null;
  ubicacion: string | null;
  nombre_finca: string | null;
  foto_perfil_url: string | null;
  tema_oscuro: boolean;
  idioma: string;
}

export default function PerfilUsuario() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estado para el modal de cambio de contraseña
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({ newPassword: "", confirm: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("No hay usuario activo");

      const { data, error } = await supabase
        .from("perfiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      setPerfil(data);
    } catch (err: any) {
      Alert.alert("Error", err.message || "No se pudo cargar el perfil.");
      setPerfil(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Perfil, value: string) => {
    setPerfil((prev) =>
      prev ? { ...prev, [field]: value } : prev
    );
  };

  const guardarPerfil = async () => {
    setSaving(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("No hay usuario activo");

      const { error } = await supabase
        .from("perfiles")
        .update({
          nombre: perfil?.nombre,
          telefono: perfil?.telefono,
          ubicacion: perfil?.ubicacion,
          nombre_finca: perfil?.nombre_finca,
        })
        .eq("id", user.id);

      if (error) throw error;

      Alert.alert("Perfil actualizado");
      setEditando(false);
      cargarPerfil();
    } catch (err: any) {
      Alert.alert("Error", err.message || "No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.replace("/Login");
  };

  // --- Cambiar contraseña
  const handleChangePassword = async () => {
    if (!passwords.newPassword || !passwords.confirm) {
      Alert.alert("Completa ambos campos de contraseña");
      return;
    }
    if (passwords.newPassword.length < 8) {
      Alert.alert("La contraseña debe tener mínimo 8 caracteres");
      return;
    }
    if (passwords.newPassword !== passwords.confirm) {
      Alert.alert("Las contraseñas no coinciden");
      return;
    }
    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword,
      });
      if (error) throw error;
      setShowChangePassword(false);
      setPasswords({ newPassword: "", confirm: "" });
      Alert.alert("Contraseña actualizada", "Tu contraseña fue cambiada correctamente.");
    } catch (err: any) {
      Alert.alert("Error", err.message || "No se pudo cambiar la contraseña.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4fb0fa" />
        <Text style={{ marginTop: 18, color: "#999" }}>Cargando perfil...</Text>
      </View>
    );
  }

  if (!perfil) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Perfil no disponible</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={styles.icon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      <View style={styles.profileSection}>
        {/* Foto de perfil */}
        {perfil.foto_perfil_url ? (
          <Image source={{ uri: perfil.foto_perfil_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {perfil.nombre?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => setEditando((val) => !val)}
        >
          <Text style={styles.editProfileButtonText}>
            {editando ? "Cancelar" : "Editar"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={perfil.nombre}
          editable={editando}
          onChangeText={(v) => handleInputChange("nombre", v)}
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={perfil.telefono || ""}
          editable={editando}
          onChangeText={(v) => handleInputChange("telefono", v)}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Ubicación</Text>
        <TextInput
          style={styles.input}
          value={perfil.ubicacion || ""}
          editable={editando}
          onChangeText={(v) => handleInputChange("ubicacion", v)}
        />

        <Text style={styles.label}>Nombre de la finca o huerto</Text>
        <TextInput
          style={styles.input}
          value={perfil.nombre_finca || ""}
          editable={editando}
          onChangeText={(v) => handleInputChange("nombre_finca", v)}
        />

        {/* Botón para el modal de contraseña */}
        <TouchableOpacity
          style={styles.passwordButton}
          onPress={() => setShowChangePassword(true)}
        >
          <Text style={styles.passwordButtonText}>Cambiar contraseña</Text>
        </TouchableOpacity>

        {(editando || saving) && (
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.btnDisabled]}
            onPress={guardarPerfil}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>{saving ? "Guardando..." : "Guardar cambios"}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.cerrarSesionButton}
          onPress={cerrarSesion}
        >
          <Text style={styles.cerrarSesionButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de cambiar contraseña */}
      <Modal
        visible={showChangePassword}
        animationType="fade"
        transparent
        onRequestClose={() => setShowChangePassword(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={passwords.newPassword}
              onChangeText={(v) => setPasswords((p) => ({ ...p, newPassword: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={passwords.confirm}
              onChangeText={(v) => setPasswords((p) => ({ ...p, confirm: v }))}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowChangePassword(false)}
                disabled={passwordLoading}
              >
                <Text style={{ color: "#4fb0fa", fontWeight: "600" }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSave}
                disabled={passwordLoading}
                onPress={handleChangePassword}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  {passwordLoading ? "Guardando..." : "Guardar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  contentContainer: { padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginTop: 30, marginBottom: 16 },
  icon: { fontSize: 34, color: "#4fb0fa" },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#000", flex: 1 },
  profileSection: { alignItems: "center", marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  avatarPlaceholder: {
    width: 100, height: 100, backgroundColor: "#4fb0fa", borderRadius: 50,
    alignItems: "center", justifyContent: "center", marginBottom: 16,
  },
  avatarText: { color: "#fff", fontSize: 40, fontWeight: "bold" },
  editProfileButton: {
    marginTop: 2,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: "#4fb0fa",
    borderRadius: 16,
  },
  editProfileButtonText: { color: "#fff", fontWeight: "600" },
  form: { marginTop: 20 },
  label: { fontSize: 13, color: "#4fb0fa", marginBottom: 4, marginTop: 16, fontWeight: "600" },
  input: {
    width: "100%", height: 44, borderWidth: 1, borderColor: "#4fb0fa",
    borderRadius: 10, paddingHorizontal: 14, fontSize: 16, color: "#000", backgroundColor: "#fff",
    marginBottom: 0,
  },
  passwordButton: {
    marginTop: 32,
    alignSelf: "flex-start",
    paddingVertical: 9,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderColor: "#4fb0fa",
    borderWidth: 1,
    borderRadius: 18,
    marginBottom: 0,
  },
  passwordButtonText: {
    color: "#4fb0fa",
    fontWeight: "600",
    fontSize: 15,
  },
  saveButton: {
    width: "100%", height: 48, marginTop: 24, backgroundColor: "#51cf66", borderRadius: 12,
    justifyContent: "center", alignItems: "center",
  },
  btnDisabled: { opacity: 0.55 },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  cerrarSesionButton: {
    width: "100%", height: 48, backgroundColor: "#fff", borderRadius: 12, marginTop: 24,
    borderWidth: 1, borderColor: "#ff6b6b", justifyContent: "center", alignItems: "center"
  },
  cerrarSesionButtonText: { color: "#ff6b6b", fontWeight: "bold", fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  // ---- Modal styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.23)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.13,
    shadowRadius: 9,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#4fb0fa",
    marginBottom: 16,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 18,
    justifyContent: "flex-end",
  },
  modalCancel: {
    marginRight: 13,
    backgroundColor: "#f7f7fa",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalSave: {
    backgroundColor: "#4fb0fa",
    borderRadius: 8,
    paddingHorizontal: 23,
    paddingVertical: 10,
  },
});
