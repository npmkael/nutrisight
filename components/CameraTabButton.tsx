import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";

export const CameraTabButton = () => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Camera toggle logic");
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.button}
      activeOpacity={0.85}
    >
      <Ionicons name="camera-outline" size={40} color="#000" />
      <Text>Capture</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: -1,
    left: "50%",
    transform: [{ translateX: -40 }],
    backgroundColor: "#fff",
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "rgba(0, 0, 0, 0.3)",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    width: 75,
    height: 75,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
  },
});
