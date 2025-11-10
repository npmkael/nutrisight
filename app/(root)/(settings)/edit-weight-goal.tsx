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
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function EditWeightGoal() {
  const { updateAccount, isLoading, error, response } = useAccountUpdate();
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [targetWeight, setTargetWeight] = useState(
    user?.targetWeight?.toString() || ""
  );
  const [weightGoal, setWeightGoal] = useState(user?.weightGoal || "");

  useEffect(() => {
    if (user) {
      setTargetWeight(user.targetWeight?.toString() || "");
      setWeightGoal(user.weightGoal || "");
    }
  }, [user]);

  useEffect(() => {
    if (response) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              targetWeight: response.data.targetWeight,
              weightGoal: response.data.weightGoal,
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
    const targetWeightKg = parseFloat(targetWeight);

    await updateAccount({
      targetWeight: targetWeightKg,
      weightGoal: weightGoal as "lose" | "maintain" | "gain",
    });
    if (!error) router.back();
  }, [targetWeight, weightGoal, router, updateAccount, error]);

  const handleGoalSelect = useCallback(
    (goal: string) => {
      setWeightGoal(goal);
      // Automatically set target weight based on goal
      if (user?.weight) {
        if (goal === "maintain") {
          // Set to current weight for maintain
          setTargetWeight(user.weight.toString());
        } else if (goal === "lose") {
          // Set to 10% less than current weight for lose
          const targetWeightValue = user.weight * 0.9;
          setTargetWeight(Math.round(targetWeightValue).toString());
        } else if (goal === "gain") {
          // Set to 10% more than current weight for gain
          const targetWeightValue = user.weight * 1.1;
          setTargetWeight(Math.round(targetWeightValue).toString());
        }
      }
    },
    [user?.weight]
  );

  const isValid = useMemo(() => {
    const targetWeightNum = parseFloat(targetWeight);
    const currentWeight = user?.weight || 0;

    if (
      !targetWeight.trim() ||
      isNaN(targetWeightNum) ||
      targetWeightNum <= 0
    ) {
      return false;
    }

    if (!weightGoal) {
      return false;
    }

    // Min/max weight validation (20-200 kg)
    if (targetWeightNum < 20 || targetWeightNum > 200) {
      return false;
    }

    // Validate based on selected goal
    if (weightGoal === "lose" && targetWeightNum >= currentWeight) {
      return false;
    }
    if (weightGoal === "gain" && targetWeightNum <= currentWeight) {
      return false;
    }

    return true;
  }, [targetWeight, weightGoal, user?.weight]);

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={back}>
            <Ionicons name="arrow-back" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Weight Goal</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-3xl font-PoppinsSemiBold text-black mb-4">
            Update your weight goal
          </Text>

          <Text className="font-Poppins text-md text-gray-500 mb-6">
            Set your target weight and choose your goal to receive personalized
            nutrition recommendations.
          </Text>

          {/* Current Weight Info */}
          {user?.weight && (
            <View className="flex-row gap-3 mb-6">
              <View className="flex-1 bg-blue-50 rounded-lg p-4">
                <Text className="font-PoppinsMedium text-sm text-gray-600 mb-1">
                  Current Weight
                </Text>
                <Text className="font-PoppinsSemiBold text-2xl text-gray-900">
                  {user.weight} kg
                </Text>
              </View>
              {user?.targetWeight && (
                <View className="flex-1 bg-green-50 rounded-lg p-4">
                  <Text className="font-PoppinsMedium text-sm text-gray-600 mb-1">
                    Current Target
                  </Text>
                  <Text className="font-PoppinsSemiBold text-2xl text-gray-900">
                    {user.targetWeight} kg
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Weight Goal Selection */}
          <View className="mb-6">
            <Text className="font-PoppinsMedium text-md text-gray-700 mb-3">
              What's your goal?
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => handleGoalSelect("lose")}
                className={`flex-1 p-4 rounded-lg border-2 ${
                  weightGoal === "lose"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Text
                  className={`font-PoppinsSemiBold text-center ${
                    weightGoal === "lose" ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  Lose
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleGoalSelect("maintain")}
                className={`flex-1 p-4 rounded-lg border-2 ${
                  weightGoal === "maintain"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Text
                  className={`font-PoppinsSemiBold text-center ${
                    weightGoal === "maintain"
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  Maintain
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleGoalSelect("gain")}
                className={`flex-1 p-4 rounded-lg border-2 ${
                  weightGoal === "gain"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Text
                  className={`font-PoppinsSemiBold text-center ${
                    weightGoal === "gain" ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  Gain
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Target Weight Input */}
          <View className="mb-6">
            <Text className="font-PoppinsMedium text-md text-gray-700 mb-2">
              Target Weight (kg)
            </Text>
            <TextInputField
              value={targetWeight}
              onChangeText={setTargetWeight}
              keyboardType="numeric"
              placeholderText="Enter target weight"
              editable={weightGoal !== "maintain"}
            />
            {weightGoal === "maintain" && (
              <Text className="text-sm text-gray-500 mt-2 font-Poppins">
                Target weight is set to your current weight for maintenance goal
              </Text>
            )}
            {!isValid &&
              targetWeight &&
              weightGoal &&
              weightGoal !== "maintain" && (
                <Text className="text-sm text-red-500 mt-2 font-Poppins">
                  {parseFloat(targetWeight) < 20 ||
                  parseFloat(targetWeight) > 200
                    ? "Target weight must be between 20-200 kg"
                    : weightGoal === "lose"
                      ? "Target weight must be less than current weight"
                      : weightGoal === "gain"
                        ? "Target weight must be greater than current weight"
                        : ""}
                </Text>
              )}
          </View>
        </ScrollView>

        {/* Save Button - Fixed at bottom */}
        <View className="p-4 bg-[#FAFAFA]">
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
              {isLoading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
          {error && (
            <Text style={{ color: "red", textAlign: "center", marginTop: 8 }}>
              {error}
            </Text>
          )}
          {response?.message && (
            <Text style={{ color: "green", textAlign: "center", marginTop: 8 }}>
              {response.message}
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default memo(EditWeightGoal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
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
