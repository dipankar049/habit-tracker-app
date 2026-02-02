import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../auth/AuthContext';
import api from '../services/api';

export default function RoutineScreen() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    defaultDuration: '',
    frequency: 'daily', // daily, weekly, fixed
    daysOfWeek: [],
  });
  const [refreshing, setRefreshing] = useState(false);

  const frequencies = ['daily', 'weekly', 'fixed'];
  const daysOfWeekOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchRoutine = async () => {
    setLoading(true);
    try {
      const res = await api.get('/routine/update', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data || []);
    } catch (error) {
      console.error('Error fetching routine:', error);
      toast.show("Failed to fetch routine", {
        type: 'danger',
        duration: 3000,
        placement: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchRoutine();
  }, [token]);

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.defaultDuration) {
      toast.show("Please fill all required fields", {
        type: 'warning',
        duration: 3000,
        placement: 'top',
      });
      return;
    }

    try {
      const res = await api.post(
        '/routine',
        {
          title: newTask.title,
          defaultDuration: parseInt(newTask.defaultDuration),
          frequency: newTask.frequency,
          daysOfWeek: newTask.frequency === 'fixed' ? newTask.daysOfWeek : [],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prev) => [...prev, res.data]);
      setIsModalOpen(false);
      setNewTask({
        title: '',
        defaultDuration: '',
        frequency: 'daily',
        daysOfWeek: [],
      });
    } catch (error) {
      toast.show((error.response?.data?.message || 'Failed to add task'), {
        type: 'danger',
        duration: 3000,
        placement: 'top',
      });
    }
  };

  const handleUpdateTask = async () => {
    if (!newTask.title.trim() || !newTask.defaultDuration) {
      toast.show("Please fill all required fields", {
        type: 'warning',
        duration: 3000,
        placement: 'top',
      });
      return;
    }

    try {
      const res = await api.put(
        `/routine/${selectedTask._id}`,
        {
          title: newTask.title,
          defaultDuration: parseInt(newTask.defaultDuration),
          frequency: newTask.frequency,
          daysOfWeek: newTask.frequency === 'fixed' ? newTask.daysOfWeek : [],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prev) =>
        prev.map((task) =>
          task._id === selectedTask._id ? res.data : task
        )
      );
      setIsModalOpen(false);
      setSelectedTask(null);
      setNewTask({
        title: '',
        defaultDuration: '',
        frequency: 'daily',
        daysOfWeek: [],
      });
    } catch (error) {
      toast.show((error.response?.data?.message || 'Failed to update task'), {
        type: 'danger',
        duration: 3000,
        placement: 'top',
      });
    }
  };

  const deleteTask = async (id) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeleteLoading(id);
          try {
            await api.delete(`/routine/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setTasks((prev) => prev.filter((task) => task._id !== id));
          } catch (error) {
            toast.show('Failed to delete task', {
              type: 'danger',
              duration: 3000,
              placement: 'top',
            });
          } finally {
            setDeleteLoading(null);
          }
        },
      },
    ]);
  };

  const openAddModal = () => {
    setSelectedTask(null);
    setNewTask({
      title: '',
      defaultDuration: '',
      frequency: 'daily',
      daysOfWeek: [],
    });
    setIsModalOpen(true);
  };

  const openUpdateModal = (task) => {
    setSelectedTask(task);
    setNewTask({
      title: task.title,
      defaultDuration: task.defaultDuration.toString(),
      frequency: task.frequency,
      daysOfWeek: task.daysOfWeek || [],
    });
    setIsModalOpen(true);
  };

  const toggleDaySelection = (day) => {
    setNewTask((prev) => {
      const isSelected = prev.daysOfWeek.includes(day);
      return {
        ...prev,
        daysOfWeek: isSelected
          ? prev.daysOfWeek.filter((d) => d !== day)
          : [...prev.daysOfWeek, day],
      };
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRoutine();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading your routine...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📋 Manage Routine</Text>
        <Pressable
          style={styles.addButton}
          onPress={openAddModal}
        >
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </Pressable>
      </View>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No tasks found</Text>
          <Text style={styles.emptyStateSubtext}>Add a task to get started</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.tasksList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {tasks.map((task) => (
            <View key={task._id} style={styles.taskCard}>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDetail}>
                  Duration: {task.defaultDuration} min
                </Text>
                <Text style={styles.taskDetail}>
                  Frequency: {task.frequency}
                </Text>
                {task.frequency === 'fixed' && task.daysOfWeek && (
                  <Text style={styles.taskDetail}>
                    Days: {task.daysOfWeek.join(', ')}
                  </Text>
                )}
              </View>

              <View style={styles.taskActions}>
                <Pressable
                  style={styles.updateButton}
                  onPress={() => openUpdateModal(task)}
                >
                  <Text style={styles.buttonText}>Update</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.deleteButton,
                    deleteLoading === task._id && styles.buttonDisabled,
                  ]}
                  onPress={() => deleteTask(task._id)}
                  disabled={deleteLoading === task._id}
                >
                  <Text style={styles.buttonText}>
                    {deleteLoading === task._id ? 'Deleting...' : 'Delete'}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Task Modal */}
      <Modal
        visible={isModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedTask ? 'Update Task' : 'Add Task'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Task title"
              value={newTask.title}
              onChangeText={(text) =>
                setNewTask({ ...newTask, title: text })
              }
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Duration (minutes)"
              value={newTask.defaultDuration}
              onChangeText={(text) =>
                setNewTask({ ...newTask, defaultDuration: text })
              }
              keyboardType="numeric"
              placeholderTextColor="#999"
            />

            <View style={styles.frequencySelector}>
              <Text style={styles.selectorLabel}>Frequency:</Text>
              <View style={styles.frequencyOptions}>
                {frequencies.map((freq) => (
                  <Pressable
                    key={freq}
                    style={[
                      styles.frequencyButton,
                      newTask.frequency === freq && styles.frequencyButtonActive,
                    ]}
                    onPress={() =>
                      setNewTask({ ...newTask, frequency: freq })
                    }
                  >
                    <Text
                      style={[
                        styles.frequencyButtonText,
                        newTask.frequency === freq &&
                          styles.frequencyButtonTextActive,
                      ]}
                    >
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {newTask.frequency === 'fixed' && (
              <View style={styles.daysSelector}>
                <Text style={styles.selectorLabel}>Select Days:</Text>
                <View style={styles.daysGrid}>
                  {daysOfWeekOptions.map((day) => (
                    <Pressable
                      key={day}
                      style={[
                        styles.dayButton,
                        newTask.daysOfWeek.includes(day) &&
                          styles.dayButtonActive,
                      ]}
                      onPress={() => toggleDaySelection(day)}
                    >
                      <Text
                        style={[
                          styles.dayButtonText,
                          newTask.daysOfWeek.includes(day) &&
                            styles.dayButtonTextActive,
                        ]}
                      >
                        {day.slice(0, 3)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setIsModalOpen(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.confirmButton}
                onPress={selectedTask ? handleUpdateTask : handleAddTask}
              >
                <Text style={styles.buttonText}>
                  {selectedTask ? 'Update' : 'Add'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  tasksList: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  taskInfo: {
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  taskDetail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#eab308',
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#dc2626',
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1f2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: '#1f2937',
  },
  frequencySelector: {
    marginBottom: 16,
  },
  selectorLabel: {
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  frequencyOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  frequencyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  frequencyButtonTextActive: {
    color: '#fff',
  },
  daysSelector: {
    marginBottom: 16,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    width: '30%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  dayButtonTextActive: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});