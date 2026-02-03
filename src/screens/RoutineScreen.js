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
  RefreshControl,
} from 'react-native';
import { useAuth } from '../auth/AuthContext';
import api from '../services/api';

export default function RoutineScreen() {
  const { token } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const [newTask, setNewTask] = useState({
    title: '',
    defaultDuration: '',
    frequency: 'fixed', // fixed | flexible | alternate
    daysOfWeek: [],
    timesPerWeek: '',
  });

  const frequencies = ['fixed', 'flexible', 'alternate'];

  const daysOfWeekOptions = [
    { label: 'Sun', value: 0 },
    { label: 'Mon', value: 1 },
    { label: 'Tue', value: 2 },
    { label: 'Wed', value: 3 },
    { label: 'Thu', value: 4 },
    { label: 'Fri', value: 5 },
    { label: 'Sat', value: 6 },
  ];

  /* ---------------- FETCH ---------------- */
  const fetchRoutine = async () => {
    setLoading(true);
    try {
      const res = await api.get('/routine/update', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data || []);
    } catch (err) {
      toast.show('Failed to fetch routine', { type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchRoutine();
  }, [token]);

  /* ---------------- VALIDATION ---------------- */
  const validateTask = () => {
    if (!newTask.title.trim() || !newTask.defaultDuration) {
      toast.show('Title & duration required', { type: 'warning' });
      console.log("Returning...")
      return false;
    }

    if (
      newTask.frequency === 'fixed' &&
      newTask.daysOfWeek.length === 0
    ) {
      toast.show('Select at least one day', { type: 'warning' });
      return false;
    }

    if (
      newTask.frequency === 'flexible' &&
      !newTask.timesPerWeek
    ) {
      toast.show('Enter times per week', { type: 'warning' });
      return false;
    }

    return true;
  };

  /* ---------------- ADD ---------------- */
  const handleAddTask = async () => {
    if (!validateTask()) return;

    try {
      const res = await api.post(
        '/routine',
        {
          title: newTask.title,
          defaultDuration: Number(newTask.defaultDuration),
          frequency: newTask.frequency,
          daysOfWeek:
            newTask.frequency === 'fixed'
              ? newTask.daysOfWeek
              : [],
          timesPerWeek:
            newTask.frequency === 'flexible'
              ? Number(newTask.timesPerWeek)
              : undefined,
        }
      );
      // setTasks((prev) => [...prev, res.data]);
      await fetchRoutine();
      closeModal();
    } catch (err) {
      toast.show('Failed to add task', { type: 'danger' });
    }
  };

  /* ---------------- UPDATE ---------------- */
  const handleUpdateTask = async () => {
    if (!validateTask()) return;

    try {
      const res = await api.put(
        `/routine/${selectedTask._id}`,
        {
          title: newTask.title,
          defaultDuration: Number(newTask.defaultDuration),
          frequency: newTask.frequency,
          daysOfWeek:
            newTask.frequency === 'fixed'
              ? newTask.daysOfWeek
              : [],
          timesPerWeek:
            newTask.frequency === 'flexible'
              ? Number(newTask.timesPerWeek)
              : undefined,
        }
      );

      await fetchRoutine();
      closeModal();
    } catch (err) {
      toast.show('Failed to update task', { type: 'danger' });
    }
  };

  /* ---------------- DELETE ---------------- */
  const deleteTask = (id) => {
    Alert.alert('Delete Task', 'Are you sure?', [
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
            setTasks((prev) => prev.filter((t) => t._id !== id));
          } catch {
            toast.show('Delete failed', { type: 'danger' });
          } finally {
            setDeleteLoading(null);
          }
        },
      },
    ]);
  };

  /* ---------------- MODAL HELPERS ---------------- */
  const openAddModal = () => {
    setSelectedTask(null);
    setNewTask({
      title: '',
      defaultDuration: '',
      frequency: 'fixed',
      daysOfWeek: [],
      timesPerWeek: '',
    });
    setIsModalOpen(true);
  };

  const openUpdateModal = (task) => {
    setSelectedTask(task);
    setNewTask({
      title: task.title,
      defaultDuration: String(task.defaultDuration),
      frequency: task.frequency,
      daysOfWeek: task.daysOfWeek || [],
      timesPerWeek: task.timesPerWeek
        ? String(task.timesPerWeek)
        : '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const toggleDay = (day) => {
    setNewTask((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRoutine();
    setRefreshing(false);
  };

  /* ---------------- UI ---------------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading routine...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📋 Manage Routine</Text>
        <Pressable style={styles.addButton} onPress={openAddModal}>
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </Pressable>
      </View>

      {/* List */}
      <ScrollView
        style={styles.tasksList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {tasks.map((task) => (
          <View key={task._id} style={styles.taskCard}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskDetail}>
              Duration: {task.defaultDuration} min
            </Text>
            <Text style={styles.taskDetail}>
              Frequency: {task.frequency}
            </Text>
            {task.frequency === 'fixed' && (
              <Text style={styles.taskDetail}>
                Days:{' '}
                {task.daysOfWeek
                  .map(
                    (d) =>
                      daysOfWeekOptions.find((opt) => opt.value === d)?.label
                  )
                  .join(', ')}
              </Text>
            )}

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
                  {deleteLoading === task._id
                    ? 'Deleting...'
                    : 'Delete'}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal */}
      <Modal visible={isModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedTask ? 'Update Task' : 'Add Task'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Task title"
              value={newTask.title}
              onChangeText={(t) =>
                setNewTask({ ...newTask, title: t })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Duration (minutes)"
              keyboardType="numeric"
              value={newTask.defaultDuration}
              onChangeText={(t) =>
                setNewTask({ ...newTask, defaultDuration: t })
              }
            />

            {/* Frequency */}
            <View style={styles.frequencyOptions}>
              {frequencies.map((f) => (
                <Pressable
                  key={f}
                  style={[
                    styles.frequencyButton,
                    newTask.frequency === f &&
                      styles.frequencyButtonActive,
                  ]}
                  onPress={() =>
                    setNewTask({ ...newTask, frequency: f })
                  }
                >
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      newTask.frequency === f &&
                        styles.frequencyButtonTextActive,
                    ]}
                  >
                    {f}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Days */}
            {newTask.frequency === 'fixed' && (
              <View style={styles.daysGrid}>
                {daysOfWeekOptions.map((d) => (
                  <Pressable
                    key={d.value}
                    style={[
                      styles.dayButton,
                      newTask.daysOfWeek.includes(d.value) &&
                        styles.dayButtonActive,
                    ]}
                    onPress={() => toggleDay(d.value)}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        newTask.daysOfWeek.includes(d.value) &&
                          styles.dayButtonTextActive,
                      ]}
                    >
                      {d.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Times per week */}
            {newTask.frequency === 'flexible' && (
              <TextInput
                style={styles.input}
                placeholder="Times per week"
                keyboardType="numeric"
                value={newTask.timesPerWeek}
                onChangeText={(t) =>
                  setNewTask({ ...newTask, timesPerWeek: t })
                }
              />
            )}

            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelButton} onPress={closeModal}>
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.confirmButton}
                onPress={
                  selectedTask ? handleUpdateTask : handleAddTask
                }
              >
                <Text style={{ color: '#fff' }}>
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

/* ---------------- STYLES (unchanged UI) ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: { fontSize: 22, fontWeight: '700' },
  addButton: {
    backgroundColor: '#16a34a',
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: { color: '#fff', fontWeight: '600' },

  tasksList: { paddingHorizontal: 16 },
  taskCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  taskTitle: { fontWeight: '700', fontSize: 16 },
  taskDetail: { fontSize: 12, color: '#666' },

  taskActions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  updateButton: {
    flex: 1,
    backgroundColor: '#eab308',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#dc2626',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },

  frequencyOptions: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  frequencyButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  frequencyButtonText: { fontSize: 12 },
  frequencyButtonTextActive: { color: '#fff' },

  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dayButton: {
    width: '30%',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  dayButtonActive: { backgroundColor: '#3b82f6' },
  dayButtonText: { fontSize: 12 },
  dayButtonTextActive: { color: '#fff' },

  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    borderRadius: 8,
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    borderRadius: 8,
  },
});