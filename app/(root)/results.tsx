import Typo from "@/components/Typo";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ingredient } from "@/components/ingredient";
import Loading from "@/components/Loading";
import { BACKEND_URL, DietHistory, useAuth } from "@/context/AuthContext";
import {
  capitalizeFirstLetter,
  removeDuplicateTriggeredAllergens,
} from "@/utils/helpers";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useLocalSearchParams } from "expo-router";
import { memo, useCallback, useState } from "react";
import { ScanResultType } from "./main-camera";

function Results() {
  const { setUser } = useAuth();
  const { image, name, scanResult } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const result: ScanResultType = scanResult
    ? JSON.parse(scanResult as string)
    : null;
  const uniqueAllergens = removeDuplicateTriggeredAllergens(
    result.triggeredAllergens
  );

  console.log(result.ingredients);
  console.log(uniqueAllergens);

  const handleBack = useCallback(() => {
    if (name) {
      router.back();
    } else {
      router.replace("/(root)/main-camera");
    }
  }, [name, router]);

  const handleSave = useCallback(async () => {
    const allNutritionItems = result.nutritionData.flatMap(
      (category) => category.items
    );

    // Save the result or perform any action
    const dietHistoryPayload: DietHistory = {
      date: new Date(),
      nutritionalData: allNutritionItems.map((nutrient) => ({
        [(nutrient.name as string).toLowerCase()]: Number(nutrient.value),
      })),
    };

    console.log("Saving diet history:", dietHistoryPayload);

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/account/update-diet-history`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dietHistoryPayload,
        }),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.log("Error saving results:", errorData);
        alert("Error saving results. Please try again.");
        return;
      }
      const data = await res.json();
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        return {
          ...prevUser,
          dietHistory: data.dietHistory, // <-- replace, not append
        };
      });
      console.log("Successfully saved results:", data.dietHistory);
      alert("Successfully saved results.");
      router.replace("/(root)/(tabs)/home");
    } catch (error) {
      console.log("Error saving results:", error);
      alert("Error saving results. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [result, setUser, router]);

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <Image
        source={{ uri: image as string }}
        style={{ height: 300, width: "100%" }}
        resizeMode="cover"
      />
      {/* Header */}
      <TouchableOpacity
        className="absolute left-4 right-0 top-4 w-10 h-10 rounded-full bg-black/50 z-10 items-center justify-center"
        onPress={handleBack}
      >
        <View className="items-center justify-center">
          <Feather name="chevron-left" size={18} color="white" />
        </View>
      </TouchableOpacity>

      <View className="flex-1 bg-white mt-[-24px] px-4 py-4 shadow-xl">
        {/* Date/Time */}
        <View className="flex-row items-center justify-between">
          <View className="bg-[#F3F4F7] rounded-2xl flex-row items-center justify-center mb-2 gap-2 px-2 py-2 w-32">
            <AntDesign name="camera" size={24} color="black" />
            <View>
              <Text className="text-xs text-gray-400 font-Poppins">
                {new Date().toLocaleDateString("en-GB")}
              </Text>
              <Text className="text-xs text-gray-400 font-Poppins">
                {new Date().toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-5">
            <TouchableOpacity
              className="w-12 h-12 bg-white border border-gray-200 rounded-full items-center justify-center"
              onPress={() => setQuantity(quantity <= 1 ? 1 : quantity - 1)}
            >
              <AntDesign name="minus" size={20} color="black" />
            </TouchableOpacity>
            <Text className="text-xl text-black font-PoppinsMedium">
              {quantity}
            </Text>
            <TouchableOpacity className="w-12 h-12 bg-white border border-gray-200 rounded-full items-center justify-center">
              <AntDesign name="plus" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Card */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 5 }}
        >
          {/* Food Name */}
          <Typo size={28} className="font-Poppins text-gray-900 mb-6">
            {`${capitalizeFirstLetter(result.name || result.foodName || "")}`}
          </Typo>
          {/* Calories Card */}
          <View className="flex-row items-center bg-white rounded-2xl px-6 py-4 shadow border border-gray-100 mb-6">
            <View className="bg-gray-100 rounded-2xl p-4">
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={36}
                color="black"
              />
            </View>
            <View className="ml-4">
              <Text className="text-gray-500 font-Poppins">
                Estimated Total Calories
              </Text>
              <Text className="text-gray-500 font-Poppins">
                {result?.servingSize
                  ? `${result.servingSize} Serving Size`
                  : ""}
              </Text>
              <Text className="font-PoppinsBold text-gray-900 text-4xl">
                {result.nutritionData
                  .flatMap((category) => category.items)
                  .filter((item) =>
                    ["energy", "calories", "kcal"].some((key) =>
                      (item.name as string).toLowerCase().includes(key)
                    )
                  )
                  .reduce(
                    (sum: number, item: any) => sum + Number(item.value || 0),
                    0
                  )}{" "}
                kcal
              </Text>
            </View>
          </View>

          {/* Estimated Nutrients Summary */}
          <View className="flex-col bg-white rounded-2xl pt-4 shadow border border-gray-100 mb-4">
            <View className="flex-col mx-4 mb-4">
              <Text
                className="font-Poppins"
                style={{
                  lineHeight: 10,
                }}
              >
                Estimated Nutrients
              </Text>
              <Text className="font-PoppinsSemiBold text-3xl">Summary</Text>
            </View>

            <View>
              {result.nutritionData.map((category, categoryIndex) => (
                <View key={category.title}>
                  <View className="px-6 py-4 border-b border-[#e8e4dd]">
                    <View className="flex-row items-center gap-3">
                      {/* <Feather name="zap" size={18} color="black" /> */}
                      <Text className="text-black tracking-white text-lg font-PoppinsSemiBold">
                        {category.title}
                      </Text>
                    </View>
                  </View>

                  {category.items.map((item, itemIndex) => (
                    <View
                      key={`${category.title}-${item.name}`}
                      className={`px-6 py-3 border-b border-[#e8e4dd]/50 ${
                        itemIndex === category.items.length - 1 &&
                        categoryIndex === result.nutritionData.length - 1
                          ? "border-b-0"
                          : ""
                      }`}
                    >
                      <View className="flex-row items-center justify-between">
                        <Text className="font-PoppinsMedium text-black text-sm">
                          {item.name}
                        </Text>
                        <Text className="text-black font-PoppinsSemiBold bg-[#F4F4F4] px-3 py-1 rounded-full text-sm">
                          {Number(item.value) % 1 === 0
                            ? Number(item.value).toFixed(0)
                            : Number(item.value).toFixed(2)}
                          {item.unit}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>

          {/* Common Ingredients */}
          <View className="flex-col bg-white rounded-2xl pt-4 shadow border border-gray-100 mb-4">
            <View className="flex-col mx-4 mb-4">
              <Text
                className="font-Poppins"
                style={{
                  lineHeight: 10,
                }}
              >
                Common
              </Text>
              <Text className="font-PoppinsSemiBold text-3xl">Ingredients</Text>
            </View>
            <View className="flex-col mx-4 mb-4 gap-2">
              {result.ingredients.length > 0
                ? result.ingredients.map((ingredient, idx) => {
                    const triggers = result.triggeredAllergens.filter(
                      (a) =>
                        a.ingredient.toLowerCase() === ingredient.toLowerCase()
                    );
                    return (
                      <Ingredient
                        key={idx}
                        name={ingredient}
                        allergen={
                          triggers.length > 0
                            ? triggers.map((t) => t.allergen)
                            : undefined
                        }
                      />
                    );
                  })
                : null}
            </View>
          </View>

          {/* Allergens */}
          {result.triggeredAllergens.length > 0 && (
            <View className="rounded-2xl p-4 shadow border border-[#FFA4A4] bg-[#FFEEEE] mb-6">
              <View className="flex-row gap-4">
                <FontAwesome
                  name="warning"
                  size={18}
                  color="red"
                  className="mt-1"
                />

                <View className="flex-col gap-1 flex-1 min-w-0">
                  <Text className="font-PoppinsBold text-2xl mb-2">
                    Possible Allergen Ingredients:
                  </Text>
                  <View className="flex-row flex-wrap gap-1 mb-2">
                    {uniqueAllergens.map((a, idx) => (
                      <View
                        key={idx}
                        className="bg-[#FFA4A4] px-3 py-1 rounded-xl"
                      >
                        <Text className="font-Poppins text-black">
                          {capitalizeFirstLetter(a)}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <Text
                    className="font-Poppins"
                    style={{ flexWrap: "wrap", width: "100%" }}
                  >
                    Please read all labels carefully and consult with a
                    healthcare provider if you have any concerns.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
      <View className="flex-row gap-2 bg-white p-4 border-t border-t-gray-100">
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-transparent rounded-full px-4 py-3 border border-[#2D3644] flex-1"
          onPress={handleBack}
          disabled={loading}
        >
          <Text className="font-Poppins text-center text-black uppercase">
            Discard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-[#2D3644] rounded-full px-4 py-3 border border-black flex-1"
          onPress={handleSave}
          disabled={loading}
        >
          <Text className="font-Poppins text-center text-white uppercase">
            {loading ? <Loading /> : "Save"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(Results);

const styles = StyleSheet.create({
  saveButton: {},
});
