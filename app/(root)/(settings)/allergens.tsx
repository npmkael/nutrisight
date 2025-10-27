import AllergensSelection from "@/components/AllergenSelection";
import { useAuth } from "@/context/AuthContext";
import { useAccountUpdate } from "@/hooks/useAccountUpdate";
import { colors } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
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
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={back}>
            <Ionicons name="arrow-back" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Allergens</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <View className="flex-1">
          {/* Allergens Selection Component */}
          <View className="flex-1">
            <AllergensSelection
              selectedAllergens={selectedAllergens}
              setSelectedAllergens={setSelectedAllergens}
            />
          </View>
        </View>
      </ScrollView>
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
  scrollContainer: {
    flex: 1,
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
