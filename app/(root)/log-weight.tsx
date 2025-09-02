import TextInputField from "@/components/TextInputField";
import { LoggedWeight, useAuth } from "@/context/AuthContext";
import { useAccountUpdate } from "@/hooks/useAccountUpdate";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function LogWeight() {
  const { updateAccount, isLoading, error, response } = useAccountUpdate();
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [weight, setWeight] = useState(user?.weight?.toString() || "");
  const [weightUnit, setWeightUnit] = useState("kg");

  useEffect(() => {
    if (user) {
      setWeight(user.weight?.toString() || "");
      setWeightUnit("kg");
    }
  }, [user]);

  useEffect(() => {
    if (response) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              loggedWeights: response.data.loggedWeights, // <-- Use the array of objects
              weight: response.data.weight,
              bmi: response.data.bmi,
            }
          : prev
      );
    }
  }, [response]);

  const back = useCallback(() => {
    router.back();
  }, [router]);

  const handleSave = useCallback(async () => {
    let weightKg = parseFloat(weight);
    if (weightUnit === "lbs") {
      weightKg = +(weightKg * 0.453592).toFixed(2); // Convert to kg, round to 2 decimals
    }

    // replace if same month and year
    const currentDate = new Date();
    const currentMonth = currentDate
      .toLocaleString("default", { month: "short" })
      .slice(0, 3);
    const currentYear = currentDate.getFullYear();
    let loggedWeightsPayload: LoggedWeight[] = [];

    if (user?.loggedWeights && user.loggedWeights.length > 0) {
      let found = false;
      loggedWeightsPayload = user.loggedWeights.map((entry) => {
        if (entry.label === currentMonth && entry.year === currentYear) {
          found = true;
          return { ...entry, value: weightKg };
        }
        return entry;
      });
      if (!found) {
        loggedWeightsPayload.push({
          label: currentMonth as LoggedWeight["label"],
          year: currentYear,
          value: weightKg,
        });
      }
    } else {
      // No previous weights, add the first entry
      loggedWeightsPayload = [
        {
          label: currentMonth as LoggedWeight["label"],
          year: currentYear,
          value: weightKg,
        },
      ];
    }

    // calculate bmi
    const feet_x_12 = user?.heightFeet! * 12;
    const initHeight = feet_x_12 + user?.heightInches!;
    const heightMeters = initHeight * 0.0254;
    const heightMetersPowerOf2 = heightMeters ** 2;
    const bmi = weightKg / heightMetersPowerOf2;

    console.log("Logged Weights:", loggedWeightsPayload);

    await updateAccount({
      bmi,
      weight: weightKg,
      loggedWeights: loggedWeightsPayload,
    });
    if (!error) router.back();
  }, [weight, weightUnit, router, updateAccount, setUser, error]);

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
            Log Weight
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-4 pt-8">
          <Text className="text-3xl font-PoppinsSemiBold text-black mb-4">
            Enter your current weight
          </Text>

          <Text className="font-Poppins text-md text-gray-500 mb-6">
            Log your weight for this month to track your progress and receive
            more personalized nutrition recommendations.
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
            disabled={!isValid || isLoading}
            className={`p-4 rounded-lg items-center ${
              isValid ? "bg-black" : "bg-gray-300"
            }`}
          >
            <Text
              className={`text-lg font-PoppinsSemiBold ${
                isValid ? "text-white" : "text-gray-500"
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

export default memo(LogWeight);

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
