import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons';

export default function LandingScreen() {

    const navigation = useNavigation();

    const habits = [
        { name: "Morning Exercise", time: "30 min", done: true },
        { name: "DSA Practice", time: "90 min", done: true },
        { name: "Book Reading", time: "40 min", done: false },
        { name: "Meditation", time: "15 min", done: false },
    ];

    const features = [
        {
            icon: "repeat",
            color: "#8b5cf6",
            title: "Smart Routine System",
            desc: "Create habits with custom duration goals."
        },
        {
            icon: "check-circle",
            color: "#22c55e",
            title: "Daily Task Tracking",
            desc: "Mark tasks complete and log time spent."
        },
        {
            icon: "bar-chart-2",
            color: "#3b82f6",
            title: "Weekly Analytics",
            desc: "Understand how much time you invest."
        },
        {
            icon: "calendar",
            color: "#f59e0b",
            title: "GitHub-style Heatmap",
            desc: "Visualize your consistency."
        },
        {
            icon: "edit-3",
            color: "#ef4444",
            title: "Edit Anytime",
            desc: "Update your routines anytime."
        },
        {
            icon: "layers",
            color: "#14b8a6",
            title: "Clean Interface",
            desc: "Focused UI for deep work."
        }
    ];

    return (
        <ScrollView style={styles.container}>

            {/* HERO */}
            <View style={styles.hero}>

                <Text style={styles.badge}>⚡ Weekly analytics & heatmaps</Text>

                <Text style={styles.title}>
                    Build habits{"\n"}
                    <Text style={styles.gradientText}>that stick.</Text>
                </Text>

                <Text style={styles.subtitle}>
                    Track daily routines, measure time spent, and visualize your consistency.
                </Text>

                <View style={styles.buttonRow}>
                    <Pressable
                        style={styles.primaryBtn}
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text style={styles.primaryBtnText}>Get Started →</Text>
                    </Pressable>

                    <Pressable style={styles.secondaryBtn}>
                        <Text style={styles.secondaryBtnText}>How it works</Text>
                    </Pressable>
                </View>
            </View>

            {/* PREVIEW CARD */}
            <View style={styles.card}>

                <Text style={styles.cardHeader}>Today • Sunday</Text>

                {habits.map((h, i) => (
                    <View key={i} style={styles.habitRow}>

                        <View style={[
                            styles.checkbox,
                            h.done && styles.checkboxDone
                        ]}>
                            {h.done && <Text style={styles.check}>✓</Text>}
                        </View>

                        <View style={{ flex: 1 }}>
                            <View style={styles.habitHeader}>
                                <Text style={styles.habitName}>{h.name}</Text>
                                <Text style={styles.habitTime}>{h.time}</Text>
                            </View>

                            <View style={styles.progressBg}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        { width: h.done ? "100%" : "0%" }
                                    ]}
                                />
                            </View>
                        </View>

                    </View>
                ))}

            </View>

            {/* FEATURES */}
            <View style={styles.features}>

                <Text style={styles.sectionTitle}>Features</Text>

                {features.map((f, i) => (
                    <View key={i} style={styles.featureCard}>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Feather name={f.icon} size={22} color={f.color} />
                            <Text style={styles.featureTitle}>{f.title}</Text>
                        </View>


                        <Text style={styles.featureDesc}>{f.desc}</Text>

                    </View>
                ))}

            </View>

            {/* CTA */}
            <View style={styles.cta}>

                <Text style={styles.ctaTitle}>
                    Start building better habits today
                </Text>

                <Pressable
                    style={styles.primaryBtn}
                    onPress={() => navigation.navigate("Register")}
                >
                    <Text style={styles.primaryBtnText}>
                        Create free account →
                    </Text>
                </Pressable>

            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },

    hero: {
        padding: 24,
    },

    badge: {
        color: "#6366f1",
        marginBottom: 10,
    },

    title: {
        fontSize: 34,
        fontWeight: "bold",
        color: "#111827",
    },

    gradientText: {
        color: "#7c3aed",
    },

    subtitle: {
        marginTop: 10,
        color: "#6b7280",
        lineHeight: 22,
    },

    buttonRow: {
        flexDirection: "row",
        marginTop: 20,
        gap: 10,
    },

    primaryBtn: {
        backgroundColor: "#7c3aed",
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 10,
    },

    primaryBtnText: {
        color: "white",
        fontWeight: "600",
    },

    secondaryBtn: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 10,
    },

    secondaryBtnText: {
        color: "#374151",
    },

    card: {
        margin: 20,
        padding: 20,
        backgroundColor: "#ffffff",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },

    cardHeader: {
        color: "#6b7280",
        marginBottom: 10,
    },

    habitRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },

    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: "#475569",
        borderRadius: 10,
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    checkboxDone: {
        backgroundColor: "#8b5cf6",
        borderColor: "#8b5cf6",
    },

    check: {
        color: "white",
        fontSize: 12,
    },

    habitHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    habitName: {
        color: "#111827",
    },

    habitTime: {
        color: "#7c3aed",
        fontSize: 12,
    },

    progressBg: {
        height: 4,
        backgroundColor: "#e5e7eb",
        borderRadius: 4,
        marginTop: 4,
    },

    progressFill: {
        height: 4,
        backgroundColor: "#6366f1",
        borderRadius: 4,
    },

    features: {
        padding: 20,
    },

    sectionTitle: {
        color: "#111827",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
    },

    featureCard: {
        backgroundColor: "#f9fafb",
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },

    featureTitle: {
        fontSize: 15,
        color: "#111827",
        fontWeight: "600",
        marginLeft: 6,
    },

    featureDesc: {
        color: "#6b7280",
        marginTop: 4,
    },

    cta: {
        padding: 24,
        paddingBottom: 60,
        alignItems: "center",
    },

    ctaTitle: {
        color: "#111827",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },

});