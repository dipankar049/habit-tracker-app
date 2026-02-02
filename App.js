import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/auth/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import { Platform, StatusBar } from 'react-native';

export default function App() {
  const STATUS_BAR_HEIGHT =
    Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ToastProvider
          offsetTop={STATUS_BAR_HEIGHT + 10}
        >
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </ToastProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
