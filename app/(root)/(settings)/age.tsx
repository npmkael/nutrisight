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

function AgeEdit() {
  const { updateAccount, isLoading, error, response } = useAccountUpdate();
  const { user, setUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setAge(user?.age?.toString() || "");
    }
  }, [user]);

  useEffect(() => {
    if (response) {
      setUser((prev) => (prev ? { ...prev, age: response.data.age } : prev));
    }
  }, [response]);

  const [age, setAge] = useState(user?.age?.toString() || "");

  const back = useCallback(() => {
    router.back();
  }, [router]);

  const handleSave = useCallback(async () => {
    const ageNum = parseInt(age);
    const res = await updateAccount({ age: ageNum });
    if (!error) router.back();
  }, [age, updateAccount, setUser, router, error]);

  const isValid = useCallback(() => {
    const ageNum = parseInt(age);
    return age.trim().length > 0 && ageNum >= 1 && ageNum <= 120;
  }, [age]);

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
            Edit Age
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-4 pt-8">
          <Text className="text-3xl font-PoppinsSemiBold text-black mb-4">
            Update your age
          </Text>

          <Text className="font-Poppins text-md text-gray-500 mb-6">
            Your age helps us provide personalized nutrition recommendations.
          </Text>

          <View className="mb-6">
            <Text className="font-Poppins text-md text-gray-500 mb-2">
              How old are you?
            </Text>
            <View className="flex-row items-center gap-3">
              <TextInputField
                value={age}
                onChangeText={setAge}
                maxLength={3}
                keyboardType="numeric"
              />
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

export default memo(AgeEdit);

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
