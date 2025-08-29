import { memo } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

function LoadingScreen() {
  console.log("LoadingScreen rendered");
  return (
    <Animated.View
      entering={FadeIn.duration(600)}
      style={styles.centeredContainer}
    >
      <ActivityIndicator size={"large"} color={"black"} />
      <Text style={styles.loadingText}>Creating your account...</Text>
    </Animated.View>
  );
}

export default memo(LoadingScreen);

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  loadingText: {
    marginTop: 24,
    fontSize: 18,
    fontFamily: "Poppins",
    textAlign: "center",
    color: "#666",
  },
});
