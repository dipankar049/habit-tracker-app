import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { validateUserInput } from '../utils/validateInput';
import { useToast } from 'react-native-toast-notifications';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
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
        type: 'danger',
        duration: 3000,
        placement: 'top',
      });
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      toast.show((res.data.message || 'Success'), {
        type: 'success',
        duration: 3000,
        placement: 'top',
      });
      navigation.replace('Login');
    } catch (err) {
      if (err.response?.data) {
        toast.show((err.response.data.message || err.response.data.error || "Failed to Register"), {
          type: 'danger',
          duration: 3000,
          placement: 'top',
        });
      } else {
        toast.show("Something went wrong", {
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
        <Text style={styles.title}>Create Account ✨</Text>

        <TextInput
          placeholder="Username"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={form.username}
          onChangeText={(text) =>
            setForm({ ...form, username: text })
          }
          editable={!loading}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={form.email}
          onChangeText={(text) =>
            setForm({ ...form, email: text })
          }
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={form.password}
          onChangeText={(text) =>
            setForm({ ...form, password: text })
          }
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing you up...' : 'Register'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text
            style={styles.link}
            onPress={() => !loading && navigation.navigate('Login')}
          >
            Login here
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2933',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#22c55e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footerText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 20,
  },
  link: {
    color: '#60a5fa',
    fontWeight: '600',
  },
});