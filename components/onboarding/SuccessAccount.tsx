import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function SuccessAccount() {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);

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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-8">
        {/* Success Icon Container */}
        <Animated.View
          style={containerStyle}
          className="w-24 h-24 bg-green-50 rounded-full items-center justify-center mb-8"
        >
          <Animated.View style={checkmarkStyle}>
            <View className="w-16 h-16 bg-green-500 rounded-full items-center justify-center">
              <Ionicons name="checkmark" size={32} color="white" />
            </View>
          </Animated.View>
        </Animated.View>

        {/* Success Text */}
        <Animated.View style={textStyle} className="items-center">
          <Text className="text-3xl font-PoppinsSemiBold text-black text-center mb-4">
            Account Created Successfully!
          </Text>

          <Text className="text-lg font-Poppins text-gray-600 text-center mb-12 leading-6">
            Welcome to NutriSight! Your account has been set up and you're ready
            to start your nutrition journey.
          </Text>
        </Animated.View>
      </View>

      {/* Legal Disclaimer */}
      <Animated.View style={textStyle} className="px-8 pb-8">
        <Text className="text-sm font-Poppins text-gray-500 text-center leading-5">
          by clicking finish, you agree to our{" "}
          <TouchableOpacity onPress={handlePrivacyPolicy}>
            <Text className="text-blue-500 underline font-PoppinsMedium">
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </Text>
        <Text className="text-sm font-Poppins text-gray-500 text-center leading-5 mt-1">
          {"  "}
          <TouchableOpacity onPress={handleTermsConditions}>
            <Text className="text-blue-500 underline font-PoppinsMedium">
              Terms and Conditions
            </Text>
          </TouchableOpacity>
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}
