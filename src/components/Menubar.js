import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { useAuth } from "../auth/AuthContext";
import {
  Home,
  ClipboardList,
  Calendar,
  BarChart3,
  MessageCircle,
  ChartPie,
  LogOut,
} from "lucide-react-native";
import Constants from "expo-constants";

const appVersion = Constants.expoConfig?.version;

const { width } = Dimensions.get("window");
const SIDEBAR_WIDTH = width * 0.75;

export default function Menubar({ isOpen, closeSidebar, navigation }) {
  const { logout } = useAuth();

  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const menuItems = [
    { icon: Home, label: "Home", screen: "Home" },
    { icon: ClipboardList, label: "Set Routine", screen: "Routine" },
    { icon: Calendar, label: "Calendar", screen: "Calendar" },
    { icon: BarChart3, label: "Weekly Summary", screen: "WeeklySummary" },
    { icon: ChartPie, label: "Summary", screen: "Summary" },
    { icon: MessageCircle, label: "Contact Us", screen: "Contact" },
  ];

  const handleMenuPress = (screen, isLogout) => {
    if (isLogout) {
      logout();
    } else {
      navigation.navigate("HomeLayout", {
        screen: screen,
      });
    }

    closeSidebar();
  };

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>

      {/* Overlay */}
      <Animated.View
        pointerEvents={isOpen ? "auto" : "none"}
        style={[styles.overlay, { opacity: overlayOpacity }]}
      >
        <Pressable style={{ flex: 1 }} onPress={closeSidebar} />
      </Animated.View>

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <ScrollView style={styles.menuContainer}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <View key={index}>
                <Pressable
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                  ]}
                  onPress={() => handleMenuPress(item.screen)}
                >
                  <Icon size={20} color="#374151" />

                  <Text style={styles.menuLabel}>{item.label}</Text>
                </Pressable>

                <View style={styles.divider} />
              </View>
            );
          })}
        </ScrollView>
        {/* <View style={styles.bottomSection}>

          <Pressable
            style={styles.logoutBtn}
            onPress={logout}
          >
            <LogOut size={18} color="#dc2626" />
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>

          <Text style={styles.version}>v1.0.0</Text>

        </View> */}
        <View style={styles.bottomSection}>
          <Text style={styles.versionText}>
            Version: v{appVersion}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: "#ffffff",

    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
  },

  menuContainer: {
    paddingTop: 12,
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

  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 6,
  },

  // bottomSection: {
  //   padding: 16,
  //   borderTopWidth: 1,
  //   borderColor: "#f1f5f9",
  // },

  // logoutBtn: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   gap: 10,
  //   paddingLeft: 10,
  //   // paddingVertical: 10,
  // },

  // logoutText: {
  //   color: "#dc2626",
  //   fontWeight: "600",
  //   fontSize: 15,
  // },

  // version: {
  //   marginTop: 10,
  //   fontSize: 12,
  //   color: "#9ca3af",
  // },

  bottomSection: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: "#f1f5f9",
    alignItems: "center",
  },

  versionText: {
    fontSize: 13,
    color: "#9ca3af",
    fontWeight: "500",
  },
});