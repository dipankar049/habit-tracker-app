import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import api from '../services/api';
import { useAuth } from '../auth/AuthContext';
import { validateUserInput } from '../utils/validateInput';
import { useToast } from 'react-native-toast-notifications';

export default function LoginScreen({ navigation }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();

  const handleLogin = async () => {
    setLoading(true);

    const validation = validateUserInput(form);
    if (!validation.isValid) {
      toast.show(validation.message, {
        type: 'danger',
        duration: 3000,
        placement: 'top',
      });
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });

      await login(res.data.user, res.data.token);
      toast.show('Login successful', {
        type: 'success',
        duration: 3000,
        placement: 'top',
      });
    } catch (err) {
      console.log(err);
      if (err.response?.data) {
        toast.show((err.response.data.message || err.response.data.error || 'Login Failed'), {
          type: 'danger',
          duration: 3000,
          placement: 'top',
        });
      } else {
        toast.show('Something went wrong', {
          type: 'danger',
          duration: 3000,
          placement: 'top',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back 👋</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          style={styles.input}
          editable={!loading}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#ccc"
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          style={styles.input}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footer}>
          Don’t have an account?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Register')}
          >
            Register
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    color: '#ccc',
    textAlign: 'center',
  },
  link: {
    color: '#60a5fa',
    fontWeight: '600',
  },
});