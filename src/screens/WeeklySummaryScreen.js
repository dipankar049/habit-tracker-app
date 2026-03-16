import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  FlatList,
} from 'react-native';
import { useAuth } from '../auth/AuthContext';
import api from '../services/api';
import WeeklyBarChart from "../components/WeeklyBarChart";
import TaskBreakdownChart from "../components/TaskBreakdownChart";

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function WeeklySummaryScreen() {
  const { token } = useAuth();
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const fetchSummary = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get('/logTask/weekly', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedData = (res.data || []).map((item) => {
        const dateObj = new Date(item.date);
        return {
          ...item,
          dayName: dayNames[dateObj.getDay()],
          dateObj: dateObj,
        };
      });

      setSummary(formattedData);
    } catch (error) {
      console.error('Error fetching weekly summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [token]);

  const selectedDayData = summary.find((item) => item.date === selectedDate);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading weekly summary...</Text>
      </View>
    );
  }

  const getTotalTime = (data) => {
    if (!data || !data.tasks) return 0;
    return data.tasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.title}>Weekly Summary</Text>
        <Text style={styles.subtitle}>
          Track how much time you spend on your habits
        </Text>

        <WeeklyBarChart
          data={summary}
          selectedDate={selectedDate}
          onBarClick={setSelectedDate}
        />

        <Text style={styles.caption}>
          Total time spent per day on your tasks
        </Text>

        <View style={styles.divider} />

        <Text style={styles.breakdownTitle}>
          {selectedDayData?.dayName} • {getTotalTime(selectedDayData)} min
        </Text>

        {selectedDayData?.tasks?.length > 0 ? (
          <TaskBreakdownChart tasks={selectedDayData.tasks} />
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No tasks logged for this day</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 16
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center"
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 12
  },

  caption: {
    textAlign: "center",
    color: "#777",
    marginTop: 8
  },
  emptyBox: {
    paddingVertical: 20,
    alignItems: "center"
  },

  emptyText: {
    color: "#6b7280",
    fontSize: 14
  }
});