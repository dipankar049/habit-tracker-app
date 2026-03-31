import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Eye, EyeOff } from "lucide-react-native";

import api from "../services/api";
import { useAuth } from "../auth/AuthContext";
import { validateUserInput } from "../utils/validateInput";
import { useToast } from "react-native-toast-notifications";

export default function LoginScreen({ navigation }) {

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const toast = useToast();

  const handleLogin = async () => {
    setLoading(true);

    const validation = validateUserInput(form);
    if (!validation.isValid) {
      toast.show(validation.message, {
        type: "danger",
        duration: 3000,
        placement: "top",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      await login(res.data.user, res.data.token);

      toast.show("Login successful", {
        type: "success",
        duration: 3000,
        placement: "top",
      });

    } catch (err) {

      if (err.response?.data) {
        toast.show(
          err.response.data.message ||
          err.response.data.error ||
          "Login Failed",
          { type: "danger", duration: 3000, placement: "top" }
        );
      } else {
        toast.show("Something went wrong", {
          type: "danger",
          duration: 3000,
          placement: "top",
        });
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          {/* <View style={styles.logo}>
            <Text style={styles.logoText}>H</Text>
          </View> */}

          <Text style={styles.appName}>HabitTracker</Text>
          <Text style={styles.subtitle}>
            Build better habits every day
          </Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>

          <Text style={styles.title}>Welcome Back</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={form.email}
            onChangeText={(text) =>
              setForm({ ...form, email: text })
            }
            style={styles.input}
            autoCapitalize="none"
            editable={!loading}
          />

          <View style={styles.passwordWrapper}>

            <TextInput
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              value={form.password}
              onChangeText={(text) =>
                setForm({ ...form, password: text })
              }
              style={styles.passwordInput}
              secureTextEntry={!showPassword}
              editable={!loading}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              {showPassword
                ? <EyeOff size={20} color="#6b7280" />
                : <Eye size={20} color="#6b7280" />
              }
            </TouchableOpacity>

          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Login</Text>
            }
          </TouchableOpacity>

          <Text style={styles.footer}>
            Don't have an account?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Register")}
            >
              Register
            </Text>
          </Text>

        </View>

        <Text style={styles.quote}>
          "Small habits build big change."
        </Text>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
  },

  header: {
    alignItems: "center",
    marginBottom: 32,
  },

  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  logoText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 26,
  },

  appName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 14,
    color: "#111827",
    marginBottom: 14,
    backgroundColor: "#f9fafb",
  },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    backgroundColor: "#f9fafb",
    marginBottom: 14,
  },

  passwordInput: {
    flex: 1,
    padding: 14,
    color: "#111827",
  },

  eyeButton: {
    paddingHorizontal: 12,
  },

  button: {
    backgroundColor: "#6366f1",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  footer: {
    marginTop: 18,
    color: "#6b7280",
    textAlign: "center",
  },

  link: {
    color: "#6366f1",
    fontWeight: "600",
  },

  quote: {
    textAlign: "center",
    marginTop: 20,
    color: "#9ca3af",
    fontSize: 12,
  },

});