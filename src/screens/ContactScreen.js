import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';

export default function ContactScreen() {
  const contactLinks = [
    {
      icon: '📧',
      label: 'Email',
      href: 'mailto:dipb7266@gmail.com',
      color: '#dc2626',
    },
    {
      icon: '🐙',
      label: 'GitHub',
      href: 'https://github.com/dipankar049',
      color: '#1f2937',
    },
    {
      icon: '💼',
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/dipankar049',
      color: '#0ea5e9',
    },
    {
      icon: '𝕏',
      label: 'Twitter',
      href: 'https://twitter.com',
      color: '#0f172a',
    },
  ];

  const handlePress = async (url) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // Fallback for email
        if (url.startsWith('mailto:')) {
          // Show alert or copy to clipboard
          alert('Please open your email app and send to: dipb7266@gmail.com');
        }
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <View style={styles.headerCard}>
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.subtitle}>
          Got questions, feedback, or suggestions? Reach out to us via any of these platforms.
        </Text>
      </View>

      {/* Contact Links */}
      <View style={styles.linksContainer}>
        {contactLinks.map((link, idx) => (
          <Pressable
            key={idx}
            style={({ pressed }) => [
              styles.contactLink,
              pressed && styles.contactLinkPressed,
            ]}
            onPress={() => handlePress(link.href)}
          >
            <Text style={styles.linkIcon}>{link.icon}</Text>
            <View style={styles.linkContent}>
              <Text style={styles.linkLabel}>{link.label}</Text>
              <Text style={styles.linkDescription} numberOfLines={1}>
                {link.href.replace('mailto:', '').replace('https://', '')}
              </Text>
            </View>
            <Text style={styles.linkArrow}>→</Text>
          </Pressable>
        ))}
      </View>

      {/* Info Section */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>About HabitTracker</Text>
        <Text style={styles.infoText}>
          HabitTracker is designed to help you build and maintain positive habits. Track your daily routines, monitor your progress, and achieve your goals.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  linksContainer: {
    gap: 12,
    marginBottom: 20,
  },
  contactLink: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  contactLinkPressed: {
    backgroundColor: '#f0f9ff',
    transform: [{ scale: 0.98 }],
  },
  linkIcon: {
    fontSize: 24,
  },
  linkContent: {
    flex: 1,
  },
  linkLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  linkDescription: {
    fontSize: 12,
    color: '#9ca3af',
  },
  linkArrow: {
    fontSize: 18,
    color: '#3b82f6',
    fontWeight: '600',
  },
  infoCard: {
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
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
});