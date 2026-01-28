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
      <Text style={styles.title}>📊 Weekly Summary</Text>
      <Text style={styles.subtitle}>Total time spent per day on your tasks</Text>

      {/* Weekly Overview Card */}
      <View style={styles.weeklyCard}>
        <FlatList
          scrollEnabled={false}
          data={summary}
          keyExtractor={(item) => item.date}
          numColumns={7}
          renderItem={({ item }) => {
            const isSelected = item.date === selectedDate;
            const totalTime = getTotalTime(item);

            return (
              <Pressable
                style={[
                  styles.dayCard,
                  isSelected && styles.dayCardSelected,
                ]}
                onPress={() => setSelectedDate(item.date)}
              >
                <Text style={styles.dayCardName}>{item.dayName}</Text>
                <Text
                  style={[
                    styles.dayCardTime,
                    isSelected && styles.dayCardTimeSelected,
                  ]}
                >
                  {totalTime}m
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Task Breakdown */}
      <View style={styles.breakdownCard}>
        <Text style={styles.breakdownTitle}>
          Task Breakdown for {selectedDayData ? selectedDayData.dayName : 'N/A'}
        </Text>

        {selectedDayData && selectedDayData.tasks && selectedDayData.tasks.length > 0 ? (
          <View style={styles.tasksList}>
            {selectedDayData.tasks.map((task, idx) => {
              const totalDuration = getTotalTime(selectedDayData);
              const percentage = totalDuration > 0
                ? (task.duration / totalDuration) * 100
                : 0;

              return (
                <View key={idx} style={styles.taskItem}>
                  <View style={styles.taskHeader}>
                    <Text style={styles.taskName} numberOfLines={1}>
                      {task.name}
                    </Text>
                    <Text style={styles.taskTime}>{task.duration}m</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${percentage}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.percentageText}>
                    {percentage.toFixed(1)}% of daily time
                  </Text>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No tasks logged for this day</Text>
          </View>
        )}

        {/* Daily Summary Stats */}
        {selectedDayData && (
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {getTotalTime(selectedDayData)}
              </Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {selectedDayData.tasks ? selectedDayData.tasks.length : 0}
              </Text>
              <Text style={styles.statLabel}>Tasks</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {selectedDayData.tasks && selectedDayData.tasks.length > 0
                  ? (getTotalTime(selectedDayData) / selectedDayData.tasks.length).toFixed(0)
                  : 0}
              </Text>
              <Text style={styles.statLabel}>Avg/Task</Text>
            </View>
          </View>
        )}
      </View>

      <View style={{ height: 40 }} />
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
});