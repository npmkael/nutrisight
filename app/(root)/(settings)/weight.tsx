import TextInputField from "@/components/TextInputField";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo, useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function WeightEdit() {
  const { user } = useAuth();
  const router = useRouter();
  const [weight, setWeight] = useState(user?.weight?.toString() || "");
  const [weightUnit, setWeightUnit] = useState("lbs");

  const back = useCallback(() => {
    router.back();
  }, [router]);

  const handleSave = useCallback(() => {
    // Here you would save the weight to the backend
    console.log("Saving weight:", weight, weightUnit);
    router.back();
  }, [weight, weightUnit, router]);

  const toggleWeightUnit = useCallback(() => {
    setWeightUnit((prev) => (prev === "lbs" ? "kg" : "lbs"));
  }, []);

  const isValid = useMemo(
    () => weight.trim().length > 0 && parseFloat(weight) > 0,
    [weight]
  );

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
            Edit Weight
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-4 pt-8">
          <Text className="text-3xl font-PoppinsSemiBold text-black mb-4">
            Update your weight
          </Text>

          <Text className="font-Poppins text-md text-gray-500 mb-6">
            Enter your current weight to help us provide better nutrition
            recommendations.
          </Text>

          <View className="mb-6">
            <Text className="font-Poppins text-md text-gray-500 mb-2">
              Current Weight
            </Text>
            <View className="flex-row items-center gap-2">
              <TextInputField
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
              <TouchableOpacity
                className="bg-black rounded-lg px-6 py-4 justify-center items-center min-w-[75px]"
                onPress={toggleWeightUnit}
              >
                <Text className="font-PoppinsMedium text-white">
                  {weightUnit}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View className="p-4">
          <TouchableOpacity
            onPress={handleSave}
            disabled={!isValid}
            className={`p-4 rounded-lg items-center ${
              isValid ? "bg-black" : "bg-gray-300"
            }`}
          >
            <Text
              className={`text-lg font-PoppinsSemiBold ${
                isValid ? "text-white" : "text-gray-500"
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

export default memo(WeightEdit);

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
