import { icons } from "@/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";

interface ManualEntryModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    foodName: string;
    servingSize: string;
    calories: string;
    carbs: string;
    protein: string;
    fats: string;
  }) => void;
}

export function ManualEntryModal({
  visible,
  onClose,
  onSubmit,
}: ManualEntryModalProps) {
  const [foodName, setFoodName] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [calories, setCalories] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fats, setFats] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [errors, setErrors] = useState({
    foodName: "",
    calories: "",
    carbs: "",
    protein: "",
    fats: "",
  });

  const validateField = useCallback((field: string, value: string) => {
    let error = "";

    switch (field) {
      case "foodName":
        if (!value.trim()) {
          error = "Food name is required";
        } else if (value.trim().length < 2) {
          error = "Food name must be at least 2 characters";
        }
        break;
      case "calories":
        if (!value.trim()) {
          error = "Calories are required";
        } else if (isNaN(Number(value)) || Number(value) < 0) {
          error = "Please enter a valid number";
        } else if (Number(value) > 10000) {
          error = "Calories seem unusually high";
        }
        break;
      case "carbs":
      case "protein":
      case "fats":
        if (value.trim() && (isNaN(Number(value)) || Number(value) < 0)) {
          error = "Please enter a valid number";
        } else if (Number(value) > 1000) {
          error = "Value seems unusually high";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  }, []);

  const handleSubmit = useCallback(() => {
    const isValidName = validateField("foodName", foodName);
    const isValidCalories = validateField("calories", calories);
    const isValidCarbs = validateField("carbs", carbs);
    const isValidProtein = validateField("protein", protein);
    const isValidFats = validateField("fats", fats);

    if (
      isValidName &&
      isValidCalories &&
      isValidCarbs &&
      isValidProtein &&
      isValidFats
    ) {
      onSubmit({
        foodName,
        servingSize,
        calories,
        carbs,
        protein,
        fats,
      });
      // Reset form
      setFoodName("");
      setServingSize("");
      setCalories("");
      setCarbs("");
      setProtein("");
      setFats("");
      setErrors({
        foodName: "",
        calories: "",
        carbs: "",
        protein: "",
        fats: "",
      });
    }
  }, [foodName, servingSize, calories, carbs, protein, fats, onSubmit]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <Animated.View
          entering={SlideInDown.duration(300)}
          className="bg-white rounded-t-3xl"
          style={{ maxHeight: "90%" }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
            <Text className="text-xl font-PoppinsSemiBold text-gray-900">
              Add Food Manually
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
            >
              <MaterialCommunityIcons name="close" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="px-6 py-4"
            showsVerticalScrollIndicator={false}
          >
            {/* Food Name Input */}
            <View className="mb-5">
              <Text className="text-gray-700 font-PoppinsMedium mb-2">
                Food Name *
              </Text>
              <TextInput
                className={`bg-white rounded-xl px-4 py-3 font-Poppins text-gray-900 ${
                  focusedInput === "foodName"
                    ? "border-2 border-emerald-500"
                    : errors.foodName
                      ? "border-2 border-red-500"
                      : "border border-gray-200"
                }`}
                placeholder="e.g., Grilled Chicken Breast"
                placeholderTextColor="#9CA3AF"
                value={foodName}
                onChangeText={(text) => {
                  setFoodName(text);
                  if (errors.foodName) validateField("foodName", text);
                }}
                onFocus={() => setFocusedInput("foodName")}
                onBlur={() => {
                  setFocusedInput("");
                  validateField("foodName", foodName);
                }}
                style={{ fontSize: 15 }}
              />
              {errors.foodName ? (
                <Text className="text-red-500 text-sm font-Poppins mt-1">
                  {errors.foodName}
                </Text>
              ) : null}
            </View>

            {/* Serving Size Input */}
            <View className="mb-5">
              <Text className="text-gray-700 font-PoppinsMedium mb-2">
                Serving Size
              </Text>
              <TextInput
                className={`bg-white rounded-xl px-4 py-3 font-Poppins text-gray-900 ${
                  focusedInput === "servingSize"
                    ? "border-2 border-emerald-500"
                    : "border border-gray-200"
                }`}
                placeholder="e.g., 100g, 1 cup, 1 piece"
                placeholderTextColor="#9CA3AF"
                value={servingSize}
                onChangeText={setServingSize}
                onFocus={() => setFocusedInput("servingSize")}
                onBlur={() => setFocusedInput("")}
                style={{ fontSize: 15 }}
              />
            </View>

            {/* Macros Section */}
            <Text className="text-gray-700 font-PoppinsSemiBold mb-3 text-base">
              Nutritional Information
            </Text>

            {/* Calories */}
            <View
              className={`bg-white rounded-2xl p-4 mb-4 ${
                focusedInput === "calories"
                  ? "border-2 border-orange-500"
                  : errors.calories
                    ? "border-2 border-red-500"
                    : "border border-gray-100"
              }`}
            >
              <View className="flex-row items-center">
                <View className="bg-orange-100 rounded-xl p-3">
                  <Image
                    source={require("@/assets/icons/calories.png")}
                    style={{ width: 24, height: 24 }}
                    resizeMode="contain"
                  />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-gray-600 font-PoppinsMedium mb-1">
                    Calories *
                  </Text>
                  <View className="flex-row items-baseline">
                    <TextInput
                      className="font-PoppinsBold text-gray-900 flex-1"
                      placeholder="0"
                      placeholderTextColor="#D1D5DB"
                      value={calories}
                      onChangeText={(text) => {
                        const filtered = text.replace(/[^0-9]/g, "");
                        setCalories(filtered);
                        if (errors.calories)
                          validateField("calories", filtered);
                      }}
                      onFocus={() => setFocusedInput("calories")}
                      onBlur={() => {
                        setFocusedInput("");
                        validateField("calories", calories);
                      }}
                      keyboardType="numeric"
                      style={{ fontSize: 24 }}
                    />
                    <Text className="text-gray-500 font-PoppinsMedium text-base ml-2">
                      kcal
                    </Text>
                  </View>
                </View>
              </View>
              {errors.calories ? (
                <Text className="text-red-500 text-sm font-Poppins mt-2">
                  {errors.calories}
                </Text>
              ) : null}
            </View>

            {/* Carbs */}
            <View
              className={`bg-white rounded-2xl p-4 mb-4 ${
                focusedInput === "carbs"
                  ? "border-2 border-green-500"
                  : errors.carbs
                    ? "border-2 border-red-500"
                    : "border border-gray-100"
              }`}
            >
              <View className="flex-row items-center">
                <View className="bg-green-100 rounded-xl p-3">
                  <Image
                    source={require("@/assets/icons/carbs.png")}
                    style={{ width: 24, height: 24 }}
                    resizeMode="contain"
                  />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-gray-600 font-PoppinsMedium mb-1">
                    Carbohydrates
                  </Text>
                  <View className="flex-row items-baseline">
                    <TextInput
                      className="font-PoppinsBold text-gray-900 flex-1"
                      placeholder="0"
                      placeholderTextColor="#D1D5DB"
                      value={carbs}
                      onChangeText={(text) => {
                        const filtered = text.replace(/[^0-9]/g, "");
                        setCarbs(filtered);
                        if (errors.carbs) validateField("carbs", filtered);
                      }}
                      onFocus={() => setFocusedInput("carbs")}
                      onBlur={() => {
                        setFocusedInput("");
                        validateField("carbs", carbs);
                      }}
                      keyboardType="numeric"
                      style={{ fontSize: 20 }}
                    />
                    <Text className="text-gray-500 font-PoppinsBold text-base ml-2">
                      g
                    </Text>
                  </View>
                </View>
              </View>
              {errors.carbs ? (
                <Text className="text-red-500 text-sm font-Poppins mt-2">
                  {errors.carbs}
                </Text>
              ) : null}
            </View>

            {/* Protein */}
            <View
              className={`bg-white rounded-2xl p-4 mb-4 ${
                focusedInput === "protein"
                  ? "border-2 border-purple-500"
                  : errors.protein
                    ? "border-2 border-red-500"
                    : "border border-gray-100"
              }`}
            >
              <View className="flex-row items-center">
                <View className="bg-purple-100 rounded-xl p-3">
                  <Image
                    source={icons.protein}
                    style={{ width: 24, height: 24 }}
                    resizeMode="contain"
                  />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-gray-600 font-PoppinsMedium mb-1">
                    Protein
                  </Text>
                  <View className="flex-row items-baseline">
                    <TextInput
                      className="font-PoppinsBold text-gray-900 flex-1"
                      placeholder="0"
                      placeholderTextColor="#D1D5DB"
                      value={protein}
                      onChangeText={(text) => {
                        const filtered = text.replace(/[^0-9]/g, "");
                        setProtein(filtered);
                        if (errors.protein) validateField("protein", filtered);
                      }}
                      onFocus={() => setFocusedInput("protein")}
                      onBlur={() => {
                        setFocusedInput("");
                        validateField("protein", protein);
                      }}
                      keyboardType="numeric"
                      style={{ fontSize: 20 }}
                    />
                    <Text className="text-gray-500 font-PoppinsBold text-base ml-2">
                      g
                    </Text>
                  </View>
                </View>
              </View>
              {errors.protein ? (
                <Text className="text-red-500 text-sm font-Poppins mt-2">
                  {errors.protein}
                </Text>
              ) : null}
            </View>

            {/* Fats */}
            <View
              className={`bg-white rounded-2xl p-4 mb-6 ${
                focusedInput === "fats"
                  ? "border-2 border-yellow-500"
                  : errors.fats
                    ? "border-2 border-red-500"
                    : "border border-gray-100"
              }`}
            >
              <View className="flex-row items-center">
                <View className="bg-yellow-100 rounded-xl p-3">
                  <Image
                    source={icons.fats}
                    style={{ width: 24, height: 24 }}
                    resizeMode="contain"
                  />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-gray-600 font-PoppinsMedium mb-1">
                    Total Fat
                  </Text>
                  <View className="flex-row items-baseline">
                    <TextInput
                      className="font-PoppinsBold text-gray-900 flex-1"
                      placeholder="0"
                      placeholderTextColor="#D1D5DB"
                      value={fats}
                      onChangeText={(text) => {
                        const filtered = text.replace(/[^0-9]/g, "");
                        setFats(filtered);
                        if (errors.fats) validateField("fats", filtered);
                      }}
                      onFocus={() => setFocusedInput("fats")}
                      onBlur={() => {
                        setFocusedInput("");
                        validateField("fats", fats);
                      }}
                      keyboardType="numeric"
                      style={{ fontSize: 20 }}
                    />
                    <Text className="text-gray-500 font-PoppinsBold text-base ml-2">
                      g
                    </Text>
                  </View>
                </View>
              </View>
              {errors.fats ? (
                <Text className="text-red-500 text-sm font-Poppins mt-2">
                  {errors.fats}
                </Text>
              ) : null}
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 mb-6">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-gray-100 rounded-xl py-4 items-center"
              >
                <Text className="font-PoppinsSemiBold text-gray-700">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                className="flex-1 bg-emerald-600 rounded-xl py-4 items-center"
                style={{
                  shadowColor: "#10b981",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text className="font-PoppinsSemiBold text-white">
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
