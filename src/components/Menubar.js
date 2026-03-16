import { View, Text, Pressable, StyleSheet, ScrollView, Modal } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import {
  Home,
  ClipboardList,
  Calendar,
  BarChart3,
  MessageCircle,
  ChartPie,
  LogOut,
} from "lucide-react-native";

export default function Menubar({ isOpen, closeSidebar, navigation }) {
  const { logout } = useAuth();

  const menuItems = [
    { icon: Home, label: "Home", screen: "Home" },
    { icon: ClipboardList, label: "Set Routine", screen: "Routine" },
    { icon: Calendar, label: "Calendar", screen: "Calendar" },
    { icon: BarChart3, label: "Weekly Summary", screen: "WeeklySummary" },
    { icon: ChartPie, label: 'Summary', screen: 'Summary' },
    { icon: MessageCircle, label: "Contact Us", screen: "Contact" },
    // { icon: LogOut, label: "Logout", screen: null, isLogout: true },
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
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return <View key={index}>
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                  item.isLogout && styles.logoutItem,
                ]}
                onPress={() => handleMenuPress(item.screen, item.isLogout)}
              >
                <Icon size={20} color={item.isLogout ? "#dc2626" : "#374151"} />

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
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "75%",
    backgroundColor: "#ffffff",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },

  menuContainer: {
    paddingTop: 24,
    paddingHorizontal: 14,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 14,
  },

  menuItemPressed: {
    backgroundColor: "#f1f5f9",
  },

  menuLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },

  logoutItem: {
    marginTop: 20,
  },

  logoutText: {
    color: "#dc2626",
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 6,
  },

});