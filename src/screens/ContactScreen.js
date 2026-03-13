import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  ArrowRight
} from "lucide-react-native";

export default function ContactScreen() {
  const contactLinks = [
    {
      icon: Mail,
      label: "Email",
      href: "mailto:dipb7266@gmail.com",
      color: "#ef4444",
    },
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/dipankar049",
      color: "#111827",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/dipankar049",
      color: "#0ea5e9",
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: "https://twitter.com",
      color: "#0f172a",
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
        {contactLinks.map((link, idx) => {
          const Icon = link.icon;

          return <Pressable
            key={idx}
            style={({ pressed }) => [
              styles.contactLink,
              pressed && styles.contactLinkPressed,
            ]}
            onPress={() => handlePress(link.href)}
          >
            <View style={[styles.iconWrapper, { backgroundColor: `${link.color}15` }]}>
              <Icon size={20} color={link.color} />
            </View>
            <View style={styles.linkContent}>
              <Text style={styles.linkLabel}>{link.label}</Text>
              <Text style={styles.linkDescription} numberOfLines={1}>
                {link.href.replace('mailto:', '').replace('https://', '')}
              </Text>
            </View>
            <ArrowRight size={18} color="#9ca3af" />
          </Pressable>
        })}
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
    backgroundColor: "#f8fafc",
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  headerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 26,
    paddingHorizontal: 20,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },

  linksContainer: {
    gap: 14,
    marginBottom: 24,
  },

  contactLink: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  contactLinkPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },

  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  linkContent: {
    flex: 1,
  },

  linkLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },

  linkDescription: {
    fontSize: 12,
    color: "#9ca3af",
  },

  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  infoText: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 20,
  },

});