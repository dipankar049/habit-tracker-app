import React from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";

export default function WeeklyBarChart({ data, selectedDate, onBarClick }) {

    const chartData = data.map((item) => {
        const total =
            item.tasks?.reduce((sum, t) => sum + (t.timeSpent || 0), 0) || 0;

        return {
            value: total,
            label: item.dayName,
            frontColor: item.date === selectedDate ? "#7c3aed" : "#a78bfa",
            onPress: () => onBarClick(item.date),
        };
    });

    // const chartData = [
    //     { value: 70, label: "Mon", frontColor: "#2563eb" },
    //     { value: 90, label: "Tue", frontColor: "#2563eb" },
    //     { value: 30, label: "Wed", frontColor: "#2563eb" },
    //     { value: 120, label: "Thu", frontColor: "#2563eb" },
    //     { value: 70, label: "Fri", frontColor: "#2563eb" },
    //     { value: 150, label: "Sat", frontColor: "#2563eb" },
    //     { value: 40, label: "Sun", frontColor: "#2563eb" },
    // ]

    return (
        <BarChart
            data={chartData}
            barWidth={26}
            spacing={12}
            roundedTop
            barBorderRadius={6}
            hideRules
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={{ color: "#9ca3af", fontSize: 11 }}
            xAxisLabelTextStyle={{ color: "#6b7280", fontSize: 12 }}
            noOfSections={4}
            isAnimated
            animationDuration={600}
            renderTooltip={(item) => {
                return (
                    <View
                        style={{
                            alignItems: "center",
                            marginBottom: -10,
                            marginLeft: -12,
                        }}
                    >
                        {/* tooltip box */}
                        <View
                            style={{
                                backgroundColor: "#111827",
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 6,
                            }}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: 11,
                                    fontWeight: "600",
                                }}
                            >
                                {item.value} min
                            </Text>
                        </View>

                        {/* small arrow */}
                        <View
                            style={{
                                alignSelf: "center",
                                width: 0,
                                height: 0,
                                borderLeftWidth: 5,
                                borderRightWidth: 5,
                                borderTopWidth: 6,
                                borderLeftColor: "transparent",
                                borderRightColor: "transparent",
                                borderTopColor: "#111827",
                            }}
                        />
                    </View>
                );
            }}
        />
    );
}