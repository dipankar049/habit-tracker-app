import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function Navbar({ toggleSidebar }) {
  const { user } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      {/* Hamburger Menu */}
      <Pressable onPress={toggleSidebar} style={styles.hamburgerContainer}>
        <Text style={styles.hamburger}>☰</Text>
      </Pressable>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>
          <Text style={styles.habitText}>Habit</Text>
          <Text style={styles.trackerText}>Tracker</Text>
        </Text>
      </View>

      {/* User Profile Button */}
      {user && (
        <Pressable 
          // onPress={() => navigation.navigate('Profile')}
          onPress={() => navigation.navigate('HomeLayout', {
            screen: "Profile",
          })}
          style={styles.profileButton}
        >
          <Text style={styles.profileInitial}>
            {user.username?.slice(0, 1).toUpperCase()}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 48,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  hamburgerContainer: {
    padding: 8,
  },
  hamburger: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
  },
  habitText: {
    color: '#3b82f6',
  },
  trackerText: {
    color: '#1f2937',
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
});