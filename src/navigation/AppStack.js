import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import RoutineScreen from '../screens/RoutineScreen';
import CalendarScreen from '../screens/CalendarScreen';
import WeeklySummaryScreen from '../screens/WeeklySummaryScreen';
import SummaryScreen from '../screens/SummaryScreen';
import ContactScreen from '../screens/ContactScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Layout from '../components/Layout';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="HomeLayout"
        options={{
          headerShown: false,
        }}
      >
        {({ navigation }) => (
          <Layout navigation={navigation}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Routine" component={RoutineScreen} />
              <Stack.Screen name="Calendar" component={CalendarScreen} />
              <Stack.Screen name="WeeklySummary" component={WeeklySummaryScreen} />
              <Stack.Screen name="Summary" component={SummaryScreen} />
              <Stack.Screen name="Contact" component={ContactScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </Stack.Navigator>
          </Layout>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}