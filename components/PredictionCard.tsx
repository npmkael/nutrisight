import { capitalizeFirstLetter } from "@/utils/helpers";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type PredictionCardProps = {
  predictionLabel: string;
  redirectToResults: (name: string) => void;
};

export default function PredictionCard({
  predictionLabel,
  redirectToResults,
}: PredictionCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 120 }) }],
  }));

  return (
    <Animated.View
      style={[{ marginBottom: 10 }, animatedStyle]}
      entering={FadeIn.duration(700).springify().damping(12)}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => redirectToResults(predictionLabel)}
        onPressIn={() => (scale.value = 0.98)}
        onPressOut={() => (scale.value = 1)}
        style={styles.card}
      >
        <View style={styles.rowNoBadge}>
          <View style={styles.content}>
            <Text style={styles.predictionLabel} numberOfLines={1}>
              {capitalizeFirstLetter(predictionLabel)}
            </Text>
          </View>

          <View style={styles.chevWrap}>
            <Feather name="chevron-right" size={18} color="#9ca3af" />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowNoBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
  },
  predictionLabel: {
    fontSize: 16,
    fontFamily: "GeistSemiBold",
    color: "#111827",
  },
  chevWrap: {
    marginLeft: 8,
  },
});
