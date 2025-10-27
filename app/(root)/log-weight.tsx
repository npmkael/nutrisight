import TextInputField from "@/components/TextInputField";
import { useAuth } from "@/context/AuthContext";
import { useAccountUpdate } from "@/hooks/useAccountUpdate";
import { colors } from "@/lib/utils";
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
              loggedWeights: response.data.loggedWeights,
              weight: response.data.weight,
              bmi: response.data.bmi,
              dailyRecommendation: response.data.dailyRecommendation,
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

    // replace if same day, month and year
    // Save weight with exact date (YYYY-MM-DD)
    const currentDate = new Date();
    const currentDateISO = currentDate.toISOString().slice(0, 10); // YYYY-MM-DD

    // Start from existing loggedWeights (if any), remove any entry for today, then append today's entry
    const existing = Array.isArray(user?.loggedWeights)
      ? user!.loggedWeights
      : [];
    const loggedWeightsPayload = existing.filter(
      (entry: any) => entry.date !== currentDateISO
    );
    loggedWeightsPayload.push({
      date: currentDateISO,
      value: weightKg,
    });

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
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={back}>
              <Ionicons name="arrow-back" size={20} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Dietary Goals</Text>
            <View style={styles.headerSpacer} />
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 px-4">
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
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View className="p-4">
          <TouchableOpacity
            onPress={handleSave}
            disabled={!isValid || isLoading}
            className={`p-4 rounded-lg items-center ${
              isValid ? "bg-[#2D3644]" : "bg-gray-300"
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
  headerContainer: {
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: "PoppinsSemiBold",
    color: colors.primary,
    textAlign: "center",
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F4F4",
    zIndex: 1,
  },
  headerSpacer: {
    width: 40,
  },
});
