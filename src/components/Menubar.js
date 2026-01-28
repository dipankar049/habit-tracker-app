import { View, Text, Pressable, StyleSheet, ScrollView, Modal } from 'react-native';
import { useAuth } from '../auth/AuthContext';

export default function Menubar({ isOpen, closeSidebar, navigation }) {
  const { logout } = useAuth();

  const menuItems = [
    { icon: '🏠', label: 'Home', screen: 'Home' },
    { icon: '📋', label: 'Set Routine', screen: 'Routine' },
    { icon: '📅', label: 'Calendar', screen: 'Calendar' },
    { icon: '📊', label: 'Weekly Summary', screen: 'WeeklySummary' },
    { icon: '📈', label: 'Summary', screen: 'Summary' },
    { icon: '💬', label: 'Contact Us', screen: 'Contact' },
    { icon: '🚪', label: 'Logout', screen: null, isLogout: true },
  ];

  const handleMenuPress = (screen, isLogout) => {
    if (isLogout) {
      logout();
      closeSidebar();
    } else {
      navigation.navigate('HomeLayout', {
        screen: screen,
      });
      closeSidebar();
    }
  };

  return (
    <Modal
      transparent={true}
      visible={isOpen}
      animationType="slide"
      onRequestClose={closeSidebar}
    >
      {/* Overlay */}
      <Pressable
        style={styles.overlay}
        onPress={closeSidebar}
      />

      {/* Sidebar Content */}
      <View style={styles.sidebar}>
        <ScrollView style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <View key={index}>
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                  item.isLogout && styles.logoutItem,
                ]}
                onPress={() => handleMenuPress(item.screen, item.isLogout)}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.menuLabel,
                    item.isLogout && styles.logoutText,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
              <View style={styles.divider} />
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: '80%',
    backgroundColor: '#fff',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  menuContainer: {
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    gap: 12,
  },
  menuItemPressed: {
    backgroundColor: '#f0f9ff',
  },
  menuIcon: {
    fontSize: 20,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  logoutItem: {
    marginTop: 16,
  },
  logoutText: {
    color: '#dc2626',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
    marginVertical: 4,
  },
});