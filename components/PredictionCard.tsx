import { capitalizeFirstLetter } from "@/utils/helpers";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

type PredictionCardProps = {
  predictionLabel: string;
  predictionValue: number;
  redirectToResults: (name: string) => void;
  index: number;
};

export default function PredictionCard({
  predictionLabel,
  predictionValue,
  redirectToResults,
  index,
}: PredictionCardProps) {
  return (
    <Animated.View
      className="space-y-3 mb-2"
      entering={FadeIn.duration(1000)
        .delay(index * 200)
        .springify()
        .damping(12)}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => redirectToResults(predictionLabel)}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text style={styles.predictionLabel}>
              {capitalizeFirstLetter(predictionLabel)}
            </Text>
            <View style={styles.barContainer}>
              <View
                className="h-full bg-black"
                style={{ width: `${predictionValue}%` }}
              />
            </View>
          </View>
          <View className="ml-4 items-center">
            <Text style={styles.predictionValue}>{predictionValue}%</Text>
            <Text style={styles.predictionConfidence}>confidence</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    flexDirection: "column",
    gap: 10,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e1e1e1",
  },
  predictionLabel: {
    fontSize: 16,
    fontFamily: "GeistSemiBold",
    color: "black",
  },
  barContainer: {
    marginTop: 4,
    backgroundColor: "#e1e1e1",
    borderRadius: 100,
    height: 8,
    overflow: "hidden",
  },
  // Dynamic width (!)
  predictionValue: {
    fontSize: 24,
    fontFamily: "GeistBold",
    color: "black",
  },
  predictionConfidence: {
    fontSize: 12,
    fontFamily: "GeistRegular",
    color: "#737373",
  },
});
