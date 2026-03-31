import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token on app start
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('habit_tracker_token');
        const storedUser = await AsyncStorage.getItem('habit_tracker_user');

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) setUser(JSON.parse(storedUser));

          // verify token
          try {
            const res = await api.get('/auth/verifyToken', {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            });

            setUser(res.data.user);

            await AsyncStorage.setItem(
              'habit_tracker_user',
              JSON.stringify(res.data.user)
            );

          } catch (err) {

            if (err.response) {
              // Server responded, token invalid
              console.log("Token expired, logout");
              await logout();
            } else {
              // No internet, allow offline mode
              console.log("Offline mode, using stored user");
            }
          }
        }
      } catch (err) {
        console.log('Token invalid or expired');
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  const login = async (userData, tokenValue) => {
    await AsyncStorage.setItem('habit_tracker_token', tokenValue);
    await AsyncStorage.setItem(
      'habit_tracker_user',
      JSON.stringify(userData)
    );

    setUser(userData);
    setToken(tokenValue);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove([
      'habit_tracker_token',
      'habit_tracker_user',
    ]);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);