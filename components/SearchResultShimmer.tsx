import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

function ShimmerItem() {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">
      {/* Header with icon */}
      <View className="flex-row items-start mb-3">
        <Animated.View
          style={animatedStyle}
          className="bg-gray-200 h-10 w-10 rounded-xl mr-3"
        />
        <View className="flex-1">
          <Animated.View
            style={animatedStyle}
            className="bg-gray-200 h-5 w-4/5 rounded-lg mb-2"
          />
          <Animated.View
            style={animatedStyle}
            className="bg-gray-200 h-4 w-2/3 rounded-lg"
          />
        </View>
      </View>

      {/* Macros row */}
      <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
        <Animated.View
          style={animatedStyle}
          className="bg-gray-200 h-4 w-12 rounded-lg"
        />
        <Animated.View
          style={animatedStyle}
          className="bg-gray-200 h-4 w-12 rounded-lg"
        />
        <Animated.View
          style={animatedStyle}
          className="bg-gray-200 h-4 w-12 rounded-lg"
        />
        <Animated.View
          style={animatedStyle}
          className="bg-gray-200 h-4 w-4 rounded-full"
        />
      </View>
    </View>
  );
}

export function SearchResultShimmer({ count = 5 }: { count?: number }) {
  return (
    <View className="px-6">
      {Array.from({ length: count }).map((_, index) => (
        <ShimmerItem key={index} />
      ))}
    </View>
  );
}
