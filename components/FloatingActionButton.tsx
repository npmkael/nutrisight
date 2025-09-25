import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const FloatingActionButton = () => {
  const router = useRouter();
  const firstValue = useSharedValue(30);
  const firstWidth = useSharedValue(50);
  const secondValue = useSharedValue(30);
  const secondWidth = useSharedValue(50);
  const isOpen = useSharedValue(false);
  const opacity = useSharedValue(0);
  const progress = useDerivedValue(() =>
    isOpen.value ? withTiming(1) : withTiming(0)
  );

  const handlePress = () => {
    const config = {
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      duration: 500,
    };

    if (isOpen.value) {
      firstWidth.value = withTiming(50, { duration: 100 }, (finish) => {
        if (finish) {
          firstValue.value = withTiming(30, config);
        }
      });
      secondWidth.value = withTiming(50, { duration: 100 }, (finish) => {
        if (finish) {
          secondValue.value = withDelay(50, withTiming(30, config));
        }
      });
      opacity.value = withTiming(0, { duration: 100 });
    } else {
      firstValue.value = withDelay(200, withSpring(90));
      firstWidth.value = withDelay(1200, withSpring(100));
      opacity.value = withDelay(1200, withSpring(1));
      secondValue.value = withDelay(250, withSpring(160));
      secondWidth.value = withDelay(1100, withSpring(130));
    }

    isOpen.value = !isOpen.value;
  };

  const handleAddFoodPress = () => {
    router.push("/(root)/manual-food-entry");
    handlePress(); // Close the FAB
    console.log("Add Food Pressed");
  };

  const handleScanPress = () => {
    router.push("/(root)/main-camera");
    handlePress(); // Close the FAB
  };

  // first tab
  const firstIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      firstValue.value,
      [30, 90],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      bottom: firstValue.value,
      transform: [{ scale: scale }],
    };
  });
  const firstWidthStyle = useAnimatedStyle(() => {
    return {
      width: firstWidth.value,
    };
  });

  const opacityText = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const secondIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      secondValue.value,
      [30, 160],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      bottom: secondValue.value,
      transform: [{ scale: scale }],
    };
  });
  const secondWidthStyle = useAnimatedStyle(() => {
    return {
      width: secondWidth.value,
    };
  });

  const plusIcon = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 45}deg` }],
    };
  });

  return (
    <>
      <TouchableOpacity onPressIn={handleAddFoodPress}>
        <Animated.View
          style={[styles.contentContainer, secondIcon, secondWidthStyle]}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="food-apple" size={26} color="white" />
          </View>
          <Animated.Text style={[styles.text, opacityText]}>
            Add Food
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity onPressIn={handleScanPress}>
        <Animated.View
          style={[styles.contentContainer, firstIcon, firstWidthStyle]}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="camera" size={26} color="white" />
          </View>
          <Animated.Text style={[styles.text, opacityText]}>Scan</Animated.Text>
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.contentContainer}
        onPress={() => handlePress()}
      >
        <Animated.View style={[styles.iconContainer, plusIcon]}>
          <Ionicons name="add" size={26} color="white" />
        </Animated.View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#2D3644",
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 26,
    height: 26,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontFamily: "GeistRegular",
  },
});

export default FloatingActionButton;
