import Typo from "@/components/Typo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import CircularProgressBar from "@/components/CircularProgressBar";
import LineProgressBar from "@/components/LineProgressBar";
import {
  capitalizeFirstLetter,
  chunkArray,
  scanForAllergen,
} from "@/utils/helpers";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useLocalSearchParams, useRouter } from "expo-router";
import { memo, useCallback, useMemo } from "react";
import Swiper from "react-native-swiper";
import { ScanResultType } from "./main-camera";

const COLORS = [
  "#30B0C7", // blue
  "#F47450", // orange
  "#FF2D55", // red
  "#34C759", // green
  "#5856D6", // purple
  "#AF52DE", // violet
  "#FFD60A", // yellow
  "#FF9500", // amber
];

function Results() {
  const router = useRouter();
  const { image, name, userAllergens, scanResult } = useLocalSearchParams();
  const result: ScanResultType = scanResult
    ? JSON.parse(scanResult as string)
    : null;

  const handleBack = useCallback(() => {
    if (name) {
      router.back();
    } else {
      router.replace("/(root)/main-camera");
    }
  }, [name, router]);

  // This calculation only runs when nutrition changes
  const nutritionChunks = useMemo(() => {
    if (!result?.nutrition) return [];
    // Flatten the 3D array into a single array of nutrients
    const parsedNutrition: any[][][] =
      typeof result.nutrition === "string"
        ? JSON.parse(result.nutrition)
        : Array.isArray(result.nutrition)
          ? result.nutrition
          : [];

    // Flatten all nutrients into a single array
    const flatNutritionArr: any[] = parsedNutrition.flat(2); // flatten 2 levels

    return chunkArray(flatNutritionArr, 6);
  }, [result?.nutrition]);

  // this only runs when userAllergens or ingredients change
  const allergensDetected = useMemo(() => {
    return scanForAllergen(
      (userAllergens as string).split(","),
      result?.ingredients || ""
    );
  }, [userAllergens, result?.ingredients]);

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <Image
        className="absolute top-0 left-0 right-0"
        source={{ uri: image as string }}
        style={{ height: 400, width: "100%" }}
        blurRadius={30}
        resizeMode="cover"
      />
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-8 pb-2">
        <TouchableOpacity
          className="bg-black/50 rounded-full p-2"
          onPress={handleBack}
        >
          <Entypo name="chevron-left" size={28} color="white" />
        </TouchableOpacity>
      </View>
      {/* Image */}
      <View className="items-center mt-2">
        <Image
          source={{ uri: image as string }}
          className="w-[320px] h-[250px] rounded-2xl object-cover shadow-xl"
        />
      </View>
      <View className="flex-1 bg-white mt-[-24px] rounded-t-3xl px-4 shadow-xl">
        {/* Date/Time */}
        <View className="bg-[#F3F4F7] rounded-2xl flex-row items-center justify-center mb-2 gap-2 px-2 py-2 w-32">
          <AntDesign name="instagram" size={24} color="black" />
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
                {nutritionChunks
                  .flat() // flatten the 2D array
                  .filter((item: any) =>
                    ["energy", "calories", "energy kcal"].includes(
                      (item.name as string).toLowerCase()
                    )
                  )
                  .reduce(
                    (sum: number, item: any) => sum + Number(item.amount || 0),
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

            <Swiper
              loop={false}
              className="h-[265px]"
              dot={
                <View className="w-[32px] h-[4px] mx-1 bg-[#f1f1f1] rounded-full" />
              }
              activeDot={
                <View className="w-[32px] h-[4px] mx-1 bg-black rounded-full" />
              }
            >
              {/* add ka nalang another view kung gusto mo pa ng isang swiper */}

              {nutritionChunks.map((chunk: any[], idx) => (
                <View className="mx-4" key={idx}>
                  {[0, 1].map((rowIdx) => (
                    <View
                      key={rowIdx}
                      className="flex-row items-center gap-2 mb-2"
                    >
                      {chunk
                        .slice(rowIdx * 3, rowIdx * 3 + 3)
                        .map((nutrient: any, colIdx: number) => (
                          <View
                            key={colIdx}
                            className="bg-gray-100 rounded-3xl px-4 py-4 items-center flex-1"
                          >
                            <Text
                              className="font-PoppinsSemiBold tracking-widest text-md mb-1 text-center"
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {nutrient.name}
                            </Text>
                            <CircularProgressBar
                              progress={nutrient.amount}
                              size={55}
                              strokeWidth={4}
                              color={
                                COLORS[(rowIdx * 3 + colIdx) % COLORS.length]
                              }
                              backgroundColor="rgba(0,0,0,0.05)"
                              showPercentage={true}
                              percentageTextSize={10}
                              percentageTextColor="black"
                              label={nutrient.unit}
                            />
                          </View>
                        ))}
                    </View>
                  ))}
                </View>
              ))}
            </Swiper>
          </View>

          {/* Healthiness Rating */}
          <View className="flex-row bg-white rounded-2xl p-4 shadow border items-center border-gray-100 gap-2 justify-evenly mb-4">
            <View className="bg-gray-100 rounded-2xl p-4">
              <FontAwesome5 name="heartbeat" size={36} color="black" />
            </View>
            <View className="flex-col gap-2">
              <Text className="font-Poppins text-xl">Healthiness Rating</Text>
              <LineProgressBar progress={30} height={5} />
            </View>

            <Text className="font-PoppinsBold text-4xl">3/10</Text>
          </View>

          {/* Allergens */}
          {allergensDetected.length > 0 && (
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
                    Allergens:
                  </Text>
                  <View className="flex-row flex-wrap gap-1 mb-2">
                    {allergensDetected.map((a, idx) => (
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
          className="bg-transparent rounded-full px-6 py-4 border border-[#2D3644] flex-1"
          onPress={handleBack}
        >
          <Text className="font-Poppins text-center text-black uppercase">
            Discard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#2D3644] rounded-full px-6 py-4 border border-black flex-1">
          <Text className="font-Poppins text-center text-white uppercase">
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(Results);
