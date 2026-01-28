import { View, Text, StyleSheet, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import api from '../services/api';

export default function TaskCard({ task, setTasks }) {
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    setLoading(true);
    try {
      await api.post('/logTask/complete', {
        taskId: task._id,
        duration: task.defaultDuration,
        completed: !task.completed,
      });

      setTasks(prev =>
        prev.map(t =>
          t._id === task._id
            ? { ...t, completed: !t.completed }
            : t
        )
      );
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{task.title}</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(task.defaultDuration)}
          editable={!task.completed && !loading}
          onChangeText={text =>
            setTasks(prev =>
              prev.map(t =>
                t._id === task._id
                  ? { ...t, defaultDuration: Number(text) }
                  : t
              )
            )
          }
        />

        <Pressable
          style={[
            styles.button,
            task.completed ? styles.completed : styles.pending,
          ]}
          onPress={toggleStatus}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>
              {task.completed ? '✅ Completed' : '⌛ Pending'}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: '600' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 6,
    width: 70,
    borderRadius: 6,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  pending: { backgroundColor: '#16a34a' },
  completed: { backgroundColor: '#6b7280' },
  btnText: { color: '#fff', fontWeight: '600' },
});
