import { useAuth } from "@/context/AuthContext";
import { useAccountUpdate } from "@/hooks/useAccountUpdate";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function GenderEdit() {
  const { updateAccount, isLoading, error, response } = useAccountUpdate();
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState(user?.gender || "");

  useEffect(() => {
    if (user) {
      setSelectedGender(user.gender || "");
    }
  }, [user]);

  useEffect(() => {
    if (response) {
      setUser((prev) =>
        prev ? { ...prev, gender: response.data.gender } : prev
      );
    }
  }, [response]);

  const back = useCallback(() => {
    router.back();
  }, [router]);

  const handleSave = useCallback(async () => {
    await updateAccount({ gender: selectedGender });
    if (!error) router.back();
    router.back();
  }, [selectedGender, updateAccount, setUser, router, error]);

  const isValid = selectedGender.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={back}>
          <Ionicons name="arrow-back" size={18} color="black" />
        </TouchableOpacity>
        <Text
          style={styles.titleText}
          className="font-PoppinsSemiBold text-2xl"
        >
          Edit Gender
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-4 pt-8">
        <Text className="text-3xl font-PoppinsSemiBold text-black mb-4">
          Update your gender
        </Text>

        <Text className="font-Poppins text-md text-gray-500 mb-6">
          This helps us provide more accurate nutritional recommendations.
        </Text>

        <View className="mb-6">
          <Text className="font-Poppins text-md text-gray-500 mb-3">
            What's your gender?
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className={`flex-1 py-4 px-6 rounded-lg border ${
                selectedGender === "male"
                  ? "bg-black border-black"
                  : "bg-white border-gray-300"
              }`}
              onPress={() => setSelectedGender("male")}
            >
              <Text
                className={`text-center font-PoppinsMedium text-base ${
                  selectedGender === "male" ? "text-white" : "text-black"
                }`}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-4 px-6 rounded-lg border ${
                selectedGender === "female"
                  ? "bg-black border-black"
                  : "bg-white border-gray-300"
              }`}
              onPress={() => setSelectedGender("female")}
            >
              <Text
                className={`text-center font-PoppinsMedium text-base ${
                  selectedGender === "female" ? "text-white" : "text-black"
                }`}
              >
                Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-4 px-6 rounded-lg border ${
                selectedGender === "other"
                  ? "bg-black border-black"
                  : "bg-white border-gray-300"
              }`}
              onPress={() => setSelectedGender("other")}
            >
              <Text
                className={`text-center font-PoppinsMedium text-base ${
                  selectedGender === "other" ? "text-white" : "text-black"
                }`}
              >
                Other
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
    </SafeAreaView>
  );
}

export default memo(GenderEdit);

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
