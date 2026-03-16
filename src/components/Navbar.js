import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useAuth } from "../auth/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { LogIn, UserPlus, Menu, X } from "lucide-react-native";

export default function Navbar({ toggleSidebar, sidebarOpen }) {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      
      {/* Left - menu + logo */}
      <View style={styles.left}>
        {user && (
          <Pressable onPress={toggleSidebar} style={styles.menuBtn}>
            {sidebarOpen ? (
              <X size={22} color="#374151" />
            ) : (
              <Menu size={22} color="#374151" />
            )}
          </Pressable>
        )}

        <Pressable
          style={styles.logoContainer}
          // onPress={() => {
          //   if (user) {
          //     navigation.navigate("HomeLayout", { screen: "Home" });
          //   } else {
          //     navigation.navigate("LandingScreen");
          //   }
          // }}
        >
          <Image
            source={require("../../assets/habitTracker.png")}
            style={styles.logoImage}
          />

          <Text style={styles.logoText}>HabitTracker</Text>
        </Pressable>
      </View>

      {/* Right - auth controls */}
      {user ? (
        <View style={styles.right}>
          {/* <Pressable
            style={styles.logoutBtn}
            onPress={() => {
              logout();
              navigation.navigate("Login");
            }}
          >
            <LogOut size={18} color="#374151" strokeWidth={2} />
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable> */}

          <Pressable
            style={styles.profileButton}
            onPress={() =>
              navigation.navigate("HomeLayout", { screen: "Profile" })
            }
          >
            <Text style={styles.profileInitial}>
              {user.username?.slice(0, 1).toUpperCase()}
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.right}>
          <Pressable
            style={styles.loginBtn}
            onPress={() => navigation.navigate("Login")}
          >
            <LogIn size={16} color="#374151" />
            <Text style={styles.loginText}>Login</Text>
          </Pressable>

          <Pressable
            style={styles.registerBtn}
            onPress={() => navigation.navigate("Register")}
          >
            <UserPlus size={16} color="#fff" />
            <Text style={styles.registerText}>Register</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 56,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuBtn: {
    marginRight: 10,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  logoImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  logoText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  loginText: {
    color: "#374151",
    fontWeight: "600",
  },

  registerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#7c3aed",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },

  registerText: {
    color: "#fff",
    fontWeight: "600",
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  logoutText: {
    color: "#374151",
    fontWeight: "600",
  },

  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
  },

  profileInitial: {
    color: "#fff",
    fontWeight: "700",
  },
});