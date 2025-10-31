import { Color } from "@/constants/TWPalette";
import { LoggedWeight } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";

enum Period {
  week = "week",
  month = "month",
  year = "year",
}

type ViewMode = "weekly" | "monthly";

export default function TargetWeightChart({
  loggedWeights,
  targetWeight,
}: {
  loggedWeights: LoggedWeight[];
  targetWeight?: number;
}) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [monthlyChartData, setMonthlyChartData] = useState<any[]>([]);
  const [chartPeriod, setChartPeriod] = useState<Period>(Period.week);
  const [viewMode, setViewMode] = useState<ViewMode>("weekly");
  const [currentData, setCurrentDate] = useState<Date | null>(null);
  const [currentEndDate, setCurrentEndDate] = useState<Date | null>(null);
  const [weekDateRange, setWeekDateRange] = useState<string>("");
  const [monthDateRange, setMonthDateRange] = useState<string>("");
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);
  const [currentMonthOffset, setCurrentMonthOffset] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  const { width: windowWidth } = useWindowDimensions();

  // Process weekly weight data for chart display (show absolute weights in kg)
  useEffect(() => {
    // Calculate week date range based on current offset
    const today = new Date();
    const targetDate = new Date(
      today.getTime() + currentWeekOffset * 7 * 24 * 60 * 60 * 1000
    );
    const { startDate, endDate, startDateObj, endDateObj } =
      getWeekRange(targetDate);

    // Helper: local YYYY-MM-DD key (avoids UTC shift from toISOString)
    const localDateKey = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;

    // Normalize incoming logged weights to ensure shape { value:number; date:string }
    // Keep a Date object around to compare by local date parts
    const normalized = loggedWeights
      .map((w) => {
        const dateObj =
          typeof w.date === "string" ? new Date(w.date) : new Date(w.date);
        return {
          value: Number(w.value || 0),
          date: dateObj.toISOString(), // keep ISO for storage/consumers
          dateObj,
        };
      })
      .filter(
        (w) => !Number.isNaN(w.value) && w.dateObj.toString() !== "Invalid Date"
      );

    // Create an entry for each day of the week (Sun..Sat)
    // For days without a logged weight we use `null` so the chart library
    // can hide the bar instead of rendering a dummy 0 value.
    const weekDays = Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(startDateObj);
      day.setDate(startDateObj.getDate() + i);
      // use localDateKey for comparison to avoid UTC offset issues
      const dayKey = localDateKey(day); // local YYYY-MM-DD
      const found = normalized.find((w) => localDateKey(w.dateObj) === dayKey);
      return {
        date: day.toISOString(),
        // if no value, use null so the bar is hidden
        value: found ? found.value : null,
        label: day.toLocaleDateString("en-US", { weekday: "short" }),
      };
    });

    // If none of the days have a real value, render empty chart state
    const hasAnyValue = weekDays.some((d) => d.value !== null && d.value > 0);
    if (!hasAnyValue) {
      setChartData([]);
      setMaxValue(1);
      setWeekDateRange(formatRange(startDateObj, endDateObj));
      return;
    }

    // Build chart data from weekDays (you can replace 0 fallback with last-known value if desired)
    const formattedData = weekDays.map((item) => ({
      // value may be `number` or `null` - gifted-charts will hide null bars
      value: item.value,
      label: item.label,
      frontColor: item.value !== null ? "#2D3644" : "#E6E9EE",
      spacing: 2,
      topLabelComponent: () =>
        item.value !== null ? (
          <Text style={styles.topLabel}>{Number(item.value).toFixed(1)}</Text>
        ) : (
          <Text style={styles.topLabel}></Text>
        ),
    }));

    setChartData(formattedData);

    // compute a sensible max/min for the Y axis (based on real values only)
    const values = weekDays
      .map((d) => d.value)
      .filter((v) => v !== null) as number[];
    const max = values.length ? Math.max(...values) : 0;
    setMaxValue(max > 0 ? max * 1.1 : 1);

    setWeekDateRange(formatRange(startDateObj, endDateObj));
  }, [currentWeekOffset, loggedWeights, chartPeriod]);

  // Process monthly weight data for line chart display
  useEffect(() => {
    if (viewMode !== "monthly") return;

    const today = new Date();
    const targetDate = new Date(
      today.getFullYear(),
      today.getMonth() + currentMonthOffset,
      1
    );
    const startOfMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() + 1,
      0
    );

    setMonthDateRange(
      `${startOfMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })}`
    );

    // Helper: local YYYY-MM-DD key
    const localDateKey = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;

    // Normalize logged weights
    const normalized = loggedWeights
      .map((w) => {
        const dateObj =
          typeof w.date === "string" ? new Date(w.date) : new Date(w.date);
        return {
          value: Number(w.value || 0),
          date: dateObj.toISOString(),
          dateObj,
        };
      })
      .filter(
        (w) =>
          !Number.isNaN(w.value) &&
          w.dateObj.toString() !== "Invalid Date" &&
          w.dateObj >= startOfMonth &&
          w.dateObj <= endOfMonth
      )
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    if (normalized.length === 0) {
      setMonthlyChartData([]);
      setMaxValue(1);
      return;
    }

    // Group by week and calculate weekly averages
    const weeklyData: { [key: string]: { values: number[]; weekNum: number } } =
      {};

    normalized.forEach((entry) => {
      const weekStart = new Date(entry.dateObj);
      const day = weekStart.getDay();
      weekStart.setDate(weekStart.getDate() - day);
      const weekKey = localDateKey(weekStart);

      // Calculate week number in month
      const weekNum = Math.ceil(
        (entry.dateObj.getDate() + startOfMonth.getDay()) / 7
      );

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { values: [], weekNum };
      }
      weeklyData[weekKey].values.push(entry.value);
    });

    // Create line chart data points
    const lineData = Object.entries(weeklyData)
      .map(([weekKey, data]) => ({
        value: data.values.reduce((a, b) => a + b, 0) / data.values.length,
        label: `W${data.weekNum}`,
        weekNum: data.weekNum,
        dataPointText: (
          data.values.reduce((a, b) => a + b, 0) / data.values.length
        ).toFixed(1),
      }))
      .sort((a, b) => a.weekNum - b.weekNum);

    // If we have individual daily points, use them instead
    const dailyData = normalized.map((entry) => ({
      value: entry.value,
      label: entry.dateObj.getDate().toString(),
      dataPointText: entry.value.toFixed(1),
      date: entry.dateObj,
    }));

    // Use daily data if we have less than 15 points, otherwise use weekly averages
    const finalData = dailyData.length <= 15 ? dailyData : lineData;

    setMonthlyChartData(finalData);

    // Calculate max value for Y axis
    const values = finalData.map((d) => d.value);
    const max = values.length ? Math.max(...values) : 0;
    const min = values.length ? Math.min(...values) : 0;

    // Include target weight in the range if provided
    const rangeMax = targetWeight ? Math.max(max, targetWeight) : max;
    const rangeMin = targetWeight ? Math.min(min, targetWeight) : min;

    setMaxValue(rangeMax > 0 ? rangeMax * 1.1 : 1);
  }, [currentMonthOffset, loggedWeights, viewMode, targetWeight]);

  const getWeekRange = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const startOfWeek = new Date(d);
    startOfWeek.setDate(d.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return {
      startDate: startOfWeek.getTime(),
      endDate: endOfWeek.getTime(),
      startDateObj: startOfWeek,
      endDateObj: endOfWeek,
    };
  };

  const formatRange = (startDate: Date, endDate: Date) => {
    return `${startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;
  };

  const goToPreviousWeek = () => {
    setCurrentWeekOffset((s) => s - 1);
  };

  const goToNextWeek = () => {
    setCurrentWeekOffset((s) => s + 1);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekOffset(0);
  };

  const goToPreviousMonth = () => {
    setCurrentMonthOffset((s) => s - 1);
  };

  const goToNextMonth = () => {
    setCurrentMonthOffset((s) => s + 1);
  };

  const goToCurrentMonth = () => {
    setCurrentMonthOffset(0);
  };

  const handleToggleView = (mode: ViewMode) => {
    if (mode === viewMode) return;

    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setViewMode(mode);
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  // Calculate statistics
  const calculateStats = () => {
    if (loggedWeights.length === 0) {
      return {
        currentWeight: 0,
        weightChange: 0,
        progressPercent: 0,
        trend: "neutral" as "up" | "down" | "neutral",
      };
    }

    const sorted = [...loggedWeights]
      .map((w) => ({
        value: Number(w.value),
        date: new Date(w.date),
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    const currentWeight = sorted[0]?.value || 0;

    // Get weight from a week/month ago depending on view
    const daysAgo = viewMode === "weekly" ? 7 : 30;
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - daysAgo);

    const pastWeight =
      sorted.find((w) => w.date <= pastDate)?.value || currentWeight;
    const weightChange = currentWeight - pastWeight;

    let progressPercent = 0;
    if (targetWeight && sorted.length > 1) {
      const startWeight = sorted[sorted.length - 1].value;
      const totalChange = targetWeight - startWeight;
      const currentChange = currentWeight - startWeight;
      progressPercent =
        totalChange !== 0 ? (currentChange / totalChange) * 100 : 0;
    }

    const trend =
      weightChange > 0.1 ? "up" : weightChange < -0.1 ? "down" : "neutral";

    return {
      currentWeight,
      weightChange,
      progressPercent,
      trend,
    };
  };

  const stats = calculateStats();

  return (
    <>
      {/* Toggle Component */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === "weekly" && styles.toggleButtonActive,
          ]}
          onPress={() => handleToggleView("weekly")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === "weekly" && styles.toggleTextActive,
            ]}
          >
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === "monthly" && styles.toggleButtonActive,
          ]}
          onPress={() => handleToggleView("monthly")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === "monthly" && styles.toggleTextActive,
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>
      </View>

      {/* Summary Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Current</Text>
          <Text style={styles.statValue}>
            {stats.currentWeight > 0
              ? `${stats.currentWeight.toFixed(1)} kg`
              : "N/A"}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Change</Text>
          <View style={styles.statChangeContainer}>
            {stats.trend !== "neutral" && (
              <Ionicons
                name={stats.trend === "up" ? "trending-up" : "trending-down"}
                size={16}
                color={stats.trend === "up" ? Color.red[500] : Color.green[500]}
              />
            )}
            <Text
              style={[
                styles.statValue,
                stats.trend === "up" && styles.statValueUp,
                stats.trend === "down" && styles.statValueDown,
              ]}
            >
              {stats.weightChange !== 0
                ? `${stats.weightChange > 0 ? "+" : ""}${stats.weightChange.toFixed(1)} kg`
                : "0 kg"}
            </Text>
          </View>
        </View>
        {targetWeight && (
          <>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Progress</Text>
              <Text style={styles.statValue}>
                {stats.progressPercent.toFixed(0)}%
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Navigation Header */}
      <View style={styles.header}>
        <View style={styles.weekNavigation}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={
              viewMode === "weekly" ? goToPreviousWeek : goToPreviousMonth
            }
          >
            <Ionicons name="chevron-back" size={18} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={viewMode === "weekly" ? goToCurrentWeek : goToCurrentMonth}
          >
            <Text className="text-md font-PoppinsMedium text-black">
              {viewMode === "weekly" ? weekDateRange : monthDateRange}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={viewMode === "weekly" ? goToNextWeek : goToNextMonth}
          >
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Animated Chart Container */}
      <Animated.View style={{ opacity: fadeAnim }}>
        {viewMode === "weekly" ? (
          chartData.length > 0 ? (
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
              spacing={20}
              maxValue={maxValue}
              width={Math.max(260, Math.min(600, windowWidth - 40))}
              height={200}
              initialSpacing={10}
              endSpacing={14}
              {...(targetWeight && {
                referenceLine1Config: {
                  color: Color.blue[400],
                  dashWidth: 4,
                  dashGap: 4,
                  labelText: `Target: ${targetWeight}kg`,
                  labelTextStyle: {
                    color: Color.blue[600],
                    fontSize: 11,
                  },
                },
                referenceLine1Position: targetWeight,
              })}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="bar-chart-outline"
                size={48}
                color={Color.gray[300]}
              />
              <Text style={styles.emptyStateText}>No data for this week</Text>
            </View>
          )
        ) : monthlyChartData.length > 0 ? (
          <LineChart
            data={monthlyChartData}
            curved
            thickness={3}
            color={Color.blue[500]}
            noOfSections={5}
            yAxisThickness={0}
            xAxisThickness={0}
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
            spacing={Math.max(
              40,
              (windowWidth - 100) / Math.max(monthlyChartData.length, 1)
            )}
            maxValue={maxValue}
            width={Math.max(260, Math.min(600, windowWidth - 40))}
            height={200}
            initialSpacing={20}
            endSpacing={20}
            dataPointsColor={Color.blue[600]}
            dataPointsRadius={5}
            textShiftY={-8}
            textShiftX={-5}
            textFontSize={11}
            textColor={Color.gray[600]}
            hideDataPoints={false}
            areaChart
            startFillColor={Color.blue[100]}
            endFillColor={Color.blue[50]}
            startOpacity={0.4}
            endOpacity={0.1}
            {...(targetWeight && {
              referenceLine1Config: {
                color: Color.blue[400],
                dashWidth: 4,
                dashGap: 4,
                labelText: `Target: ${targetWeight}kg`,
                labelTextStyle: {
                  color: Color.blue[600],
                  fontSize: 11,
                },
              },
              referenceLine1Position: targetWeight,
            })}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="trending-up-outline"
              size={48}
              color={Color.gray[300]}
            />
            <Text style={styles.emptyStateText}>No data for this month</Text>
          </View>
        )}
      </Animated.View>
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
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: Color.gray[100],
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    alignSelf: "center",
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Color.gray[600],
  },
  toggleTextActive: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Color.gray[900],
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Color.gray[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Color.gray[200],
  },
  statLabel: {
    fontSize: 12,
    color: Color.gray[500],
    marginBottom: 4,
    fontWeight: "500" as const,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Color.gray[900],
  },
  statChangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statValueUp: {
    color: Color.red[500],
  },
  statValueDown: {
    color: Color.green[500],
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
  emptyState: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: Color.gray[400],
    fontWeight: "500" as const,
  },
});
