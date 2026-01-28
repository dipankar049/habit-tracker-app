import { View, Text, StyleSheet } from 'react-native';

export default function EventCard({ event }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={event.completed ? styles.done : styles.pending}>
        {event.completed ? 'Completed' : 'Pending'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: { fontWeight: '600' },
  done: { color: '#16a34a' },
  pending: { color: '#6b7280' },
});
