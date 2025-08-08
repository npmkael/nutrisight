import TextInputField from "@/components/TextInputField";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HeightEdit() {
  const { user } = useAuth();
  const router = useRouter();
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [heightCm, setHeightCm] = useState(user?.height?.toString() || "");
  const [heightUnit, setHeightUnit] = useState("cm");

  const back = () => {
    router.back();
  };

  const handleSave = () => {
    // Here you would save the height to the backend
    const height =
      heightUnit === "cm" ? heightCm : `${heightFeet}'${heightInches}"`;
    console.log("Saving height:", height);
    router.back();
  };

  const toggleHeightUnit = () => {
    setHeightUnit(heightUnit === "ft/in" ? "cm" : "ft/in");
  };

  const isValid = () => {
    if (heightUnit === "cm") {
      return heightCm.trim().length > 0 && parseFloat(heightCm) > 0;
    }
    return heightFeet.trim().length > 0 && parseInt(heightFeet) > 0;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={back}>
            <Ionicons name="arrow-back" size={18} color="black" />
          </TouchableOpacity>
          <Text
            style={styles.titleText}
            className="font-PoppinsSemiBold text-2xl"
          >
            Edit Height
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-4 pt-8">
          <Text className="text-3xl font-PoppinsSemiBold text-black mb-4">
            Update your height
          </Text>

          <Text className="font-Poppins text-md text-gray-500 mb-6">
            Enter your current height to help us calculate accurate nutrition
            goals.
          </Text>

          <View className="mb-6">
            <Text className="font-Poppins text-md text-gray-500 mb-2">
              How tall are you?
            </Text>
            <View className="flex-row items-center gap-2">
              {heightUnit === "ft/in" ? (
                <>
                  <TextInputField
                    value={heightFeet}
                    onChangeText={setHeightFeet}
                    maxLength={1}
                    keyboardType="numeric"
                  />
                  <TextInputField
                    value={heightInches}
                    onChangeText={setHeightInches}
                    maxLength={2}
                    keyboardType="numeric"
                  />
                </>
              ) : (
                <TextInputField
                  value={heightCm}
                  onChangeText={setHeightCm}
                  maxLength={3}
                  keyboardType="numeric"
                />
              )}
              <TouchableOpacity
                className="bg-black rounded-lg px-6 py-4 justify-center items-center min-w-[75px]"
                onPress={toggleHeightUnit}
              >
                <Text className="font-PoppinsMedium text-white">
                  {heightUnit}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View className="p-4">
          <TouchableOpacity
            onPress={handleSave}
            disabled={!isValid()}
            className={`p-4 rounded-lg items-center ${
              isValid() ? "bg-black" : "bg-gray-300"
            }`}
          >
            <Text
              className={`text-lg font-PoppinsSemiBold ${
                isValid() ? "text-white" : "text-gray-500"
              }`}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    position: "relative",
  },
  backButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#EAEAEA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  titleText: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
});
