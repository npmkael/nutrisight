import { BACKEND_URL } from "@/context/AuthContext";
import { colors } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function FoodCoverage() {
  const router = useRouter();
  const [foodClasses, setFoodClasses] = useState<string[]>([]);
  const [filteredFoodClasses, setFilteredFoodClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFoodClasses();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFoodClasses(foodClasses);
    } else {
      const filtered = foodClasses.filter((food) =>
        food.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFoodClasses(filtered);
    }
  }, [searchQuery, foodClasses]);

  const fetchFoodClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${BACKEND_URL}/camera/food-classes`);

      if (!response.ok) {
        throw new Error("Failed to fetch food classes");
      }

      const data = await response.json();

      // Sort alphabetically
      const sortedData = Array.isArray(data) ? data.sort() : [];
      setFoodClasses(sortedData);
      setFilteredFoodClasses(sortedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching food classes:", err);
    } finally {
      setLoading(false);
    }
  };

  const back = useCallback(() => {
    router.back();
  }, [router]);

  const renderFoodItem = ({ item, index }: { item: string; index: number }) => (
    <View
      className={`flex-row items-center py-3 px-4 ${
        index !== filteredFoodClasses.length - 1
          ? "border-b border-gray-100"
          : ""
      }`}
    >
      <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3">
        <Ionicons name="restaurant" size={16} color="#3B82F6" />
      </View>
      <Text className="flex-1 font-Poppins text-base text-gray-800 capitalize">
        {item.replace(/_/g, " ")}
      </Text>
    </View>
  );

  const ListHeaderComponent = useCallback(
    () => (
      <View className="mb-4">
        <Text className="text-2xl font-PoppinsSemiBold text-black mb-2">
          Supported Food Scan
        </Text>
        <Text className="font-Poppins text-sm text-gray-600 mb-4">
          Our trained CNN model can recognize and analyze the following{" "}
          {foodClasses.length} food items when you scan them with your camera.
        </Text>

        {filteredFoodClasses.length !== foodClasses.length && (
          <Text className="font-Poppins text-sm text-gray-500 mb-2">
            Found {filteredFoodClasses.length} of {foodClasses.length} foods
          </Text>
        )}
      </View>
    ),
    [foodClasses.length, filteredFoodClasses.length]
  );

  const renderEmptyState = () => (
    <View className="items-center justify-center py-12">
      <Ionicons name="search-outline" size={64} color="#D1D5DB" />
      <Text className="font-PoppinsMedium text-gray-500 mt-4">
        No foods found matching "{searchQuery}"
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]">
      <View style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={back}>
            <Ionicons name="arrow-back" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Food Coverage</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2D3644" />
            <Text className="font-Poppins text-gray-500 mt-4">
              Loading food database...
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-8">
            <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
            <Text className="font-PoppinsSemiBold text-lg text-gray-900 mt-4 text-center">
              Unable to load food list
            </Text>
            <Text className="font-Poppins text-gray-500 mt-2 text-center">
              {error}
            </Text>
            <TouchableOpacity
              onPress={fetchFoodClasses}
              className="bg-[#2D3644] px-6 py-3 rounded-lg mt-6"
            >
              <Text className="font-PoppinsMedium text-white">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-1">
            {/* Search Bar - Outside FlatList */}
            <View className="bg-white rounded-lg border border-gray-200 flex-row items-center px-4 py-3 mb-4">
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-2 font-Poppins text-base"
                placeholder="Search foods..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filteredFoodClasses}
              renderItem={renderFoodItem}
              keyExtractor={(item, index) => `${item}-${index}`}
              ListHeaderComponent={ListHeaderComponent}
              ListEmptyComponent={renderEmptyState}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              className="bg-white rounded-lg"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default memo(FoodCoverage);

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
    marginBottom: 24,
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
