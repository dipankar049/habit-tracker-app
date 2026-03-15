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
    return data.tasks.reduce((sum, task) => sum + (task.duration || 0), 0);
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
      </View>

      <View style={styles.card}>
        <Text style={styles.breakdownTitle}>
          Task Breakdown for {selectedDayData?.dayName || ""}
        </Text>

        {selectedDayData?.tasks?.length > 0 ? (
          <TaskBreakdownChart tasks={selectedDayData.tasks} />
        ) : (
          <Text>No tasks logged for this day</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingTop: 16,
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  weeklyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dayCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  dayCardSelected: {
    backgroundColor: '#3b82f6',
  },
  dayCardName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  dayCardTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  dayCardTimeSelected: {
    color: '#fff',
  },
  breakdownCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  tasksList: {
    gap: 12,
    marginBottom: 16,
  },
  taskItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  taskTime: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3b82f6',
    marginLeft: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'right',
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3
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
  }
});