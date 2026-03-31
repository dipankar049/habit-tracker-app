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

import { useNavigation } from "@react-navigation/native";
import { Eye, EyeOff } from "lucide-react-native";

import api from "../services/api";
import { validateUserInput } from "../utils/validateInput";
import { useToast } from "react-native-toast-notifications";

export default function RegisterScreen() {

  const navigation = useNavigation();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleRegister = async () => {

    setLoading(true);

    const validation = validateUserInput({
      email: form.email,
      password: form.password,
      name: form.username,
    });

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

      const res = await api.post("/auth/register", form);

      toast.show(res.data.message || "Account created!", {
        type: "success",
        duration: 3000,
        placement: "top",
      });

      navigation.replace("Login");

    } catch (err) {

      if (err.response?.data) {
        toast.show(
          err.response.data.message ||
          err.response.data.error ||
          "Failed to Register",
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
            Start building better habits
          </Text>

        </View>

        {/* Card */}
        <View style={styles.card}>

          <Text style={styles.title}>Create Account</Text>

          <TextInput
            placeholder="Username"
            placeholderTextColor="#9ca3af"
            style={styles.input}
            value={form.username}
            onChangeText={(text) =>
              setForm({ ...form, username: text })
            }
            editable={!loading}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            style={styles.input}
            value={form.email}
            onChangeText={(text) =>
              setForm({ ...form, email: text })
            }
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          {/* Password with eye toggle */}
          <View style={styles.passwordWrapper}>

            <TextInput
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              style={styles.passwordInput}
              value={form.password}
              onChangeText={(text) =>
                setForm({ ...form, password: text })
              }
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
            onPress={handleRegister}
            disabled={loading}
          >

            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Create Account</Text>
            }

          </TouchableOpacity>

          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text
              style={styles.link}
              onPress={() => !loading && navigation.navigate("Login")}
            >
              Login here
            </Text>
          </Text>

        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    // justifyContent: "center",
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
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

  footerText: {
    marginTop: 18,
    color: "#6b7280",
    textAlign: "center",
  },

  link: {
    color: "#6366f1",
    fontWeight: "600",
  },

});