import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../auth/AuthContext";
import api from "../services/api";

import TaskCard from "../components/TaskCard";
import EventCard from "../components/EventCard";

import { Sun, ListChecks, Inbox } from "lucide-react-native";

export default function HomeScreen() {

  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { logout } = useAuth();
  const navigation = useNavigation();

  const fetchAll = async () => {
    try {
      const [taskRes, eventRes] = await Promise.all([
        api.get("/routine"),
        api.get("/events/todayEvents")
      ]);

      setTasks(taskRes.data || []);
      setEvents(eventRes.data || []);

    } catch (err) {
      if (err.response?.status === 401) logout();
      console.log(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ---------------------------
     Merge events + today tasks
  ---------------------------- */

  const todayTasks = tasks.filter(t => t.isToday);
  const todayEvents = events || [];

  const todayItems = [
    ...todayEvents.map(e => ({ ...e, type: "event" })),
    ...todayTasks.map(t => ({ ...t, type: "task" }))
  ];

  const sortedTodayItems = todayItems.sort(
    (a, b) => a.completed - b.completed
  );

  const totalTodayItems = sortedTodayItems.length;

  /* ---------------------------
        Loading screen
  ---------------------------- */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Loading your routine...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >

      {/* HEADER */}

      <View style={styles.header}>
        <Text style={styles.title}>My Routine</Text>
        <Text style={styles.subtitle}>
          Stay consistent. Build momentum every day.
        </Text>
      </View>

      {/* EMPTY STATE */}

      {tasks.length === 0 ? (
        <View style={styles.emptyState}>

          <Inbox size={50} color="#9ca3af" />

          <Text style={styles.emptyTitle}>
            No routine set yet
          </Text>

          <Text style={styles.emptySubtitle}>
            Start building your daily discipline.
          </Text>

          <Pressable
            style={styles.cta}
            onPress={() => navigation.navigate("Routine")}
          >
            <Text style={styles.ctaText}>
              Set Routine
            </Text>
          </Pressable>

        </View>
      ) : (

        <>

          {/* TODAY SECTION */}

          <View style={styles.sectionHeader}>

            <View style={styles.sectionLeft}>
              <Sun size={18} color="#7c3aed" />
              <Text style={styles.sectionTitle}>
                Today's Tasks
              </Text>
            </View>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {totalTodayItems}
              </Text>
            </View>

          </View>

          {totalTodayItems === 0 ? (
            <Text style={styles.muted}>
              No tasks scheduled for today.
            </Text>
          ) : (
            sortedTodayItems.map(item =>
              item.type === "event" ? (
                <EventCard key={item._id} event={item} />
              ) : (
                <TaskCard
                  key={item._id}
                  task={item}
                  setTasks={setTasks}
                />
              )
            )
          )}

          {/* OTHER TASKS */}

          <View style={styles.sectionHeader}>

            <View style={styles.sectionLeft}>
              <ListChecks size={18} color="#111827" />
              <Text style={styles.sectionTitle}>
                Other Tasks
              </Text>
            </View>

          </View>

          {tasks.filter(t => !t.isToday).length === 0 ? (
            <Text style={styles.muted}>
              No other tasks available.
            </Text>
          ) : (
            tasks
              .filter(t => !t.isToday)
              .map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  setTasks={setTasks}
                />
              ))
          )}

        </>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    padding: 16
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  header: {
    alignItems: "center",
    marginBottom: 20
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827"
  },

  subtitle: {
    color: "#6b7280",
    marginTop: 4
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },

  sectionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827"
  },

  badge: {
    backgroundColor: "#ede9fe",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20
  },

  badgeText: {
    color: "#7c3aed",
    fontWeight: "600"
  },

  muted: {
    color: "#6b7280",
    fontStyle: "italic"
  },

  /* EMPTY STATE */

  emptyState: {
    alignItems: "center",
    marginTop: 120
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#374151"
  },

  emptySubtitle: {
    color: "#9ca3af",
    marginTop: 4
  },

  cta: {
    marginTop: 14,
    backgroundColor: "#7c3aed",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10
  },

  ctaText: {
    color: "#fff",
    fontWeight: "400"
  }

});