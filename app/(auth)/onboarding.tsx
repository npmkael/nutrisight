import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

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
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  // top area fraction (image carousel) and bottom panel fraction
  const TOP_FRACTION = Math.min(0.62, SCREEN_HEIGHT > 800 ? 0.6 : 0.55);
  const IMAGE_MAX_HEIGHT = Math.round(SCREEN_HEIGHT * TOP_FRACTION);

  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<Animated.ScrollView>(null);

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
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top: image carousel area */}
        <View style={[styles.topArea, { height: IMAGE_MAX_HEIGHT }]}>
          <Animated.ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            contentContainerStyle={{ alignItems: "center" }}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setCurrentIndex(index);
            }}
          >
            {onboardingData.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.slide,
                  { width: SCREEN_WIDTH, height: IMAGE_MAX_HEIGHT },
                ]}
              >
                <Image
                  source={item.image}
                  style={[
                    styles.image,
                    {
                      width: SCREEN_WIDTH * 1.25,
                    },
                  ]}
                  resizeMode="contain"
                />
              </View>
            ))}
          </Animated.ScrollView>
        </View>

        {/* Bottom: content panel */}
        <View style={styles.bottomPanel}>
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
                const opacity = interpolate(
                  input,
                  [index - 1, index, index + 1],
                  [0, 1, 0],
                  "clamp"
                );
                return {
                  width,
                  borderWidth: opacity > 0.5 ? 0 : 1,
                  backgroundColor: opacity > 0.5 ? "#2D3644" : "transparent",
                };
              });

              return (
                <Animated.View key={index} style={[styles.dot, dotStyle]} />
              );
            })}
          </View>

          <View
            style={{ marginVertical: 12, flex: 1, justifyContent: "center" }}
          >
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
                <Text style={[styles.buttonText, { color: "black" }]}>
                  Skip
                </Text>
              </TouchableOpacity>
            )}

            <View style={{ width: 12 }} />

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={[styles.buttonText, { color: "white" }]}>
                {currentIndex === onboardingData.length - 1
                  ? "Get Started"
                  : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#2D3644" },
  container: {
    flex: 1,
    backgroundColor: "#2D3644",
  },
  topArea: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 700,
    resizeMode: "contain",
    marginBottom: 12,
  },
  bottomPanel: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 18,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: "center",
    color: "#111827",
    fontFamily: "PoppinsSemiBold",
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    color: "#6B7280",
    fontFamily: "Poppins",
    paddingHorizontal: 8,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    borderColor: "#2D3644",
    borderWidth: 1,
    marginHorizontal: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  skipButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2D3644",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  button: {
    flex: 1,
    backgroundColor: "#2D3644",
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
  },
});
