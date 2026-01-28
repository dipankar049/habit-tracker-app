import { useAuth } from '../auth/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { ActivityIndicator } from 'react-native';

export default function RootNavigator() {
  const { token, loading } = useAuth();

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return token ? <AppStack /> : <AuthStack />;
}