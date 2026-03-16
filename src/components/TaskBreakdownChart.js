import React from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";

export default function TaskBreakdownChart({ tasks }) {

  const taskColors = [
    "#4ade80", // green
    "#fbbf24", // amber
    "#22d3ee", // cyan
    "#f87171", // red
    "#a3e635", // lime
    "#f472b6", // pink
    "#2dd4bf", // teal
  ];

  const data = tasks.map((t, i) => ({
    value: t.timeSpent || 0,
    label: t.taskName,
    frontColor: taskColors[i % taskColors.length],
    backgroundColor: "#f3f4f6",
  }));

  const chartHeight = data.length * 35;

  return (
    <View style={{ height: chartHeight + 80 }}>
      <BarChart
        data={data}
        horizontal
        barWidth={26}
        spacing={10}
        barBorderRadius={6}
        roundedTop
        hideRules
        xAxisThickness={0}
        yAxisThickness={0}
        noOfSections={4}
        isAnimated
        initialSpacing={0}

        /* Value label at bar end */
        showValuesAsTopLabel
        topLabelTextStyle={{
          fontSize: 12,
          color: "#111827",
          fontWeight: "600",
          marginRight: 6,
        }}

        /* Tooltip */
        renderTooltip={(item, index) => (
          <View
            style={{
              backgroundColor: "#111827",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
              marginLeft: item.label?.length > 12 ? -140 : -20,
              marginBottom: index === 0 ? -30 : 30,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 11,
                fontWeight: "600",
              }}
            >
              {item.label}
            </Text>
          </View>
        )}
      />
    </View>
  );
}