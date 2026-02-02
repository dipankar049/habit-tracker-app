import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import EventCard from '../components/EventCard';

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
        api.get('/routine'),
        api.get('/events/todayEvents'),
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
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>My Routine</Text>

      {tasks.length === 0 ? (
        <View style={styles.empty}>
          <Text>No task found</Text>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('Routine')}
          >
            <Text style={styles.buttonText}>Set Routine</Text>
          </Pressable>
        </View>
      ) : (
        <>
          {/* Today Tasks */}
          <Text style={styles.sectionTitle}>✅ Today’s Tasks</Text>

          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}

          {tasks.filter(t => t.isToday).length === 0 ? (
            <Text style={styles.muted}>No tasks scheduled for today.</Text>
          ) : (
            tasks
              .filter(t => t.isToday)
              .map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  setTasks={setTasks}
                />
              ))
          )}

          {/* Other Tasks */}
          <Text style={styles.sectionTitle}>📋 Other Tasks</Text>

          {tasks.filter(t => !t.isToday).length === 0 ? (
            <Text style={styles.muted}>No other tasks available.</Text>
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
  container: { padding: 16 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  muted: {
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  empty: {
    marginTop: 120,
    alignItems: 'center',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#16a34a',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
