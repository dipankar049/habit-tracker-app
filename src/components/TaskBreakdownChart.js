import React from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";

export default function TaskBreakdownChart({ tasks }) {

  const data = tasks.map((t) => ({
    value: t.timeSpent || 0,
    label: t.taskName,
    frontColor: "#3b82f6",
  }));

  return (
    <BarChart
      data={data}
      horizontal
      barWidth={26}
      spacing={18}
      barBorderRadius={6}
      roundedTop
      hideRules
      xAxisThickness={0}
      yAxisThickness={0}
      noOfSections={4}
      isAnimated
      initialSpacing={10}

      /* Value label at bar end */
      showValuesAsTopLabel
      topLabelTextStyle={{
        fontSize: 12,
        color: "#111827",
        fontWeight: "600",
        marginRight: 6,
      }}

      /* Tooltip */
      renderTooltip={(item) => (
        <View
          style={{
            backgroundColor: "#111827",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            marginLeft: -120,
            marginBottom: -10,
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
  );
}