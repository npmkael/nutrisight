import CircularProgressBar from "@/components/CircularProgressBar";
import TextInputField from "@/components/TextInputField";
import { useAuth } from "@/context/AuthContext";
import { useAccountUpdate } from "@/hooks/useAccountUpdate";
import { getProgress } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { memo, useCallback, useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

function EditFats() {
  const { user, setUser } = useAuth();
  const { updateAccount, isLoading, error, response } = useAccountUpdate();
  const [fats, setFats] = useState(
    user?.dailyRecommendation?.fat.toString() || "70"
  );
  const [progress, setProgress] = useState(
    getProgress(parseInt(fats) * 9, user?.dailyRecommendation?.calories || 1500)
  ); // Based on some target calculation
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

      const calories15PercentUpper = 0.15 * (targetCalories + 300);
      const calories15PercentLower = 0.15 * (targetCalories - 300);

      const targetFatsUpper = calories15PercentUpper / 9;
      const targetFatsLower = calories15PercentLower / 9;
      setRec({
        upper: Math.round(targetFatsUpper),
        lower: Math.round(targetFatsLower),
      });
    }
  }, [user]);

  useEffect(() => {
    if (response) {
      setUser(response.data);
    }
  }, [response]);

  const handleIncrement = useCallback(() => {
    const newValue = parseInt(fats) + 10;
    setFats(newValue.toString());
    // Update progress based on recommended range (e.g., 50-100g)
    setProgress(
      getProgress(newValue * 9, user?.dailyRecommendation?.calories || 1500)
    );
  }, [fats]);

  const handleDecrement = useCallback(() => {
    const newValue = Math.max(20, parseInt(fats) - 10);
    setFats(newValue.toString());
    setProgress(
      getProgress(newValue * 9, user?.dailyRecommendation?.calories || 1500)
    );
  }, [fats]);

  const handleFatsChange = useCallback((value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue) {
      setFats(numericValue);
      setProgress(
        getProgress(
          parseInt(numericValue) * 9,
          user?.dailyRecommendation?.calories || 1500
        )
      );
    } else {
      setFats("");
    }
  }, []);

  const handleSave = useCallback(async () => {
    const fatsValue = parseInt(fats);
    if (!fats.trim() || isNaN(fatsValue) || fatsValue <= 0) {
      alert("Please enter a valid fats value");
      return;
    }
    // Save the fats value
    const payload: any = {
      dailyRecommendation: {
        calories: user?.dailyRecommendation?.calories || 0,
        protein: user?.dailyRecommendation?.protein || 0,
        carbs: user?.dailyRecommendation?.carbs || 0,
        fat: fatsValue,
      },
    };
    await updateAccount(payload);
    if (!error) {
      alert("Fats updated successfully!");
      router.back();
    }
    router.replace("/(root)/(tabs)/settings");
  }, [fats, updateAccount, setUser, router, error]);

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
          Edit Fats
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
              color="#3B82F6"
              backgroundColor="rgba(0,0,0,0.1)"
              showPercentage={false}
            />
            <View className="absolute inset-0 flex-1 justify-center items-center gap-2">
              <Text className="text-4xl font-PoppinsBold text-gray-900 mb-1">
                {fats}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Input Section */}
        <View className="mb-8">
          <Text className="text-foreground text-sm font-Poppins mb-2">
            Fats
          </Text>
          <View className="flex-row items-center">
            <TextInputField
              value={fats}
              onChangeText={handleFatsChange}
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
            grams of healthy fats per day for optimal hormone production and
            nutrient absorption.
          </Text>
        </Animated.View>
      </View>

      {/* Save Button */}
      <View className="px-4 py-4 border-t bg-white border-border">
        <TouchableOpacity
          onPress={handleSave}
          disabled={
            !fats.trim() || parseInt(fats) <= 0 || isNaN(parseInt(fats))
          }
          className={`py-4 px-6 rounded-2xl items-center ${!fats.trim() || parseInt(fats) <= 0 || isNaN(parseInt(fats)) ? "bg-gray-300" : "bg-primary"}`}
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

export default memo(EditFats);
