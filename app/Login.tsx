// app/login.tsx
import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  ActivityIndicator 
} from "react-native";
import { Link, router } from "expo-router";
import { supabase } from "./DB/supabase";

interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof LoginData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validación básica
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    
    setLoading(true);
    
    try {
      // Iniciar sesión con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // Manejar errores específicos
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Correo o contraseña incorrectos');
        }
        throw error;
      }

      console.log('✅ Login exitoso:', data.user?.email);

      // Redirigir a la pantalla principal
      router.replace("/Dashboard");
      
    } catch (error: any) {
      console.error('Error en login:', error);
      Alert.alert(
        "Error de inicio de sesión", 
        error.message || "No se pudo iniciar sesión. Verifica tus credenciales."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      Alert.alert(
        "Recuperar contraseña",
        "Por favor ingresa tu correo electrónico primero.",
        [{ text: "OK" }]
      );
      return;
    }


  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.formSection}>
        <Text style={styles.title}>HydroSmart</Text>
        <Text style={styles.subtitle}>Iniciar Sesión</Text>
        <Text style={styles.description}>Bienvenido de nuevo</Text>

        <View style={styles.form}>
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
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#9e9e9e"
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity 
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btnSubmit, loading && styles.btnDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerLinkContainer}>
            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
            <Link href="/Register" asChild>
              <TouchableOpacity disabled={loading}>
                <Text style={styles.registerLink}>Regístrate</Text>
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
    paddingTop: 80,
    justifyContent: "center",
    flexGrow: 1,
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
    marginBottom: 40,
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
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgotPassword: {
    fontSize: 14,
    color: "#4fb0fa",
    fontWeight: "600",
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
  registerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    color: "#666",
  },
  registerLink: {
    fontSize: 14,
    color: "#4fb0fa",
    fontWeight: "600",
  },
});
