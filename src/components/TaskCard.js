import { View, Text, StyleSheet, Pressable, TextInput, ActivityIndicator } from "react-native";
import { useState } from "react";
import api from "../services/api";
import { CheckCircle, RotateCcw, Clock } from "lucide-react-native";

export default function TaskCard({ task, setTasks }) {

  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    setLoading(true);

    try {
      await api.post("/logTask/complete", {
        taskId: task._id,
        duration: task.defaultDuration,
        completed: !task.completed
      });

      setTasks(prev =>
        prev.map(t =>
          t._id === task._id
            ? { ...t, completed: !t.completed }
            : t
        )
      );

    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.card, task.completed && styles.completedCard]}>

      {/* Left side */}
      <View style={styles.left}>
        {task.completed
          ? <CheckCircle size={18} color="#22c55e" />
          : <Clock size={18} color="#f59e0b" />
        }

        <Text style={[
          styles.title,
          task.completed && styles.completedText
        ]}>
          {task.title}
        </Text>
      </View>

      {/* Right side */}
      <View style={styles.right}>

        {/* Duration */}
        <View style={styles.durationRow}>
          {task.completed ? (
            <Text style={styles.durationBadge}>
              {task.defaultDuration} min
            </Text>
          ) : (
            <>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(task.defaultDuration)}
                onChangeText={(text) =>
                  setTasks(prev =>
                    prev.map(t =>
                      t._id === task._id
                        ? { ...t, defaultDuration: Number(text) }
                        : t
                    )
                  )
                }
              />
              <Text style={styles.minText}>min</Text>
            </>
          )}
        </View>

        {/* Button */}
        <Pressable
          style={[
            styles.button,
            task.completed ? styles.undoBtn : styles.doneBtn
          ]}
          onPress={toggleStatus}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : task.completed ? (
            <>
              <RotateCcw size={14} color="#374151" />
              <Text style={styles.undoText}>Undo</Text>
            </>
          ) : (
            <>
              <CheckCircle size={14} color="#fff" />
              <Text style={styles.btnText}>Done</Text>
            </>
          )}
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
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
    color: "#1f2937",
    flexShrink: 1
  },

  completedText: {
    color: "#6b7280"
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },

  durationRow: {
    flexDirection: "row",
    alignItems: "center"
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 4,
    width: 50,
    textAlign: "center"
  },

  minText: {
    marginLeft: 4,
    color: "#6b7280"
  },

  durationBadge: {
    backgroundColor: "#ede9fe",
    color: "#7c3aed",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: "500"
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8
  },

  doneBtn: {
    backgroundColor: "#7c3aed"
  },

  undoBtn: {
    backgroundColor: "#e5e7eb"
  },

  btnText: {
    color: "#fff",
    fontWeight: "600"
  },

  undoText: {
    color: "#374151",
    fontWeight: "600"
  }

});