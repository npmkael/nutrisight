import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const Welcome = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/(auth)/sign-in");
  };

  const handleRegister = () => {
    router.push("/(auth)/sign-up");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Animated.View
        className="flex-1 items-center"
        entering={FadeIn.duration(1000).springify().damping(12)}
      >
        <Image
          source={require("../../assets/images/adaptive-icon.png")}
          className="w-36 h-36"
        />

        <View className="justify-center items-center">
          <Text className="text-3xl font-PoppinsSemiBold mb-2">
            Welcome to NutriSight!
          </Text>
          <Text className="text-gray-400 font-Poppins text-center">
            Let's get started into your account.
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        className="mb-4 mx-4"
        entering={FadeInDown.duration(1000).delay(200).springify().damping(12)}
      >
        <TouchableOpacity style={styles.signUpButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        className="mb-4 mx-4"
        entering={FadeInDown.duration(1000).delay(300).springify().damping(12)}
      >
        <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        className="mb-8 items-center"
        entering={FadeIn.duration(1000).springify().damping(12)}
      >
        <Text style={styles.termsText}>Privacy Policy • Terms of Service</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  signUpButton: {
    backgroundColor: "#2D3644",
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  signInButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2D3644",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
  },
  signInButtonText: {
    color: "#000",
    textAlign: "center",
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
  },
  termsText: {
    color: "#a0a0a0",
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Poppins",
  },
});
