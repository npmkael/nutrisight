import CircularProgressBar from "@/components/CircularProgressBar";
import { capitalizeFirstLetter } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScanResultType } from "../main-camera";

export default function Snacks() {
  const { totalCalories, caloriesConsumed, title } = useLocalSearchParams();
  const [mealData, setMealData] = useState<ScanResultType[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    async function fetchMealData() {
      const stored = await AsyncStorage.getItem(
        (title as string) === "snacks" ? "others" : (title as string)
      );
      const recentResults = stored
        ? (JSON.parse(stored) as any[]).map((i) => ({
            ...i,
            image: require("@/assets/images/fried-rice.jpg"),
          }))
        : [];
      setMealData(recentResults);
    }
    fetchMealData();
  }, [title]);

  // BottomSheet snap points
  const snapPoints = useMemo(() => ["25%", "25%"], []);

  // Backdrop component with gray background
  const renderBackdrop = useMemo(
    () => (props: any) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.5}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        style={[props.style, { backgroundColor: "rgba(128, 128, 128, 0.7)" }]}
      />
    ),
    []
  );

  const sumByKeyword = useCallback(
    (
      nutritionData: {
        title: string;
        items: { name: string; value: number; unit: string }[];
      }[],
      keyword: string
    ) => {
      return nutritionData
        .flatMap((category) => category.items)
        .filter((item) => (item.name as string).toLowerCase().includes(keyword))
        .reduce((sum, item) => sum + Number(item.value || 0), 0);
    },
    []
  );

  const handleDeleteItem = useCallback(() => {
    if (selectedItemId == null) return;
    const updatedData = mealData.filter((item) => item.id !== selectedItemId);
    setMealData(updatedData);
    AsyncStorage.setItem(
      (title as string) === "snacks" ? "others" : (title as string),
      JSON.stringify(updatedData)
    );
    bottomSheetRef.current?.close();
    setSelectedItemId(null);
  }, [selectedItemId, mealData]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "grey" }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            padding: 16,
          }}
        >
          <View className="justify-between items-center gap-4 flex-row w-full">
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: "#F4F4F4",
              }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 24,
                fontWeight: "600",
                color: "#000",
                position: "absolute",
                left: 0,
                right: 0,
                textAlign: "center",
                zIndex: -1,
                fontFamily: "PoppinsSemiBold",
              }}
            >
              Snacks
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Nutrition Summary */}
          <Animated.View
            entering={FadeIn.duration(500).delay(200)}
            className="bg-white mx-4 mt-4 p-4 rounded-2xl shadow-sm border border-gray-100"
          >
            <Text className="text-lg font-PoppinsSemiBold text-black mb-4">
              Nutrition Summary
            </Text>

            <View className="items-center mb-4">
              <CircularProgressBar
                progress={Math.min(
                  (Number(caloriesConsumed) / Number(totalCalories)) * 100,
                  100
                )}
                size={120}
                strokeWidth={8}
                color="#2D3644"
                backgroundColor="rgba(45, 54, 68, 0.1)"
                showPercentage={false}
              />

              <View className="absolute inset-0 flex-1 justify-center items-center">
                <Text
                  style={{
                    fontSize: 28,
                    fontFamily: "PoppinsSemiBold",
                    color: "#000",
                    lineHeight: 32,
                  }}
                >
                  {totalCalories}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins",
                    marginTop: -4,
                  }}
                  className="text-foreground"
                >
                  kcal
                </Text>
              </View>
            </View>

            <Text className="text-xs font-Poppins text-gray-500 text-center">
              {caloriesConsumed} / {totalCalories} kcal daily snacks goal
            </Text>
          </Animated.View>

          {/* Meal Items */}
          <View className="px-4 mt-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-PoppinsSemiBold text-black">
                Recent Foods on {capitalizeFirstLetter(title as string)} (
                {mealData.length})
              </Text>
            </View>

            {mealData.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={ZoomIn.duration(500).delay(300 + index * 100)}
                className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="bg-gray-100 rounded-lg p-2">
                      <Image
                        source={require("@/assets/images/snacks.png")}
                        className="w-8 h-8 rounded-xl"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-PoppinsSemiBold text-black">
                        {item.name
                          ? capitalizeFirstLetter(item.name)
                          : item.foodName
                            ? capitalizeFirstLetter(item.foodName)
                            : "Unknown Food"}
                      </Text>
                      <Text className="text-sm font-Poppins text-gray-500">
                        {(() => {
                          const calorieItem = item.nutritionData
                            .flatMap((category) => category.items)
                            .find((item) =>
                              ["energy", "calories", "kcal"].some((key) =>
                                (item.name as string)
                                  .toLowerCase()
                                  .includes(key)
                              )
                            );
                          return calorieItem
                            ? `${
                                Number(calorieItem.value) % 1 === 0
                                  ? Number(calorieItem.value).toFixed(0)
                                  : Number(calorieItem.value).toFixed(2)
                              }`
                            : "N/A";
                        })()}{" "}
                        kcal • {item.servingSize} serving size
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    className="bg-gray-100 rounded-lg p-2"
                    onPress={() => {
                      setSelectedItemId(item.id);
                      bottomSheetRef.current?.expand();
                    }}
                  >
                    <Entypo
                      name="dots-three-vertical"
                      size={14}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>

                {/* Nutrition Values */}
                <View className="flex-row justify-between">
                  <View className="items-center flex-1">
                    <Text className="text-lg font-PoppinsBold text-primary">
                      {sumByKeyword(item.nutritionData, "protein")}g
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <Text className="text-xs font-PoppinsMedium text-gray-600">
                        Protein
                      </Text>
                    </View>
                  </View>

                  <View className="items-center flex-1">
                    <Text className="text-lg font-PoppinsBold text-primary">
                      {sumByKeyword(item.nutritionData, "carb")}g
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <Text className="text-xs font-PoppinsMedium text-gray-600">
                        Carbs
                      </Text>
                    </View>
                  </View>

                  <View className="items-center flex-1">
                    <Text className="text-lg font-PoppinsBold text-primary">
                      {sumByKeyword(item.nutritionData, "fat")}g
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <Text className="text-xs font-PoppinsMedium text-gray-600">
                        Fat
                      </Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>

          {/* Add More Foods Button */}
          <Animated.View
            entering={FadeIn.duration(600).delay(600)}
            className="mx-4 my-6"
          >
            <TouchableOpacity
              onPress={() =>
                router.push(`/(root)/main-camera?mealTime=${title}`)
              }
              className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 items-center justify-center"
            >
              <View className="bg-gray-100 rounded-full p-3 mb-2">
                <Ionicons name="add" size={24} color="#666" />
              </View>
              <Text className="text-lg font-PoppinsMedium text-foreground">
                Add More Food
              </Text>
              <Text className="text-sm font-Poppins text-gray-500">
                Scan for more items
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={-1}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
        >
          <BottomSheetView style={{ flex: 1, padding: 12 }}>
            <Text
              style={{
                fontSize: 18,
                marginBottom: 12,
                fontFamily: "PoppinsSemiBold",
              }}
            >
              Options
            </Text>
            <TouchableOpacity
              style={{
                padding: 14,
                borderRadius: 12,
                alignItems: "center",
                marginBottom: 12,
              }}
              className="bg-primary"
            >
              <Text
                style={{
                  fontFamily: "PoppinsMedium",
                  fontSize: 16,
                  color: "#fff",
                }}
              >
                View
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 14,
                borderRadius: 12,
                alignItems: "center",
              }}
              className="border border-red-500 bg-white"
            >
              <Text
                style={{
                  fontFamily: "PoppinsMedium",
                  fontSize: 16,
                  color: "#ef4444",
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
