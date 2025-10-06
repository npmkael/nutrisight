import LoadingScreen from "@/components/loading-screen";
import PredictionCard from "@/components/PredictionCard";
import { BACKEND_URL } from "@/context/AuthContext";
import { replaceUnderscoreWithSpace } from "@/utils/helpers";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { memo, useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PredictionType } from "./main-camera";

function Predictions() {
  const { predictions, image, userAllergens, mealTime } =
    useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const parsedPredictions: PredictionType[] = (
    JSON.parse(predictions as string) as PredictionType[]
  ).map((i) => ({
    label: replaceUnderscoreWithSpace(i.label),
    prob: i.prob,
  }));

  const redirectToResult = useCallback(
    async (name: string) => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/camera/get-food-data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            foodName: name,
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch food data");

        const data = await res.json();

        console.log(`${name} data:`, data);
        console.log("Nutrients:", data.nutrition);
        console.log("Meal Time predictions:", mealTime);

        router.push({
          pathname: "/results",
          params: {
            name,
            image,
            scanResult: JSON.stringify(data.data),
            mealTime,
          },
        });
      } catch (error) {
        console.log("Error fetching food data:", error);
        alert("An error occurred. Please try again.");
      } finally {
        // set delay to show loading screen for at least 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      }
    },
    [router, image, userAllergens]
  );

  if (loading) {
    return <LoadingScreen message="Fetching data..." />;
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      {/* Header */}
      <TouchableOpacity
        className="absolute left-4 right-0 top-4 w-10 h-10 rounded-full bg-black/50 z-10 items-center justify-center"
        onPress={() => router.back()}
      >
        <View className="items-center justify-center">
          <Feather name="chevron-left" size={18} color="white" />
        </View>
      </TouchableOpacity>
      <Image
        className=""
        source={{ uri: image as string }}
        style={{ height: 300, width: "100%" }}
        resizeMode="cover"
      />

      <View className="p-4 bg-white flex-1">
        <View className="px-2 pb-2 mb-2">
          <Text style={styles.title}>Top Predictions</Text>
          <Text style={styles.subtitle}>Analysis results for your photo</Text>
        </View>

        <ScrollView
          className="flex-1"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {parsedPredictions.length > 0 ? (
            parsedPredictions.map((prediction, index) => (
              <PredictionCard
                index={index}
                key={prediction.label}
                predictionLabel={prediction.label}
                predictionValue={Number((prediction.prob * 100).toFixed(2))}
                redirectToResults={redirectToResult}
              />
            ))
          ) : (
            <Text>No predictions available</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default memo(Predictions);

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
