import { useAuth } from '../auth/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { ActivityIndicator, View } from 'react-native';

export default function RootNavigator() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return token ? <AppStack /> : <AuthStack />;
}