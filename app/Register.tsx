// app/registro.tsx (ACTUALIZADO CON SUPABASE)
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { Link, router } from "expo-router";
import { supabase } from "./DB/supabase";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Registro() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    if (formData.password.length < 8) {
      Alert.alert("Error", "La contraseña debe tener mínimo 8 caracteres");
      return;
    }
    if (!formData.name || !formData.email) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    
    setLoading(true);
    
    try {
      // Registro en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.name, // Se guardará en el perfil automáticamente
          },
        },
      });

      if (error) throw error;

      Alert.alert(
        "✅ Registro Exitoso", 
        "Tu cuenta ha sido creada. Bienvenido a HydroSmart!",
        [
          {
            text: "Continuar",
            onPress: () => router.replace("/Dashboard"),
          },
        ]
      );
      
    } catch (error: any) {
      console.error('Error en registro:', error);
      Alert.alert("Error", error.message || "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.formSection}>
        <Text style={styles.title}>HydroSmart</Text>
        <Text style={styles.subtitle}>Crear Cuenta</Text>
        <Text style={styles.description}>Regístrate para comenzar</Text>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              placeholder="Ingresa tu nombre"
              placeholderTextColor="#9e9e9e"
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              placeholder="tu@email.com"
              placeholderTextColor="#9e9e9e"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              placeholder="Mínimo 8 caracteres"
              placeholderTextColor="#9e9e9e"
              secureTextEntry
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput
              style={styles.input}
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange("confirmPassword", value)}
              placeholder="Confirma tu contraseña"
              placeholderTextColor="#9e9e9e"
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.btnSubmit, loading && styles.btnDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              {loading ? "Creando cuenta..." : "Registrarse"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <Link href="/Login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Inicia sesión</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 20,
    paddingTop: 50,
  },
  formSection: {
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#000",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  form: {
    width: "100%",
  },
  formGroup: {
    marginBottom: 20,
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
  btnSubmit: {
    width: "100%",
    height: 50,
    backgroundColor: "#4fb0fa",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    fontSize: 14,
    color: "#4fb0fa",
    fontWeight: "600",
  },
});
