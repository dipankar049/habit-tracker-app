import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useAuth } from "../auth/AuthContext";
import api from "../services/api";
import { useToast } from "react-native-toast-notifications";
import { Info, CheckCircle } from "lucide-react-native";

export default function CalendarScreen() {
  const { token } = useAuth();
  const toast = useToast();

  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const [addingEvent, setAddingEvent] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(false);
  const [togglingEventId, setTogglingEventId] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    scheduledDate: selectedDate,
  });

  const fetchEvents = async () => {
    if (!token) return;

    setLoading(true);

    try {
      const startDate = new Date(`${currentMonth}-01`);
      startDate.setDate(1);

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);

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
      console.error("Error fetching events:", error);
    } finally {
      if (initialLoad) {
        setInitialLoad(false);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [token, currentMonth]);

  const handleAddEvent = async () => {
    if (!newEvent.title.trim()) {
      toast.show("Please enter event title", {
        type: "danger",
        placement: "top",
      });
      return;
    }

    setAddingEvent(true);

    try {
      const res = await api.post(
        "/events",
        {
          title: newEvent.title,
          scheduledDate: new Date(newEvent.scheduledDate).toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents((prev) => [
        ...prev,
        {
          id: res.data.addedEvent._id,
          title: res.data.addedEvent.title,
          scheduledDate: new Date(res.data.addedEvent.scheduledDate),
          completed: res.data.addedEvent.completed,
        },
      ]);

      setAddModalOpen(false);

      setNewEvent({
        title: "",
        scheduledDate: selectedDate,
      });
    } catch (error) {
      toast.show(error.response?.data?.message || "Failed to add event", {
        type: "danger",
        placement: "top",
      });
    } finally {
      setAddingEvent(false);
    }
  };

  const toggleCompletion = async (event) => {
    setTogglingEventId(event.id);

    try {
      await api.put(
        "/events",
        { eventId: event.id, completed: !event.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === event.id ? { ...ev, completed: !ev.completed } : ev
        )
      );
    } catch (error) {
      toast.show("Failed to update event", {
        type: "danger",
        placement: "top",
      });
    } finally {
      setTogglingEventId(null);
    }
  };

  const deleteEvent = async () => {
    if (!eventToDelete) return;

    setDeletingEvent(true);

    try {
      await api.delete(`/events/${eventToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents((prev) =>
        prev.filter((ev) => ev.id !== eventToDelete.id)
      );

      setDeleteModalOpen(false);
      setEventToDelete(null);
    } catch (error) {
      toast.show("Failed to delete event", {
        type: "danger",
        placement: "top",
      });
    } finally {
      setDeletingEvent(false);
    }
  };

  const getMarkedDates = () => {
    const marked = {};

    events.forEach((event) => {
      const date = event.scheduledDate.toISOString().split("T")[0];

      marked[date] = {
        marked: true,
        dotColor: event.completed ? "green" : "red",
      };
    });

    marked[selectedDate] = {
      ...(marked[selectedDate] || {}),
      selected: true,
      selectedColor: "#7c3aed",
    };

    return marked;
  };

  const selectedDayEvents = events.filter(
    (event) =>
      event.scheduledDate.toISOString().split("T")[0] === selectedDate
  );

  if (initialLoad && loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading calendar...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <View style={styles.subtitleRow}>
        <Text style={styles.subtitle}>Schedule your important events</Text>

        <Pressable onPress={() => setHelpModalOpen(true)}>
          <Info size={17} color="#3b82f6" />
        </Pressable>
      </View>
      {!initialLoad && loading && (
        <ActivityIndicator color="#7c3aed" style={{ marginVertical: 10 }} />
      )}
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          setNewEvent({
            title: "",
            scheduledDate: day.dateString,
          });
        }}
        onMonthChange={(month) => {
          const monthStr = `${month.year}-${String(month.month).padStart(2, "0")}`;
          setCurrentMonth(monthStr);
        }}
        markedDates={getMarkedDates()}
        theme={{
          todayTextColor: "#7c3aed",
          arrowColor: "#7c3aed",
        }}
      />

      <Pressable
        style={styles.addButton}
        onPress={() => setAddModalOpen(true)}
      >
        <Text style={styles.addButtonText}>+ Add Event</Text>
      </Pressable>

      <View style={styles.eventsContainer}>
        {selectedDayEvents.map((event) => (
          <Pressable
            key={event.id}
            onPress={() => toggleCompletion(event)}
            onLongPress={() => {
              setEventToDelete(event);
              setDeleteModalOpen(true);
            }}
            style={styles.eventTag}
          >
            <View style={styles.eventRow}>
              {togglingEventId === event.id ? (
                <ActivityIndicator size="small" color="#7c3aed" style={{ marginRight: 6 }} />
              ) : (
                event.completed && (
                  <CheckCircle size={16} color="#22c55e" style={{ marginRight: 6 }} />
                )
              )}

              <Text style={styles.eventTagText}>
                {event.title}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Add Event Modal */}
      <Modal visible={addModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Event</Text>

            <TextInput
              style={styles.input}
              placeholder="Event title"
              value={newEvent.title}
              editable={!addingEvent}
              onChangeText={(text) =>
                setNewEvent({ ...newEvent, title: text })
              }
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
                disabled={addingEvent}
              >
                {addingEvent ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Add</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Modal */}
      <Modal visible={deleteModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Event?</Text>

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
                disabled={deletingEvent}
              >
                {deletingEvent ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Delete</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={helpModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.helpModalContent}>
            <Text style={styles.modalTitle}>How to use Calendar</Text>

            <Text style={styles.helpText}>• Tap a date to view events.</Text>
            <Text style={styles.helpText}>• Press "+ Add Event" to create an event for the selected date.</Text>
            <Text style={styles.helpText}>• Tap an event to mark it completed.</Text>
            <Text style={styles.helpText}>• Long press an event to delete it.</Text>
            {/* <Text style={styles.helpText}>• 🔴 Red dot = Pending event.</Text>
            <Text style={styles.helpText}>• 🟢 Green dot = Completed event.</Text> */}
            <View style={styles.helpRow}>
              <View style={[styles.statusDot, { backgroundColor: "#ef4444" }]} />
              <Text style={styles.helpText}> ➟ Pending event</Text>
            </View>

            <View style={styles.helpRow}>
              <View style={[styles.statusDot, { backgroundColor: "#22c55e" }]} />
              <Text style={styles.helpText}> ➟ Completed event</Text>
            </View>

            <Pressable
              style={styles.helpButton}
              onPress={() => setHelpModalOpen(false)}
            >
              <Text style={styles.buttonText}>Got it</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
  },

  addButton: {
    backgroundColor: "#7c3aed",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  eventsContainer: {
    marginTop: 12,
    marginBottom: 20,
    gap: 8,
  },

  eventTag: {
    backgroundColor: "#ede9fe",
    padding: 10,
    borderRadius: 6,
  },

  eventRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  eventTagText: {
    color: "#1e40af",
    fontWeight: "500",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },

  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "#9ca3af",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },

  confirmButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  subtitleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    marginBottom: 16,
  },

  helpModalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "85%",
    alignSelf: "center",
  },

  helpButton: {
    backgroundColor: "#3b82f6",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 12,
    width: "fit-content"
  },

  helpText: {
    marginBottom: 8,
    fontSize: 15,
    color: "#444",
  },

  helpRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
});