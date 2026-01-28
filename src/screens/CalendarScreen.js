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
} from 'react-native';
import { useAuth } from '../auth/AuthContext';
import api from '../services/api';

export default function CalendarScreen() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    scheduledDate: new Date().toISOString().split('T')[0],
  });

  const fetchEvents = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const res = await api.get(
        `/events?start=${startDate.toISOString()}&end=${endDate.toISOString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents(
        (res.data || []).map((ev) => ({
          id: ev._id,
          title: ev.title,
          scheduledDate: new Date(ev.scheduledDate),
          completed: ev.completed,
        }))
      );
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate, token]);

  const handleAddEvent = async () => {
    if (!newEvent.title.trim()) {
      Alert.alert('Error', 'Please enter event title');
      return;
    }

    try {
      const res = await api.post(
        '/events',
        {
          title: newEvent.title,
          scheduledDate: new Date(newEvent.scheduledDate).toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents((prev) => [
        ...prev,
        {
          id: res.data._id,
          title: res.data.title,
          scheduledDate: new Date(res.data.scheduledDate),
          completed: res.data.completed,
        },
      ]);

      setAddModalOpen(false);
      setNewEvent({
        title: '',
        scheduledDate: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add event');
    }
  };

  const toggleCompletion = async (event) => {
    try {
      await api.put(
        '/events',
        { eventId: event.id, completed: !event.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.id === event.id ? { ...ev, completed: !ev.completed } : ev
        )
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update event');
    }
  };

  const deleteEvent = async () => {
    if (!eventToDelete) return;
    try {
      await api.delete(`/events/${eventToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents((prevEvents) => prevEvents.filter((ev) => ev.id !== eventToDelete.id));
      setDeleteModalOpen(false);
      setEventToDelete(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete event');
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getEventsForDay = (day) => {
    return events.filter((event) => {
      const eventDay = event.scheduledDate.getDate();
      const eventMonth = event.scheduledDate.getMonth();
      const eventYear = event.scheduledDate.getFullYear();
      return (
        eventDay === day &&
        eventMonth === currentDate.getMonth() &&
        eventYear === currentDate.getFullYear()
      );
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading calendar...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📅 Calendar</Text>
      <Text style={styles.subtitle}>Schedule your important events</Text>

      {/* Month Navigation */}
      <View style={styles.monthNav}>
        <Pressable onPress={handlePrevMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>❮ Prev</Text>
        </Pressable>
        <Text style={styles.monthYear}>
          {monthName} {year}
        </Text>
        <Pressable onPress={handleNextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>Next ❯</Text>
        </Pressable>
      </View>

      {/* Add Event Button */}
      <Pressable
        style={styles.addButton}
        onPress={() => setAddModalOpen(true)}
      >
        <Text style={styles.addButtonText}>+ Add Event</Text>
      </Pressable>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <View key={day} style={styles.dayHeader}>
            <Text style={styles.dayHeaderText}>{day}</Text>
          </View>
        ))}

        {days.map((day, index) => {
          const dayEvents = day ? getEventsForDay(day) : [];
          return (
            <View
              key={index}
              style={[
                styles.dayCell,
                !day && styles.emptyCell,
              ]}
            >
              {day && (
                <>
                  <Text style={styles.dayNumber}>{day}</Text>
                  <View style={styles.eventsList}>
                    {dayEvents.map((event) => (
                      <Pressable
                        key={event.id}
                        onPress={() => toggleCompletion(event)}
                        onLongPress={() => {
                          setEventToDelete(event);
                          setDeleteModalOpen(true);
                        }}
                        style={styles.eventTag}
                      >
                        <Text style={styles.eventTagText} numberOfLines={1}>
                          {event.completed ? '✅ ' : ''}{event.title}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </>
              )}
            </View>
          );
        })}
      </View>

      {/* Add Event Modal */}
      <Modal
        visible={addModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Event</Text>

            <TextInput
              style={styles.input}
              placeholder="Event title"
              value={newEvent.title}
              onChangeText={(text) =>
                setNewEvent({ ...newEvent, title: text })
              }
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Date (YYYY-MM-DD)"
              value={newEvent.scheduledDate}
              onChangeText={(text) =>
                setNewEvent({ ...newEvent, scheduledDate: text })
              }
              placeholderTextColor="#999"
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setAddModalOpen(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.confirmButton}
                onPress={handleAddEvent}
              >
                <Text style={styles.buttonText}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Event?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete "{eventToDelete?.title}"?
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setDeleteModalOpen(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.deleteButton}
                onPress={deleteEvent}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  },
  monthYear: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  dayHeader: {
    width: '14.28%',
    paddingVertical: 12,
    backgroundColor: '#f0f9ff',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayHeaderText: {
    fontWeight: '600',
    fontSize: 12,
    color: '#3b82f6',
  },
  dayCell: {
    width: '14.28%',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: '#fff',
  },
  emptyCell: {
    backgroundColor: '#f9fafb',
  },
  dayNumber: {
    fontWeight: '700',
    fontSize: 12,
    color: '#1f2937',
    marginBottom: 4,
  },
  eventsList: {
    gap: 2,
  },
  eventTag: {
    backgroundColor: '#dbeafe',
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  eventTagText: {
    fontSize: 9,
    color: '#1e40af',
    fontWeight: '500',
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1f2937',
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
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
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#dc2626',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});