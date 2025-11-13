import TextInputField from "@/components/TextInputField";
import { useAuth } from "@/context/AuthContext";
import { useAccountUpdate } from "@/hooks/useAccountUpdate";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function HeightEdit() {
  const { updateAccount, isLoading, error, response } = useAccountUpdate();
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightUnit, setHeightUnit] = useState("ft/in");

  useEffect(() => {
    if (user) {
      setHeightFeet(user.heightFeet?.toLocaleString() ?? "");
      setHeightInches(user.heightInches?.toLocaleString() ?? "");
    }
  }, [user]);

  useEffect(() => {
    if (response) {
      setUser((prev) =>
        prev ? { ...prev, height: response.data.height } : prev
      );
    }
  }, [response]);

  const back = useCallback(() => {
    router.back();
  }, [router]);

  const handleSave = useCallback(async () => {
    if (heightUnit === "ft/in") {
      const feet = parseInt(heightFeet) || 0;
      const inches = parseInt(heightInches) || 0;
      await updateAccount({ heightFeet: feet, heightInches: inches });
    } else {
      // cm to feet: 1 cm = 0.0328084 ft
      const feetValue = +(parseFloat(heightCm) * 0.0328084).toFixed(2);
      const feet = Math.floor(feetValue);
      const inches = Math.round((feetValue - feet) * 12);
      await updateAccount({ heightFeet: feet, heightInches: inches });
    }
    if (!error) router.back();
  }, [
    heightFeet,
    heightInches,
    heightCm,
    heightUnit,
    router,
    updateAccount,
    error,
  ]);

  const toggleHeightUnit = useCallback(() => {
    setHeightUnit(heightUnit === "ft/in" ? "cm" : "ft/in");
  }, [heightUnit]);

  const isValid = useCallback(() => {
    if (heightUnit === "cm") {
      const cmValue = parseFloat(heightCm);
      return heightCm.trim().length > 0 && !isNaN(cmValue) && cmValue > 0;
    }
    const feetValue = parseInt(heightFeet);
    return heightFeet.trim().length > 0 && !isNaN(feetValue) && feetValue > 0;
  }, [heightFeet, heightInches, heightCm, heightUnit]);

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
                    onChangeText={(text) =>
                      setHeightFeet(text.replace(/[^0-9]/g, ""))
                    }
                    maxLength={1}
                    keyboardType="numeric"
                  />
                  <TextInputField
                    value={heightInches}
                    onChangeText={(text) =>
                      setHeightInches(text.replace(/[^0-9]/g, ""))
                    }
                    maxLength={2}
                    keyboardType="numeric"
                  />
                </>
              ) : (
                <TextInputField
                  value={heightCm}
                  onChangeText={(text) =>
                    setHeightCm(text.replace(/[^0-9]/g, ""))
                  }
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
            disabled={!isValid() || isLoading}
            className={`p-4 rounded-lg items-center ${
              isValid() ? "bg-black" : "bg-gray-300"
            }`}
          >
            <Text
              className={`text-lg font-PoppinsSemiBold ${
                isValid() ? "text-white" : "text-gray-500"
              }`}
            >
              {isLoading ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
          {error && (
            <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
          )}
          {response?.message && (
            <Text style={{ color: "green", textAlign: "center" }}>
              {response.message}
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default memo(HeightEdit);

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
