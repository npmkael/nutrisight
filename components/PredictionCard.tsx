import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type PredictionCardProps = {
  predictionLabel: string;
  predictionValue: number;
};

export default function PredictionCard({
  predictionLabel,
  predictionValue,
}: PredictionCardProps) {
  return (
    <View className="space-y-3 mb-2">
      <TouchableOpacity style={styles.card}>
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text style={styles.predictionLabel}>{predictionLabel}</Text>
            <View style={styles.barContainer}>
              <View
                className="h-full bg-black"
                style={{ width: `${predictionValue}%` }}
              />
            </View>
          </View>
          <View className="ml-4 text-right">
            <Text style={styles.predictionValue}>{predictionValue}%</Text>
            <Text style={styles.predictionConfidence}>confidence</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    flexDirection: "column",
    gap: 10,
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 0.5,
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
