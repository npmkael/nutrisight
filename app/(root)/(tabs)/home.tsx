import { useAuth } from "@/context/AuthContext";
import { colors } from "@/lib/utils";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

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

const CustomCircularProgress = () => {
  const size = 140;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Calculate progress: assuming 70% progress for the goal
  const progress = 50;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        {/* Background circle with dashed style */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray="6 4"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="white"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* Center content */}
      <View className="absolute items-center justify-center">
        <Text className="text-5xl font-PoppinsBold text-white">1560</Text>
        <Text className="text-white text-sm font-Poppins mt-1">
          Calorie Goal
        </Text>
      </View>
    </View>
  );
};

function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Generate 7 days starting from current week
  const generateWeekDays = () => {
    const today = new Date();
    const startDate = new Date(selectedDate);

    // Get the start of the week (Sunday) for the selected date
    const dayOfWeek = startDate.getDay();
    const startOfWeek = new Date(startDate);
    startOfWeek.setDate(startDate.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);

      const dayName = currentDate.toLocaleDateString("en-US", {
        weekday: "short",
      });
      const dayNumber = currentDate.getDate().toString().padStart(2, "0");
      const isToday = currentDate.toDateString() === today.toDateString();
      const isSelected =
        currentDate.toDateString() === selectedDate.toDateString();

      days.push({
        date: currentDate,
        day: dayName,
        dateNum: dayNumber,
        isToday,
        isSelected,
      });
    }
    return days;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    const daysToAdd = direction === "next" ? 7 : -7;
    newDate.setDate(selectedDate.getDate() + daysToAdd);
    setSelectedDate(newDate);
  };

  const formatSelectedDate = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) {
      return (
        "TODAY, " +
        date
          .toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
          .toUpperCase()
      );
    }

    return date
      .toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
      .toUpperCase();
  };

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  return (
    <SafeAreaView
      className="bg-[#F3F4F7] flex-1 justify-center relative"
      edges={["top"]}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 50 }}
      >
        {/* Custom Background */}
        <View style={styles.upperContainer} />

        {/* Header */}
        <View className="flex-row items-center justify-between absolute top-5 left-0 right-0 px-4">
          <View>
            <Text style={styles.headerText}>NutriSight</Text>
          </View>

          <View className="flex-row gap-2">
            <View>
              <Image
                source={require("@/assets/images/default-profile.jpg")}
                className="w-10 h-10 rounded-full"
                resizeMode="cover"
              />
            </View>

            <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center bg-white relative">
              <Ionicons name="notifications-outline" size={24} color="gray" />

              {/* Badge */}
              <View className="absolute top-2.5 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View className="bg-transparent p-4 rounded-lg mx-4 absolute left-0 right-0 top-[70px] z-10">
          <View className="items-center flex-row justify-between">
            <View className="flex-col gap-1 justify-center items-center">
              <Text className="text-white text-4xl font-PoppinsSemiBold">
                467
              </Text>
              <Text className="font-Poppins text-white text-xs">
                Calories Taken
              </Text>
            </View>
            <View>
              <CustomCircularProgress />
            </View>
            <View className="flex-col gap-1 items-center justify-center">
              <Text className="text-white text-4xl font-PoppinsSemiBold">
                45
              </Text>
              <Text className="font-Poppins text-white text-xs">
                Calories Burned
              </Text>
            </View>
          </View>

          <View className="flex-col mt-6">
            <View>
              <Text className="text-white text-xs font-Poppins text-center mb-4">
                Nutritional Content Summary
              </Text>
            </View>

            <View className="flex-row justify-evenly px-4">
              {/* Carbs */}
              <View className="flex-col items-center justify-center gap-1">
                <Text className="text-white text-xs font-Poppins text-center uppercase tracking-wider">
                  CARBS
                </Text>
                <View className="w-16">
                  <Progress
                    min={62}
                    max={100}
                    height={2}
                    color="#30B0C7"
                    backgroundColor="rgba(255, 255, 255, 0.3)"
                  />
                </View>
                <Text className="text-white text-sm font-Poppins">124g</Text>
              </View>

              {/* Protein */}
              <View className="flex-col items-center justify-center gap-1">
                <Text className="text-white text-xs font-Poppins text-center uppercase tracking-wider">
                  PROTEIN
                </Text>
                <View className="w-16">
                  <Progress
                    min={15}
                    max={100}
                    height={2}
                    color="#FFD700"
                    backgroundColor="rgba(255, 255, 255, 0.3)"
                  />
                </View>
                <Text className="text-white text-sm font-Poppins">15g</Text>
              </View>

              {/* Fiber */}
              <View className="flex-col items-center justify-center gap-1">
                <Text className="text-white text-xs font-Poppins text-center uppercase tracking-wider">
                  FIBER
                </Text>
                <View className="w-16">
                  <Progress
                    min={4}
                    max={100}
                    height={2}
                    color="#FF6B6B"
                    backgroundColor="rgba(255, 255, 255, 0.3)"
                  />
                </View>
                <Text className="text-white text-sm font-Poppins">4g</Text>
              </View>
            </View>
          </View>

          <View className="justify-center items-center mt-4">
            <Ionicons name="chevron-down" size={24} color="white" />
          </View>
        </View>

        {/* Calendar Strip */}
        <View className="bg-transparent mx-4 mt-6 rounded-lg absolute left-0 right-0 top-[350px] z-10">
          {/* Header with month/year and navigation */}
          <View className="flex-row items-center justify-between px-4 border-b border-gray-100">
            <TouchableOpacity
              className="p-1"
              onPress={() => navigateWeek("prev")}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={20} color="#666" />
            </TouchableOpacity>

            <View className="flex-row items-center gap-2">
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text className="text-gray-700 font-PoppinsSemiBold text-sm">
                {formatSelectedDate(selectedDate)}
              </Text>
            </View>

            <TouchableOpacity
              className="p-1"
              onPress={() => navigateWeek("next")}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Days of week */}
          <View className="flex-row justify-between px-4 py-3">
            {generateWeekDays().map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleDateSelect(item.date)}
                className={`items-center justify-center w-10 h-16 rounded-lg ${
                  item.isSelected
                    ? "bg-white border border-black rounded-[15px]"
                    : ""
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-xs font-Poppins mb-1 ${
                    item.isSelected ? "text-black" : "text-gray-400"
                  }`}
                >
                  {item.day}
                </Text>
                <Text
                  className={`text-lg font-Poppins ${
                    item.isSelected ? "text-black" : "text-gray-400"
                  }`}
                >
                  {item.dateNum}
                </Text>

                <View
                  className={`w-1 h-1 ${
                    item.isToday ? "bg-black" : "bg-transparent"
                  } rounded-full mt-1`}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add Food Button */}
        <View className="flex-col gap-2 mx-4 mt-[470px]">
          {/* Breakfast */}
          {/* this design is only when the user meets the goal */}
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
                    Add Breakfast
                  </Text>

                  <View className="p-1 bg-[#2D3644] rounded-full items-center justify-items-center">
                    <Feather name="check" size={8} color="white" />
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="w-16">
                    <Progress
                      min={100}
                      max={100}
                      height={4}
                      color={colors.primary}
                      backgroundColor="rgba(0, 0, 0, 0.1)"
                    />
                  </View>
                  <Text style={styles.progressText}>768 / 768 kcal</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              className="p-2 rounded-full bg-transparent"
              onPress={() => router.push("/(root)/(meals)/breakfast")}
            >
              <Feather name="chevron-right" size={24} color="#a0a0a0" />
            </TouchableOpacity>
          </View>

          {/* Lunch */}
          <View className="bg-white rounded-md shadow-sm border border-gray-200 px-4 py-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={30}
                color="black"
              />

              <View className="flex-col">
                <Text className="text-black text-lg font-PoppinsMedium">
                  Add Lunch
                </Text>
                <View className="flex-row items-center gap-2">
                  <View className="w-16">
                    <Progress
                      min={0}
                      max={100}
                      height={4}
                      color={colors.primary}
                      backgroundColor="rgba(0, 0, 0, 0.1)"
                    />
                  </View>
                  <Text style={styles.progressText}>0 / 548 kcal</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity className="p-2 rounded-full bg-transparent border border-[#a0a0a0]">
              <Ionicons name="add" size={24} color="#a0a0a0" />
            </TouchableOpacity>
          </View>

          {/* Dinner */}
          <View className="bg-white rounded-md shadow-sm border border-gray-200 px-4 py-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={30}
                color="black"
              />

              <View className="flex-col">
                <Text className="text-black text-lg font-PoppinsMedium">
                  Add Dinner
                </Text>
                <View className="flex-row items-center gap-2">
                  <View className="w-16">
                    <Progress
                      min={0}
                      max={100}
                      height={4}
                      color={colors.primary}
                      backgroundColor="rgba(0, 0, 0, 0.1)"
                    />
                  </View>
                  <Text style={styles.progressText}>0 / 548 kcal</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity className="p-2 rounded-full bg-transparent border border-[#a0a0a0]">
              <Ionicons name="add" size={24} color="#a0a0a0" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-4 right-4">
        <TouchableOpacity
          className="flex-row items-center justify-between p-4 bg-[#2D3644] rounded-full"
          onPress={() => router.push("/(root)/main-camera")}
        >
          <View className="flex-row items-center gap-2">
            <Ionicons name="camera" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  upperContainer: {
    backgroundColor: colors.primary,
    position: "absolute",
    top: 0,
    left: -165,
    right: -165,
    height: 350,
    borderBottomLeftRadius: 350,
    borderBottomRightRadius: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 20,
  },
  headerText: {
    fontFamily: "Poppins",
    fontSize: 28,
    color: "white",
  },
  progressText: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: "#a0a0a0",
  },
});

export default memo(Home);
