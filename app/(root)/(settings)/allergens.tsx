import AllergensSelection from "@/components/AllergenSelection";
import { useAuth } from "@/context/AuthContext";
import { useAccountUpdate } from "@/hooks/useAccountUpdate";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function AllergensEdit() {
  const { updateAccount, isLoading, error, response } = useAccountUpdate();
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(
    user?.allergens || []
  );

  useEffect(() => {
    if (user) {
      setSelectedAllergens(user.allergens || []);
    }
  }, [user]);

  useEffect(() => {
    if (response) {
      setUser((prev) =>
        prev ? { ...prev, allergens: response.data.allergens } : prev
      );
    }
  }, [response]);

  const back = useCallback(() => {
    router.back();
  }, [router]);

  const handleSave = useCallback(async () => {
    await updateAccount({ allergens: selectedAllergens });
    if (!error) router.back();
  }, [router, selectedAllergens, updateAccount, setUser, error]);

  const isValid = useMemo(
    () => selectedAllergens.length > 0,
    [selectedAllergens]
  );

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
          Edit Allergens
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-4 pt-4">
        <Text className="text-3xl font-PoppinsSemiBold text-black mb-4">
          Update your allergies
        </Text>

        <Text className="font-Poppins text-md text-gray-500 mb-6">
          Select all foods you're allergic or intolerant to. This helps us to
          avoid recommending foods that you're allergic to.
        </Text>

        {/* Allergens Selection Component */}
        <View className="flex-1">
          <AllergensSelection
            selectedAllergens={selectedAllergens}
            setSelectedAllergens={setSelectedAllergens}
          />
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
    </SafeAreaView>
  );
}

export default memo(AllergensEdit);

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
