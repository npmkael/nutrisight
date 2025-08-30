import BackHeader from "@/components/BackHeader";
import Loading from "@/components/Loading";
import PredictionCard from "@/components/PredictionCard";
import { BACKEND_URL } from "@/context/AuthContext";
import { replaceUnderscoreWithSpace } from "@/utils/helpers";
import { useLocalSearchParams, useRouter } from "expo-router";
import { memo, useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PredictionType } from "./main-camera";

function Predictions() {
  const { predictions, image, userAllergens } = useLocalSearchParams();
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

        router.push({
          pathname: "/results",
          params: {
            name,
            image,
            userAllergens: userAllergens,
            scanResult: JSON.stringify(data.data),
          },
        });
      } catch (error) {
        console.log("Error fetching food data:", error);
        alert("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [router, image, userAllergens]
  );

  if (loading) {
    return <Loading />;
  }

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
          source={{ uri: image as string }}
          className="w-[320px] rounded-tl-2xl rounded-tr-2xl object-cover shadow-xl"
          style={{ height: 318 }}
        />
      </View>

      <View className="px-4 py-4">
        <Text style={styles.title}>Top Predictions</Text>
        <Text style={styles.subtitle}>Analysis results for your photo</Text>
      </View>

      <ScrollView
        className="p-4 rounded-t-3xl bg-white"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {parsedPredictions.length > 0 ? (
          parsedPredictions.map((prediction) => (
            <PredictionCard
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
