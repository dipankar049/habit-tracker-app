import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useAuth } from "../auth/AuthContext";
import api from "../services/api";

export default function SummaryScreen() {
  const { token } = useAuth();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);

  const heatmapColors = [
    "#f5f3ff",
    "#ddd6fe",
    "#c4b5fd",
    "#a78bfa",
    "#7c3aed",
  ];

  const fetchMonthlySummary = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await api.get(
        `/logTask/monthly?year=${year}&month=${month}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSummaryData(res.data);
    } catch (err) {
      console.error("Monthly summary error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlySummary();
  }, [year, month, token]);

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const days = Array.from(
    { length: getDaysInMonth(year, month) },
    (_, i) => i + 1
  );

  const getDateKey = (day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;

  const getTimeForDay = (day, taskId) => {
    const dateKey = getDateKey(day);
    const logs = summaryData?.days?.[dateKey] || [];

    const taskLog = logs.find((l) => l.taskId === taskId);
    return taskLog?.timeSpent || 0;
  };

  const getHeatmapColor = (time) => {
    if (!time) return heatmapColors[0];
    if (time < 30) return heatmapColors[1];
    if (time < 60) return heatmapColors[2];
    if (time < 180) return heatmapColors[3];
    return heatmapColors[4];
  };

  const handlePrevMonth = () => {
    const newMonth = month === 0 ? 11 : month - 1;
    const newYear = month === 0 ? year - 1 : year;

    setMonth(newMonth);
    setYear(newYear);
  };

  const handleNextMonth = () => {
    const newMonth = month === 11 ? 0 : month + 1;
    const newYear = month === 11 ? year + 1 : year;

    if (newYear > today.getFullYear()) return;

    setMonth(newMonth);
    setYear(newYear);
  };

  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Loading summary...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}

      <Text style={styles.title}>Monthly Activity</Text>

      <View style={styles.navigation}>
        <Pressable style={styles.navButton} onPress={handlePrevMonth}>
          <Text style={styles.navButtonText}>Prev</Text>
        </Pressable>

        <Text style={styles.monthYear}>
          {monthName} {year}
        </Text>

        <Pressable style={styles.navButton} onPress={handleNextMonth}>
          <Text style={styles.navButtonText}>Next</Text>
        </Pressable>
      </View>

      {/* HEATMAP */}

      {summaryData?.tasks?.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.matrixCard}>
            {/* HEADER ROW */}

            <View style={styles.matrixRow}>
              <View style={styles.taskNameHeader}>
                <Text style={styles.taskHeaderText}>Task</Text>
              </View>

              {days.map((day) => (
                <View key={day} style={styles.dayHeaderCell}>
                  <Text style={styles.dayHeaderText}>{day}</Text>
                </View>
              ))}
            </View>

            {/* TASK ROWS */}

            {summaryData.tasks.map((task) => (
              <View key={task.taskId} style={styles.matrixRow}>
                <View style={styles.taskNameCell}>
                  <Text numberOfLines={1} style={styles.taskNameText}>
                    {task.title}
                  </Text>
                </View>

                {days.map((day) => {
                  const time = getTimeForDay(day, task.taskId);

                  return (
                    <View
                      key={`${task.taskId}-${day}`}
                      style={[
                        styles.dayCell,
                        { backgroundColor: getHeatmapColor(time) },
                      ]}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No data for this month</Text>
          <Text style={styles.emptySub}>Start logging tasks to see insights</Text>
        </View>
      )}

      {/* LEGEND */}

      <View style={styles.legendCard}>
        <Text style={styles.legendTitle}>Time Spent</Text>

        <View style={styles.legendRow}>
          {heatmapColors.map((c, i) => (
            <View key={i} style={[styles.legendBox, { backgroundColor: c }]} />
          ))}
        </View>

        <View style={styles.legendLabels}>
          <Text style={styles.legendText}>Less</Text>
          <Text style={styles.legendText}>More</Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const CELL_SIZE = 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },

  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  navButton: {
    backgroundColor: "#ede9fe",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  navButtonText: {
    color: "#6d28d9",
    fontWeight: "600",
  },

  monthYear: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  matrixCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 2,
  },

  matrixRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  taskNameHeader: {
    width: 120,
    height: CELL_SIZE,
    justifyContent: "center",
  },

  taskHeaderText: {
    fontSize: 13,
    fontWeight: "700",
  },

  taskNameCell: {
    width: 120,
    height: CELL_SIZE,
    justifyContent: "center",
  },

  taskNameText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },

  dayHeaderCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },

  dayHeaderText: {
    fontSize: 10,
    color: "#6b7280",
  },

  dayCell: {
    width: CELL_SIZE - 1 * 2,
    height: CELL_SIZE - 2 * 2,
    marginVertical: 2,
    marginHorizontal: 1,
    borderRadius: 4,
  },

  legendCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },

  legendTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },

  legendRow: {
    flexDirection: "row",
  },

  legendBox: {
    width: 16,
    height: 16,
    marginRight: 6,
    borderRadius: 4,
  },

  legendLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  legendText: {
    fontSize: 12,
    color: "#6b7280",
  },

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },

  emptySub: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 6,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});