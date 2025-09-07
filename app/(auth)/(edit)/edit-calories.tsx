import CircularProgressBar from "@/components/CircularProgressBar";
import TextInputField from "@/components/TextInputField";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { memo, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

function EditCalories() {
  const [calories, setCalories] = useState("1918");
  const [progress, setProgress] = useState(75); // Based on some target calculation

  const handleIncrement = () => {
    const newValue = parseInt(calories) + 50;
    setCalories(newValue.toString());
    // Update progress based on recommended range (e.g., 2000-2500)
    setProgress(Math.min(100, (newValue / 2500) * 100));
  };

  const handleDecrement = () => {
    const newValue = Math.max(1000, parseInt(calories) - 50);
    setCalories(newValue.toString());
    setProgress(Math.min(100, (newValue / 2500) * 100));
  };

  const handleCalorieChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue) {
      setCalories(numericValue);
      setProgress(Math.min(100, (parseInt(numericValue) / 2500) * 100));
    } else {
      setCalories("");
    }
  };

  const handleSave = () => {
    // Save the calorie value
    console.log("Saving calories:", calories);
    router.back();
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
          Edit Calories
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
              color="#000000"
              backgroundColor="rgba(0,0,0,0.1)"
              showPercentage={false}
            />
            <View className="absolute inset-0 flex-1 justify-center items-center gap-2">
              <Text className="text-4xl font-PoppinsBold text-gray-900 mb-1">
                {calories}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Input Section */}
        <View className="mb-8">
          <Text className="text-foreground text-sm  font-Poppins mb-2">
            Calories
          </Text>
          <View className="flex-row items-center">
            <TextInputField
              value={calories}
              onChangeText={handleCalorieChange}
              placeholderText="kcal"
              keyboardType="numeric"
              maxLength={4}
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
            Based on your profile, we recommend 1800-2200 calories per day for
            optimal health and your fitness goals.
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

export default memo(EditCalories);
