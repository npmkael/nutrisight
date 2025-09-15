import { Color } from "@/constants/TWPalette";
import { LoggedWeight } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";

enum Period {
  week = "week",
  month = "month",
  year = "year",
}

export default function TargetWeightChart({
  loggedWeights,
}: {
  loggedWeights: LoggedWeight[];
}) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartPeriod, setChartPeriod] = useState<Period>(Period.week);
  const [currentData, setCurrentDate] = useState<Date | null>(null);
  const [currentEndDate, setCurrentEndDate] = useState<Date | null>(null);
  const [weekDateRange, setWeekDateRange] = useState<string>("");
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);

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

    // Create an entry for each day of the week (Sun..Sat) so empty days stay visible
    const weekDays = Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(startDateObj);
      day.setDate(startDateObj.getDate() + i);
      // use localDateKey for comparison to avoid UTC offset issues
      const dayKey = localDateKey(day); // local YYYY-MM-DD
      const found = normalized.find((w) => localDateKey(w.dateObj) === dayKey);
      return {
        date: day.toISOString(),
        // if no value, use 0 so bar exists (option: use null to hide bar but keep label)
        value: found ? found.value : 0,
        label: day.toLocaleDateString("en-US", { weekday: "short" }),
      };
    });

    // If all days are empty, render empty chart state
    const hasAnyValue = weekDays.some((d) => d.value > 0);
    if (!hasAnyValue) {
      setChartData(
        weekDays.map((item) => ({
          value: 0,
          label: item.label,
          frontColor: "#E6E9EE",
          spacing: 2,
          topLabelComponent: () => <Text style={styles.topLabel}></Text>,
        }))
      );
      setMaxValue(1);
      setWeekDateRange(formatRange(startDateObj, endDateObj));
      return;
    }

    // Build chart data from weekDays (you can replace 0 fallback with last-known value if desired)
    const formattedData = weekDays.map((item) => ({
      value: item.value,
      label: item.label,
      frontColor: item.value > 0 ? "#2D3644" : "#E6E9EE",
      spacing: 2,
      topLabelComponent: () =>
        item.value > 0 ? (
          <Text style={styles.topLabel}>{Number(item.value).toFixed(1)}</Text>
        ) : (
          <Text style={styles.topLabel}></Text>
        ),
    }));

    setChartData(formattedData);

    // compute a sensible max/min for the Y axis (based on real values only)
    const values = weekDays.map((d) => d.value).filter((v) => v > 0);
    const max = values.length ? Math.max(...values) : 0;
    setMaxValue(max > 0 ? max * 1.1 : 1);

    setWeekDateRange(formatRange(startDateObj, endDateObj));
  }, [currentWeekOffset, loggedWeights, chartPeriod]);

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

  return (
    <>
      <View style={styles.header}>
        <View style={styles.weekNavigation}>
          <TouchableOpacity style={styles.navButton} onPress={goToPreviousWeek}>
            <Ionicons name="chevron-back" size={18} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity onPress={goToCurrentWeek}>
            <Text className="text-md font-PoppinsMedium text-black">
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
        spacing={20}
        maxValue={maxValue}
        width={Math.max(260, Math.min(600, windowWidth - 40))}
        height={200}
        initialSpacing={10}
        endSpacing={14}
      />

      {/* <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#2D3644" }]} />
          <Text className="text-sm font-Poppins text-foreground">
            Weight Gained
          </Text>
        </View>
      </View> */}
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
