import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const setupItems = [
  { id: 1, name: "Calories", completed: false },
  { id: 2, name: "Carbs", completed: false },
  { id: 3, name: "Protein", completed: false },
  { id: 4, name: "Fats", completed: false },
  { id: 5, name: "Health score", completed: false },
];

function LoadingScreen() {
  console.log("LoadingScreen rendered");
  const [percentage, setPercentage] = useState(0);
  const [completedItems, setCompletedItems] = useState<number[]>([]);

  const progressWidth = useSharedValue(0);
  const percentageOpacity = useSharedValue(0);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate entrance
    percentageOpacity.value = withTiming(1, { duration: 500 });
    cardOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));

    // Simulate loading progress
    const interval = setInterval(() => {
      setPercentage((prev) => {
        const newPercentage = Math.min(prev + Math.random() * 8 + 2, 100);

        // Complete items based on percentage
        const itemsToComplete = Math.floor(
          (newPercentage / 100) * setupItems.length
        );
        const newCompletedItems: number[] = [];
        for (let i = 1; i <= itemsToComplete; i++) {
          newCompletedItems.push(i);
        }
        setCompletedItems(newCompletedItems);

        return newPercentage;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    progressWidth.value = withTiming((percentage / 100) * (width - 64), {
      duration: 300,
    });
  }, [percentage]);

  const progressStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
  }));

  const percentageStyle = useAnimatedStyle(() => ({
    opacity: percentageOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Main content */}
      <View style={styles.centerContent}>
        {/* Large percentage display */}
        <Animated.View style={[styles.percentageContainer, percentageStyle]}>
          <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
        </Animated.View>

        {/* Main message */}
        <Animated.View entering={FadeIn.delay(200).duration(600)}>
          <Text style={styles.mainMessage}>
            We're setting everything up for you
          </Text>
        </Animated.View>

        {/* Progress bar */}
        <Animated.View
          entering={FadeIn.delay(400).duration(600)}
          style={styles.progressBarContainer}
        >
          <View style={styles.progressBarBackground}>
            <Animated.View style={[styles.progressBarFill, progressStyle]}>
              <LinearGradient
                colors={["#EF4444", "#3B82F6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              />
            </Animated.View>
          </View>
        </Animated.View>

        {/* Status message */}
        <Animated.View entering={FadeIn.delay(600).duration(600)}>
          <Text style={styles.statusMessage}>Applying BMR formula…</Text>
        </Animated.View>
      </View>

      {/* Setup items card */}
      <Animated.View style={[styles.setupCard, cardStyle]}>
        <View style={styles.cardContent}>
          {setupItems.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeIn.delay(800 + index * 100).duration(400)}
              style={styles.setupItem}
            >
              <Text style={styles.setupItemText}>{item.name}</Text>
              <View style={styles.checkmarkContainer}>
                {completedItems.includes(item.id) ? (
                  <Animated.View
                    entering={FadeIn.duration(200)}
                    style={styles.checkmarkCircle}
                  >
                    <Ionicons name="checkmark" size={16} color="white" />
                  </Animated.View>
                ) : (
                  <View style={styles.emptyCheckmark} />
                )}
              </View>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

export default memo(LoadingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingTop: 120,
    paddingBottom: 60,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  percentageContainer: {
    marginBottom: 24,
  },
  percentageText: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    fontFamily: "Poppins",
  },
  mainMessage: {
    fontSize: 20,
    color: "#374151",
    textAlign: "center",
    marginBottom: 40,
    fontFamily: "GeistSemiBold",
    lineHeight: 28,
  },
  progressBarContainer: {
    width: "100%",
    marginBottom: 24,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 8,
  },
  gradient: {
    flex: 1,
    borderRadius: 8,
  },
  statusMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    fontFamily: "Poppins",
  },
  setupCard: {
    backgroundColor: "#1F2937",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    padding: 24,
  },
  setupItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  setupItemText: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Poppins",
    fontWeight: "500",
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkCircle: {
    width: 20,
    height: 20,
    backgroundColor: "#10B981",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCheckmark: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#4B5563",
    borderRadius: 10,
  },
});
