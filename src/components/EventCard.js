import { View, Text, StyleSheet, Pressable } from "react-native";
import { CalendarCheck, CalendarClock, ChevronRight } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function EventCard({ event }) {

  const navigation = useNavigation();

  return (
    <Pressable
      style={[styles.card, event.completed && styles.completedCard]}
      onPress={() => navigation.navigate("Calendar")}
    >

      <View style={styles.left}>
        {event.completed
          ? <CalendarCheck size={18} color="#22c55e" />
          : <CalendarClock size={18} color="#f59e0b" />
        }

        <Text style={[
          styles.title,
          event.completed && styles.completedText
        ]}>
          {event.title}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.status}>
          {event.completed ? "Completed" : "Pending"}
        </Text>

        <ChevronRight size={18} color="#6b7280" />
      </View>

    </Pressable>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#a78bfa",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  completedCard: {
    backgroundColor: "#f0fdf4"
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937"
  },

  completedText: {
    color: "#6b7280"
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },

  status: {
    color: "#6b7280",
    fontSize: 14
  }

});