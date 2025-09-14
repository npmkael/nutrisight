import { Color } from "@/constants/TWPalette";
import { processWeeklyData } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

enum Period {
  week = "week",
  month = "month",
  year = "year",
}

// Mock weekly weight gain data (in grams)
const MOCK_WEEKLY_WEIGHT_GAIN = [
  { day_of_week: 0, total: 0.2 },
  { day_of_week: 1, total: 0.01 },
  { day_of_week: 2, total: 0.3 },
  { day_of_week: 3, total: 0.1 },
  { day_of_week: 4, total: 0.06 },
  { day_of_week: 5, total: 0.5 },
  { day_of_week: 6, total: 0.2 },
];

export default function TargetWeightChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartPeriod, setChartPeriod] = useState<Period>(Period.week);
  const [currentData, setCurrentDate] = useState();
  const [currentEndDate, setCurrentEndDate] = useState();
  const [weekDateRange, setWeekDateRange] = useState<string>("");
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);

  // Process weekly weight gain data for chart display
  useEffect(() => {
    const processedData = processWeeklyData(MOCK_WEEKLY_WEIGHT_GAIN);

    // Convert to chart format - only show weight gain days
    const formattedData = processedData.map((item) => ({
      value: item.value > 0 ? item.value : 0, // Only show positive values
      label: item.label,
      frontColor: item.value > 0 ? "#2D3644" : "transparent", // Green for gain, transparent for loss/no gain
      spacing: 2,
      topLabelComponent: () =>
        item.value > 0 ? (
          <Text style={styles.topLabel}>{item.value.toFixed(2)}</Text>
        ) : null,
    }));

    setChartData(formattedData);

    // Calculate week date range based on current offset
    const today = new Date();
    const targetDate = new Date(
      today.getTime() + currentWeekOffset * 7 * 24 * 60 * 60 * 1000
    );
    const { startDate, endDate } = getWeekRange(new Date(targetDate));
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    };

    const dateRange = `${formatDate(startDateObj)} - ${formatDate(endDateObj)}`;
    setWeekDateRange(dateRange);
  }, [currentWeekOffset]);

  const getWeekRange = (date: Date) => {
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    const endOfWeek = new Date(date.setDate(startOfWeek.getDate() + 6));

    return {
      startDate: Math.floor(startOfWeek.getTime()),
      endDate: Math.floor(endOfWeek.getTime()),
    };
  };

  const goToPreviousWeek = () => {
    setCurrentWeekOffset(currentWeekOffset - 1);
  };

  const goToNextWeek = () => {
    setCurrentWeekOffset(currentWeekOffset + 1);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekOffset(0);
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.weekNavigation}>
          <TouchableOpacity style={styles.navButton} onPress={goToPreviousWeek}>
            <Ionicons name="chevron-back" size={18} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity onPress={goToCurrentWeek}>
            <Text className="text-md font-PoppinsMedium text-foreground">
              {weekDateRange}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={goToNextWeek}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      <BarChart
        data={chartData}
        barBorderRadius={4}
        noOfSections={5}
        yAxisThickness={0}
        xAxisThickness={0}
        barWidth={28}
        xAxisColor="lightgray"
        yAxisColor="gray"
        xAxisLabelTextStyle={{
          color: Color.gray[400],
          fontSize: 12,
          textAlign: "center",
        }}
        yAxisTextStyle={{
          color: Color.gray[400],
          fontSize: 14,
        }}
        isAnimated
        animationDuration={800}
        dashGap={10}
        spacing={14}
        maxValue={0.5}
        width={290}
        height={200}
        initialSpacing={10}
        endSpacing={14}
      />

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#2D3644" }]} />
          <Text className="text-sm font-Poppins text-foreground">
            Weight Gained
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  weekNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Color.gray[100],
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Color.gray[600],
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Color.gray[900],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Color.gray[600],
  },
  dateRange: {
    fontSize: 13,
    color: Color.gray[500],
    fontWeight: "500" as const,
    textAlign: "center",
  },
  topLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Color.gray[600],
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: Color.gray[600],
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: Color.gray[600],
  },
});
