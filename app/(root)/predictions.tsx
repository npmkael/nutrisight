import BackHeader from "@/components/BackHeader";
import PredictionCard from "@/components/PredictionCard";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Predictions() {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-white flex-1">
      <Image
        className="absolute top-0 left-0 right-0"
        source={require("@/assets/images/an-yujin-sample.jpg")}
        style={{ height: 400, width: "100%" }}
        blurRadius={50}
        resizeMode="cover"
      />

      {/* Header */}
      <BackHeader />

      {/* Captured Image */}
      <View className="items-center mt-2">
        <Image
          source={require("@/assets/images/an-yujin-sample.jpg")}
          className="w-[320px] rounded-tl-2xl rounded-tr-2xl object-cover shadow-xl"
          style={{ height: 318 }}
        />
      </View>

      <View className="px-4 py-4">
        <Text style={styles.title}>Top 5 Predictions</Text>
        <Text style={styles.subtitle}>Analysis results for your photo</Text>
      </View>

      <ScrollView
        className="p-4 rounded-t-3xl bg-white"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <PredictionCard predictionLabel="An Yujin" predictionValue={100} />
        <PredictionCard predictionLabel="Yuna" predictionValue={76.5} />
        <PredictionCard predictionLabel="Wonyoung" predictionValue={64.5} />
        <PredictionCard predictionLabel="Karina" predictionValue={48.5} />
        <PredictionCard predictionLabel="Winter" predictionValue={12.5} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: "GeistSemiBold",
    color: "black",
  },
  subtitle: {
    fontSize: 13,
    color: "#737373",
  },
});
