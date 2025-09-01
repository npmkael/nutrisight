import { colors } from "@/lib/utils";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

type AddMealProps = {
  title: "Breakfast" | "Lunch" | "Dinner" | "Snacks";
  totalCalories: number;
  caloriesConsumed: number;
};

// not finished meal
export function AddMeal({
  title,
  totalCalories,
  caloriesConsumed,
}: AddMealProps) {
  return (
    <View className="bg-white rounded-md shadow-sm border border-gray-200 px-4 py-4 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <MaterialCommunityIcons
          name="silverware-fork-knife"
          size={30}
          color="black"
        />

        <View className="flex-col">
          <View className="flex-row items-center gap-1">
            <Text className="text-black text-lg font-PoppinsMedium">
              {totalCalories !== caloriesConsumed ? "Add " + title : title}
            </Text>

            {totalCalories === caloriesConsumed && (
              <View className="p-1 bg-[#2D3644] rounded-full items-center justify-items-center">
                <Feather name="check" size={8} color="white" />
              </View>
            )}
          </View>
          <View className="flex-row items-center gap-2">
            <View className="w-16">
              <Progress
                min={caloriesConsumed}
                max={totalCalories}
                height={4}
                color={colors.primary}
                backgroundColor="rgba(0, 0, 0, 0.1)"
              />
            </View>
            <Text
              style={{
                fontFamily: "Poppins",
                fontSize: 12,
              }}
              className="text-foreground"
            >
              {caloriesConsumed} / {totalCalories} kcal
            </Text>
          </View>
        </View>
      </View>

      {totalCalories !== caloriesConsumed && (
        <TouchableOpacity
          className="p-2 rounded-full bg-transparent border border-[#a0a0a0]"
          onPress={() => router.push("/(root)/main-camera")}
        >
          <Ionicons name="add" size={24} color="#a0a0a0" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const Progress = ({
  min,
  max,
  height,
  color,
  backgroundColor,
}: {
  min: number;
  max: number;
  height: number;
  color: string;
  backgroundColor: string;
}) => {
  const [width, setWidth] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const reactive = useRef(new Animated.Value(-1000)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: reactive,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    reactive.setValue(-width + (width * min) / max);
  }, [min, width]);

  return (
    <View
      onLayout={(e) => {
        const newWidth = e.nativeEvent.layout.width;
        setWidth(newWidth);
      }}
      style={{
        height,
        backgroundColor: backgroundColor,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={{
          height,
          width: "100%",
          backgroundColor: color,
          position: "absolute",
          left: 0,
          top: 0,
          transform: [
            {
              translateX: animatedValue,
            },
          ],
        }}
      />
    </View>
  );
};
