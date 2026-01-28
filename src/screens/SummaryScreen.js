import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useAuth } from '../auth/AuthContext';
import api from '../services/api';

export default function SummaryScreen() {
  const { token } = useAuth();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMonthlySummary = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get(
        `/logTask/monthly?year=${year}&month=${month}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummaryData(res.data);
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlySummary();
  }, [year, month, token]);

  const joinedDate = summaryData
    ? new Date(summaryData.userCreatedAt)
    : new Date();
  const joinedYear = joinedDate.getFullYear();
  const joinedMonth = joinedDate.getMonth();

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const handlePrevMonth = () => {
    const newMonth = month === 0 ? 11 : month - 1;
    const newYear = month === 0 ? year - 1 : year;

    if (newYear < joinedYear || (newYear === joinedYear && newMonth < joinedMonth)) {
      return;
    }

    setMonth(newMonth);
    if (month === 0) setYear(year - 1);
  };

  const handleNextMonth = () => {
    const newMonth = month === 11 ? 0 : month + 1;
    const newYear = month === 11 ? year + 1 : year;

    if (newYear > currentYear || (newYear === currentYear && newMonth > currentMonth)) {
      return;
    }

    setMonth(newMonth);
    if (month === 11) setYear(year + 1);
  };

  const monthName = new Date(year, month).toLocaleString('default', {
    month: 'long',
  });

  const getDaysInMonth = (y, m) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getTaskStatusForDay = (day, taskId) => {
    if (!summaryData || !summaryData.tasks) return 'none';

    const logEntry = summaryData.tasks.find((task) => {
      const logDate = new Date(task.date);
      return (
        logDate.getDate() === day &&
        logDate.getMonth() === month &&
        logDate.getFullYear() === year &&
        task.taskId === taskId
      );
    });

    if (!logEntry) return 'none';
    return logEntry.status || 'logged'; // 'completed', 'pending', 'skipped'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#16a34a';
      case 'pending':
        return '#eab308';
      case 'skipped':
        return '#dc2626';
      default:
        return '#e5e7eb';
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'skipped':
        return '❌';
      default:
        return '○';
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading summary...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Text style={styles.title}>📈 Monthly Summary</Text>

      {/* Navigation */}
      <View style={styles.navigation}>
        <Pressable
          style={styles.navButton}
          onPress={handlePrevMonth}
        >
          <Text style={styles.navButtonText}>❮ Prev</Text>
        </Pressable>
        <Text style={styles.monthYear}>
          {monthName} {year}
        </Text>
        <Pressable
          style={styles.navButton}
          onPress={handleNextMonth}
        >
          <Text style={styles.navButtonText}>Next ❯</Text>
        </Pressable>
      </View>

      {/* Tasks Matrix */}
      {summaryData && summaryData.tasks && summaryData.tasks.length > 0 ? (
        <View style={styles.matrixContainer}>
          {/* Days Header */}
          <View style={styles.matrixRow}>
            <View style={styles.taskNameCell}>
              <Text style={styles.taskNameCellText}>Task</Text>
            </View>
            {days.map((day) => (
              <View key={day} style={styles.dayHeaderCell}>
                <Text style={styles.dayHeaderText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Get unique tasks */}
          {summaryData.tasksList &&
            summaryData.tasksList.map((taskId) => (
              <View key={taskId} style={styles.matrixRow}>
                <View style={styles.taskNameCell}>
                  <Text style={styles.taskNameText} numberOfLines={1}>
                    {taskId.split('_')[0] || taskId}
                  </Text>
                </View>
                {days.map((day) => {
                  const status = getTaskStatusForDay(day, taskId);
                  return (
                    <View
                      key={`${taskId}-${day}`}
                      style={[
                        styles.dayCell,
                        { backgroundColor: getStatusColor(status) },
                      ]}
                    >
                      <Text style={styles.statusEmoji}>
                        {getStatusEmoji(status)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No tasks logged for this month</Text>
          <Text style={styles.emptyStateSubtext}>
            Start logging your tasks to see the summary
          </Text>
        </View>
      )}

      {/* Legend */}
      <View style={styles.legendCard}>
        <Text style={styles.legendTitle}>Legend</Text>
        <View style={styles.legendGrid}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#16a34a' }]} />
            <Text style={styles.legendText}>Completed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#eab308' }]} />
            <Text style={styles.legendText}>Pending</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#dc2626' }]} />
            <Text style={styles.legendText}>Skipped</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#e5e7eb' }]} />
            <Text style={styles.legendText}>Not Logged</Text>
          </View>
        </View>
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
    marginBottom: 16,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
  },
  navButtonText: {
    fontWeight: '600',
    color: '#1f2937',
    fontSize: 12,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  matrixContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  matrixRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  taskNameCell: {
    width: 120,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#f9fafb',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    justifyContent: 'center',
  },
  taskNameCellText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1f2937',
  },
  taskNameText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1f2937',
  },
  dayHeaderCell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 2,
    backgroundColor: '#f0f9ff',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3b82f6',
  },
  dayCell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
  },
  statusEmoji: {
    fontSize: 14,
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  legendCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
});