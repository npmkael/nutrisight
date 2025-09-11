import LoadingScreen from "@/components/loading-screen";
import { NutritionCard } from "@/components/nutrition-card";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalSearchParams, useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// Nutrition card data
const nutritionData = [
  {
    id: "calories",
    label: "Calories",
    value: "1918",
    progress: 75,
    color: "#000000",
    icon: require("@/assets/icons/meat.png"),
  },
  {
    id: "carbs",
    label: "Carbs",
    value: "267g",
    progress: 60,
    color: "#F97316",
    icon: require("@/assets/icons/carbs.png"),
  },
  {
    id: "protein",
    label: "Protein",
    value: "92g",
    progress: 80,
    color: "#EF4444",
    icon: require("@/assets/icons/protein.png"),
  },
  {
    id: "fats",
    label: "Fats",
    value: "53g",
    progress: 45,
    color: "#3B82F6",
    icon: require("@/assets/icons/meat.png"),
  },
];

function SuccessAccount() {
  console.log("Rendering SuccessAccount");
  const { agreement } = useAuth();
  const { onboardingEmail } = useGlobalSearchParams();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    console.log("Loading state changed:", loading);
  }, [loading]);

  useEffect(() => {
    // Animate the main container
    scale.value = withSpring(1, { damping: 15, stiffness: 100 });
    opacity.value = withTiming(1, { duration: 500 });

    // Animate the checkmark with a sequence
    setTimeout(() => {
      checkmarkScale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 100 }),
        withSpring(1, { damping: 15, stiffness: 100 })
      );
    }, 300);

    // Animate the text
    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 600 });
    }, 600);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkmarkScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const handlePrivacyPolicy = () => {
    // Navigate to Privacy Policy
    console.log("Privacy Policy pressed");
  };

  const handleTermsConditions = () => {
    // Navigate to Terms and Conditions
    console.log("Terms and Conditions pressed");
  };

  const handleEditNutrition = (nutritionType: string) => {
    console.log(`Edit ${nutritionType} pressed`);
    // Handle edit functionality here
  };

  const handleAgreement = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Sending agreement for email:", onboardingEmail);
      await agreement(onboardingEmail! as string);
    } catch (error) {
      console.error("Agreement error:", error);
    } finally {
      setLoading(false);
    }
  }, [onboardingEmail]);

  const editRoutes = {
    calories: "/(auth)/(edit)/edit-calories",
    carbs: "/(auth)/(edit)/edit-carbs",
    protein: "/(auth)/(edit)/edit-protein",
    fats: "/(auth)/(edit)/edit-fats",
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* child page renders here */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {loading ? (
          <LoadingScreen />
        ) : (
          <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center px-8 mt-6">
              {/* Success Icon Container */}
              <Animated.View
                style={containerStyle}
                className="w-24 h-24 bg-black/5 rounded-full items-center justify-center mb-8"
              >
                <Animated.View style={checkmarkStyle}>
                  <View className="w-16 h-16 bg-primary rounded-full items-center justify-center">
                    <Ionicons name="checkmark" size={32} color="white" />
                  </View>
                </Animated.View>
              </Animated.View>

              {/* Success Text */}
              <Animated.View style={textStyle} className="items-center">
                <Text className="text-3xl font-PoppinsSemiBold text-black text-center mb-4">
                  Congratulations! You're all set up.
                </Text>

                <Text className="text-md font-Poppins text-foreground text-center mb-8 leading-6">
                  Welcome to NutriSight! Your account has been created and
                  you're ready to start your nutrition journey.
                </Text>
              </Animated.View>
            </View>

            {/* Daily Nutrition Recommendation Section */}
            <Animated.View
              style={textStyle}
              className="bg-[#FAFAFA] px-6 pt-6 pb-6 mx-4 rounded-2xl"
            >
              {/* Header Section */}
              <View className="mb-6">
                <Text className="text-2xl font-PoppinsSemiBold text-gray-900">
                  Daily Recommendation
                </Text>
                <Text className="text-base font-Poppins text-gray-500">
                  You can edit this any time
                </Text>
              </View>

              {/* Nutrition Cards Grid */}
              <View>
                <View className="flex-row justify-between mb-4">
                  <View className="w-[48%]">
                    <NutritionCard
                      label={nutritionData[0].label}
                      value={nutritionData[0].value}
                      progress={nutritionData[0].progress}
                      color={nutritionData[0].color}
                      icon={nutritionData[0].icon}
                      onEdit={() => router.push("/(auth)/(edit)/edit-calories")}
                    />
                  </View>
                  <View className="w-[48%]">
                    <NutritionCard
                      label={nutritionData[1].label}
                      value={nutritionData[1].value}
                      progress={nutritionData[1].progress}
                      color={nutritionData[1].color}
                      icon={nutritionData[1].icon}
                      onEdit={() => router.push("/(auth)/(edit)/edit-carbs")}
                    />
                  </View>
                </View>

                <View className="flex-row justify-between">
                  <View className="w-[48%]">
                    <NutritionCard
                      label={nutritionData[2].label}
                      value={nutritionData[2].value}
                      progress={nutritionData[2].progress}
                      color={nutritionData[2].color}
                      icon={nutritionData[2].icon}
                      onEdit={() => router.push("/(auth)/(edit)/edit-protein")}
                    />
                  </View>
                  <View className="w-[48%]">
                    <NutritionCard
                      label={nutritionData[3].label}
                      value={nutritionData[3].value}
                      progress={nutritionData[3].progress}
                      color={nutritionData[3].color}
                      icon={nutritionData[3].icon}
                      onEdit={() => router.push("/(auth)/(edit)/edit-fats")}
                    />
                  </View>
                </View>
              </View>
            </Animated.View>
          </SafeAreaView>
        )}
      </ScrollView>

      {/* footer */}
      <Animated.View
        entering={FadeIn.duration(600)}
        style={{ padding: 16, borderTopWidth: 1, borderTopColor: "#eee" }}
      >
        <TouchableOpacity
          onPress={handleAgreement}
          style={{
            backgroundColor: "#000",
            padding: 14,
            borderRadius: 12,
            alignItems: "center",
            opacity: loading ? 0.6 : 1,
          }}
          disabled={loading}
        >
          <Text className="text-white text-lg font-PoppinsSemiBold">
            {"Finish"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

export default memo(SuccessAccount);
