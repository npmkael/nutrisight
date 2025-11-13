import CircularProgressBar from "@/components/CircularProgressBar";
import TextInputField from "@/components/TextInputField";
import { useAuth } from "@/context/AuthContext";
import { useAccountUpdate } from "@/hooks/useAccountUpdate";
import { getProgress } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

function EditProtein() {
  const { user, setUser } = useAuth();
  const { updateAccount, isLoading, error, response } = useAccountUpdate();
  const [protein, setProtein] = useState(
    user?.dailyRecommendation?.protein.toString() || "120"
  );
  const [progress, setProgress] = useState(
    getProgress(
      parseInt(protein) * 4,
      user?.dailyRecommendation?.calories || 1500
    )
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

      const calories25PercentUpper = 0.25 * (targetCalories + 300);
      const calories25PercentLower = 0.25 * (targetCalories - 300);

      const targetProteinUpper = calories25PercentUpper / 4;
      const targetProteinLower = calories25PercentLower / 4;
      setRec({
        upper: Math.round(targetProteinUpper),
        lower: Math.round(targetProteinLower),
      });
    }
  }, [user]);

  useEffect(() => {
    if (response) {
      setUser(response.data);
    }
  }, [response]);

  const handleProteinChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue) {
      setProtein(numericValue);
      setProgress(
        getProgress(
          parseInt(numericValue) * 4,
          user?.dailyRecommendation?.calories || 1500
        )
      );
    } else {
      setProtein("");
    }
  };

  const handleSave = async () => {
    const proteinValue = parseInt(protein);
    if (!protein.trim() || isNaN(proteinValue) || proteinValue <= 0) {
      alert("Please enter a valid protein value");
      return;
    }
    // Save the protein value
    const payload: any = {
      dailyRecommendation: {
        calories: user?.dailyRecommendation?.calories || 0,
        protein: proteinValue,
        carbs: user?.dailyRecommendation?.carbs || 0,
        fat: user?.dailyRecommendation?.fat || 0,
      },
    };
    await updateAccount(payload);
    if (!error) {
      alert("Protein updated successfully!");
      router.back();
    }
    router.replace("/(root)/(tabs)/settings");
  };

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
          Edit Protein
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
              color="#EF4444"
              backgroundColor="rgba(0,0,0,0.1)"
              showPercentage={false}
            />
            <View className="absolute inset-0 flex-1 justify-center items-center gap-2">
              <Text className="text-4xl font-PoppinsBold text-gray-900 mb-1">
                {protein}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Input Section */}
        <View className="mb-8">
          <Text className="text-foreground text-sm  font-Poppins mb-2">
            Protein
          </Text>
          <View className="flex-row items-center">
            <TextInputField
              value={protein}
              onChangeText={handleProteinChange}
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
            grams of protein per day for optimal muscle maintenance and
            recovery.
          </Text>
        </Animated.View>
      </View>

      {/* Save Button */}
      <View className="px-4 py-4 border-t bg-white border-border">
        <TouchableOpacity
          onPress={handleSave}
          disabled={
            !protein.trim() ||
            parseInt(protein) <= 0 ||
            isNaN(parseInt(protein))
          }
          className={`py-4 px-6 rounded-2xl items-center ${!protein.trim() || parseInt(protein) <= 0 || isNaN(parseInt(protein)) ? "bg-gray-300" : "bg-primary"}`}
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

export default memo(EditProtein);
