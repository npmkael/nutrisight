import CircularProgressBar from "@/components/CircularProgressBar";
import TextInputField from "@/components/TextInputField";
import { useAuth } from "@/context/AuthContext";
import { getProgress } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { memo, useCallback, useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

function EditCarbs() {
  const { user } = useAuth();
  const [carbs, setCarbs] = useState(
    user?.dailyRecommendation?.carbs.toString() || "100"
  );
  const [progress, setProgress] = useState(
    getProgress(
      parseInt(carbs) * 4,
      user?.dailyRecommendation?.calories || 1500
    )
  );
  const [rec, setRec] = useState({
    upper: 0,
    lower: 0,
  });

  useEffect(() => {
    if (user) {
      // Convert height to meters
      const feet_x_12 = user.heightFeet! * 12;
      const initHeight = feet_x_12 + user.heightInches!;
      const heightMeters = initHeight * 0.0254;
      const heightMetersPowerOf2 = heightMeters ** 2;

      const heightInCM = heightMeters * 100;
      const heightInCMLess100 = heightInCM - 100;
      const heightInCMMultipledBy0_1 = 0.1 * heightInCM;
      const desiredWeight = heightInCMLess100 - heightInCMMultipledBy0_1;

      const targetCalories =
        user.activityLevel === "sedentary"
          ? desiredWeight * 30
          : user.activityLevel === "active"
            ? desiredWeight * 35
            : 0;

      const calories60PercentUpper = 0.6 * (targetCalories + 300);
      const calories60PercentLower = 0.6 * (targetCalories - 300);

      const targetCarbsUpper = calories60PercentUpper / 4;
      const targetCarbsLower = calories60PercentLower / 4;
      setRec({
        upper: Math.round(targetCarbsUpper),
        lower: Math.round(targetCarbsLower),
      });
    }
  }, [user]);

  const handleCarbsChange = useCallback((value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue) {
      setCarbs(numericValue);
      setProgress(
        getProgress(
          parseInt(numericValue) * 4,
          user?.dailyRecommendation?.calories || 1500
        )
      );
    } else {
      setCarbs("");
    }
  }, []);

  const handleSave = useCallback(() => {
    // Save the carbs value
    console.log("Saving carbs:", carbs);
    router.back();
  }, [carbs]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(400)}
        className="flex-row items-center justify-between px-6 py-4"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>

        <Text className="text-xl font-PoppinsSemiBold text-gray-900">
          Edit Carbs
        </Text>

        <View className="w-10 h-10" />
      </Animated.View>

      {/* Main Content */}
      <View className="flex-1 px-6 pt-8">
        {/* Circular Progress Ring */}
        <Animated.View
          entering={FadeIn.duration(600).delay(200)}
          className="items-center mb-12"
        >
          <View className="relative">
            <CircularProgressBar
              progress={progress}
              size={200}
              strokeWidth={12}
              color="#F97316"
              backgroundColor="rgba(0,0,0,0.1)"
              showPercentage={false}
            />
            <View className="absolute inset-0 flex-1 justify-center items-center gap-2">
              <Text className="text-4xl font-PoppinsBold text-gray-900 mb-1">
                {carbs}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Input Section */}
        <View className="mb-8">
          <Text className="text-foreground text-sm font-Poppins mb-2">
            Carbohydrates
          </Text>
          <View className="flex-row items-center">
            <TextInputField
              value={carbs}
              onChangeText={handleCarbsChange}
              placeholderText="grams"
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
        </View>

        {/* Additional Info */}
        <Animated.View
          entering={FadeIn.duration(600).delay(600)}
          className="bg-blue-50 p-4 rounded-2xl mb-8"
        >
          <View className="flex-row items-center mb-2">
            <Ionicons name="information-circle" size={20} color="#3B82F6" />
            <Text className="text-sm font-PoppinsSemiBold text-blue-900 ml-2">
              Recommendation
            </Text>
          </View>
          <Text className="text-sm font-Poppins text-blue-800 leading-5">
            Based on your profile, we recommend {`${rec.lower} - ${rec.upper}`}{" "}
            grams of carbohydrates per day for optimal energy and performance.
          </Text>
        </Animated.View>
      </View>

      {/* Save Button */}
      <View className="px-4 py-4 border-t bg-white border-border">
        <TouchableOpacity
          onPress={handleSave}
          className="bg-primary py-4 px-6 rounded-2xl items-center"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Text className="text-white text-lg font-PoppinsSemiBold">
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default memo(EditCarbs);
