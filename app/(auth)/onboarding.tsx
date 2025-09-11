import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const onboardingData = [
  {
    title: "Set your daily calorie targets",
    description:
      "Log breakfast, lunch, and dinner to stay within your daily calorie goal.",
    image: require("../../assets/images/phone-pic-1.png"),
  },
  {
    title: "Stay on track with your goals",
    description: "Keep track of your current weight, BMI, and goals with ease.",
    image: require("../../assets/images/phone-pic-2.png"),
  },
  {
    title: "Get nutritional facts by scanning",
    description:
      "Instantly scan the food barcode to reveal its nutritional facts.",
    image: require("../../assets/images/phone-pic-3.png"),
  },
];

export default function OnboardingScreen() {
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<Animated.ScrollView>(null);

  // Debug logging
  console.log("OnboardingScreen rendered, currentIndex:", currentIndex);
  console.log("Current onboarding data:", onboardingData[currentIndex]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      scrollRef.current?.scrollTo({
        x: SCREEN_WIDTH * (currentIndex + 1),
        animated: true,
      });
    } else {
      router.replace("/(auth)/welcome");
    }
  };

  const handleSkip = () => {
    router.replace("/(auth)/welcome");
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={25}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / SCREEN_WIDTH
          );
          setCurrentIndex(index);
        }}
      >
        {onboardingData.map((item, index) => (
          <View key={index} style={styles.slide}>
            <Image source={item.image} style={styles.image} />
          </View>
        ))}
      </Animated.ScrollView>

      <View
        style={{
          backgroundColor: "white",
          padding: 30,
          flex: 1,
        }}
      >
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => {
            const dotStyle = useAnimatedStyle(() => {
              const input = scrollX.value / SCREEN_WIDTH;
              const width = interpolate(
                input,
                [index - 1, index, index + 1],
                [8, 24, 8],
                "clamp"
              );
              const borderWidth = interpolate(
                input,
                [index - 1, index, index + 1],
                [1, 0, 1],
                "clamp"
              );
              const opacity = interpolate(
                input,
                [index - 1, index, index + 1],
                [0, 1, 0],
                "clamp"
              );
              return {
                width,
                borderWidth,
                backgroundColor: opacity > 0.5 ? "#2D3644" : "transparent",
              };
            });

            return <Animated.View key={index} style={[styles.dot, dotStyle]} />;
          })}
        </View>

        <View style={{ marginVertical: 20, flex: 1 }}>
          <Text style={styles.title}>
            {onboardingData[currentIndex]?.title || "Title not found"}
          </Text>
          <Text style={styles.description}>
            {onboardingData[currentIndex]?.description ||
              "Description not found"}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {currentIndex < onboardingData.length - 1 && (
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: "black",
                  },
                ]}
              >
                Skip
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text
              style={[
                styles.buttonText,
                {
                  color: "white",
                },
              ]}
            >
              {currentIndex === onboardingData.length - 1
                ? "Get Started"
                : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2D3644",
  },
  curveContainer: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  curve: {
    width: SCREEN_WIDTH,
    height: 100,
    backgroundColor: "white",
  },
  curve2: {
    width: SCREEN_WIDTH,
    height: 100,
    backgroundColor: "white",
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 700,
    resizeMode: "cover",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "PoppinsSemiBold",
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    color: "#979797",
    fontFamily: "Poppins",
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    borderColor: "#2D3644",
    borderWidth: 1,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  skipButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2D3644",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  button: {
    flex: 1,
    backgroundColor: "#2D3644",
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
  },
  interRegular: {
    fontFamily: "Inter-Regular",
  },
  spaceMonoRegular: {
    fontFamily: "SpaceMono-Regular",
  },
});
