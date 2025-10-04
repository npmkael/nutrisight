import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Image, Text, useColorScheme, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface LoadingScreenProps {
  message?: string;
  messages?: string[];
  cycleInterval?: number;
}

const DEFAULT_MESSAGES = [
  "Setting up your daily recommendations…",
  "Finalizing your account…",
  "Setting up your dashboard…",
  "Preparing your nutrition insights…",
];

const LoadingScreen = ({
  message,
  messages = DEFAULT_MESSAGES,
  cycleInterval = 3000,
}: LoadingScreenProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // State for cycling messages
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayMessage, setDisplayMessage] = useState(message || messages[0]);

  // Animation values for the three dots
  const dot1Scale = useSharedValue(1);
  const dot2Scale = useSharedValue(1);
  const dot3Scale = useSharedValue(1);

  const dot1Opacity = useSharedValue(0.3);
  const dot2Opacity = useSharedValue(0.3);
  const dot3Opacity = useSharedValue(0.3);

  // Cycle through messages if no static message is provided
  useEffect(() => {
    if (!message && messages.length > 1) {
      const interval = setInterval(() => {
        setCurrentMessageIndex(
          (prevIndex) => (prevIndex + 1) % messages.length
        );
      }, cycleInterval);

      return () => clearInterval(interval);
    }
  }, [message, messages.length, cycleInterval]);

  // Update display message when index changes
  useEffect(() => {
    if (!message) {
      setDisplayMessage(messages[currentMessageIndex]);
    }
  }, [currentMessageIndex, message, messages]);

  useEffect(() => {
    // Create a pulsing animation for each dot with staggered timing
    const animationConfig = {
      duration: 600,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    };

    // Dot 1 - starts immediately
    dot1Scale.value = withRepeat(
      withSequence(
        withTiming(1.3, animationConfig),
        withTiming(1, animationConfig)
      ),
      -1,
      false
    );
    dot1Opacity.value = withRepeat(
      withSequence(
        withTiming(1, animationConfig),
        withTiming(0.3, animationConfig)
      ),
      -1,
      false
    );

    // Dot 2 - delayed by 200ms
    dot2Scale.value = withDelay(
      200,
      withRepeat(
        withSequence(
          withTiming(1.3, animationConfig),
          withTiming(1, animationConfig)
        ),
        -1,
        false
      )
    );
    dot2Opacity.value = withDelay(
      200,
      withRepeat(
        withSequence(
          withTiming(1, animationConfig),
          withTiming(0.3, animationConfig)
        ),
        -1,
        false
      )
    );

    // Dot 3 - delayed by 400ms
    dot3Scale.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(1.3, animationConfig),
          withTiming(1, animationConfig)
        ),
        -1,
        false
      )
    );
    dot3Opacity.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(1, animationConfig),
          withTiming(0.3, animationConfig)
        ),
        -1,
        false
      )
    );
  }, []);

  const dot1Style = useAnimatedStyle(() => ({
    transform: [{ scale: dot1Scale.value }],
    opacity: dot1Opacity.value,
  }));

  const dot2Style = useAnimatedStyle(() => ({
    transform: [{ scale: dot2Scale.value }],
    opacity: dot2Opacity.value,
  }));

  const dot3Style = useAnimatedStyle(() => ({
    transform: [{ scale: dot3Scale.value }],
    opacity: dot3Opacity.value,
  }));

  const bgColors: readonly [string, string, ...string[]] = isDark
    ? ["#1a1f2e", "#2D3644", "#1a1f2e"]
    : ["#ffffff", "#f8fafc", "#ffffff"];

  const textColor = isDark ? "#ffffff" : "#2D3644";
  const dotColor = isDark ? "#ffffff" : "#2D3644";

  return (
    <LinearGradient
      colors={bgColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <View className="flex-1 items-center justify-center px-8">
        {/* App Icon or Logo Area */}
        <View className="mb-12 justify-center items-center">
          {/* Subtle background circle */}
          <View
            className={`absolute w-32 h-32 rounded-full ${
              isDark ? "bg-white/5" : "bg-primary/5"
            }`}
          />

          {/* App Icon */}
          <View className="w-20 h-20 items-center justify-center">
            <Image
              source={require("@/assets/images/full-icon.png")}
              className="w-20 h-20"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Loading Message with Fade Animation */}
        <Animated.Text
          key={displayMessage}
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(500)}
          className="text-xl text-center mb-8 leading-7 px-4"
          style={{ color: textColor, fontFamily: "GeistSemiBold" }}
        >
          {displayMessage}
        </Animated.Text>

        {/* Pulsing Dots Animation */}
        <View className="flex-row items-center justify-center gap-3">
          <Animated.View
            style={[
              dot1Style,
              {
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: dotColor,
              },
            ]}
          />
          <Animated.View
            style={[
              dot2Style,
              {
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: dotColor,
              },
            ]}
          />
          <Animated.View
            style={[
              dot3Style,
              {
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: dotColor,
              },
            ]}
          />
        </View>

        {/* Subtle brand text at bottom */}
        <View className="absolute bottom-12">
          <Text
            className="text-sm font-Poppins text-center opacity-50"
            style={{ color: textColor }}
          >
            NutriSight
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default LoadingScreen;
