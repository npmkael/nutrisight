import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface FoodSearchResultItemProps {
  foodName: string;
  servingSize?: string;
  calories?: number;
  carbs?: number;
  protein?: number;
  fats?: number;
  brand?: string;
  onPress: () => void;
  index: number;
}

export function FoodSearchResultItem({
  foodName,
  servingSize,
  calories,
  carbs,
  protein,
  fats,
  brand,
  onPress,
  index,
}: FoodSearchResultItemProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(index * 50)}
      className="mb-3"
    >
      <TouchableOpacity
        onPress={onPress}
        className="bg-white rounded-2xl p-4 border border-gray-200"
        activeOpacity={0.6}
      >
        {/* Header Row: Icon + Food Name */}
        <View className="flex-row items-start mb-3">
          {/* Food Icon */}
          <View className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center mr-3">
            <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={20}
              color="black"
            />
          </View>

          {/* Food Name & Brand */}
          <View className="flex-1">
            <Text
              className="text-gray-900 font-PoppinsSemiBold mb-0.5"
              style={{ fontSize: 17, lineHeight: 22 }}
              numberOfLines={1}
            >
              {foodName}
              {brand && brand.toLowerCase() !== "unknown" && (
                <Text
                  className="text-gray-500 font-Poppins"
                  style={{ fontSize: 15 }}
                >
                  {" "}
                  ({brand})
                </Text>
              )}
            </Text>

            {/* Serving Size + Calories */}
            <View className="flex-row items-center flex-wrap mt-1">
              <Text
                className="text-gray-600 font-PoppinsMedium"
                style={{ fontSize: 14 }}
              >
                {calories ? `${Math.round(calories)}kcal` : "— kcal"}
              </Text>
              {servingSize && (
                <>
                  <Text
                    className="text-gray-400 mx-1.5"
                    style={{ fontSize: 14 }}
                  >
                    •
                  </Text>
                  <Text
                    className="text-gray-500 font-Poppins"
                    style={{ fontSize: 14 }}
                    numberOfLines={1}
                  >
                    {servingSize}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Macros Row */}
        {(carbs !== undefined ||
          protein !== undefined ||
          fats !== undefined) && (
          <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
            {/* Carbs */}
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
              <Text
                className="text-gray-500 font-Poppins"
                style={{ fontSize: 13 }}
              >
                C:{" "}
              </Text>
              <Text
                className="text-gray-900 font-PoppinsMedium"
                style={{ fontSize: 13 }}
              >
                {carbs !== undefined ? `${Math.round(carbs)}g` : "—"}
              </Text>
            </View>

            {/* Protein */}
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-purple-500 mr-1.5" />
              <Text
                className="text-gray-500 font-Poppins"
                style={{ fontSize: 13 }}
              >
                P:{" "}
              </Text>
              <Text
                className="text-gray-900 font-PoppinsMedium"
                style={{ fontSize: 13 }}
              >
                {protein !== undefined ? `${Math.round(protein)}g` : "—"}
              </Text>
            </View>

            {/* Fats */}
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-yellow-500 mr-1.5" />
              <Text
                className="text-gray-500 font-Poppins"
                style={{ fontSize: 13 }}
              >
                F:{" "}
              </Text>
              <Text
                className="text-gray-900 font-PoppinsMedium"
                style={{ fontSize: 13 }}
              >
                {fats !== undefined ? `${Math.round(fats)}g` : "—"}
              </Text>
            </View>

            {/* Chevron Indicator */}
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </View>
        )}

        {/* Fallback if no macros - just show chevron */}
        {carbs === undefined && protein === undefined && fats === undefined && (
          <View className="absolute right-4 top-1/2" style={{ marginTop: -9 }}>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
