import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
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
        borderRadius: height,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={{
          height,
          width: "100%",
          borderRadius: height,
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
  const size = 120;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Calculate progress: 439 out of 822 = 53.4%
  const progress = (455 / 822) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Add padding for markers to prevent clipping
  const svgSize = size + 16; // 8px padding on each side
  const centerOffset = 8; // Half of the padding

  return (
    <View className="items-center justify-center">
      <Svg width={svgSize} height={svgSize}>
        {/* Background circle */}
        <Circle
          cx={size / 2 + centerOffset}
          cy={size / 2 + centerOffset}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="white"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2 + centerOffset}
          cy={size / 2 + centerOffset}
          r={radius}
          stroke="#FEA252"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2 + centerOffset} ${size / 2 + centerOffset})`}
        />
        {/* Start marker */}
        <Circle
          cx={size / 2 + centerOffset}
          cy={strokeWidth / 2 + centerOffset}
          r={8}
          fill="white"
          stroke="#FEA252"
          strokeWidth={1}
        />
        {/* End marker */}
        <Circle
          cx={
            size / 2 +
            centerOffset +
            radius * Math.cos((progress / 100) * 2 * Math.PI - Math.PI / 2)
          }
          cy={
            size / 2 +
            centerOffset +
            radius * Math.sin((progress / 100) * 2 * Math.PI - Math.PI / 2)
          }
          r={8}
          fill="white"
          stroke="#FEA252"
          strokeWidth={1}
        />
      </Svg>

      {/* Center text */}
      <View className="absolute items-center justify-center">
        <Text className="text-black text-3xl font-PoppinsBold">439</Text>
        <Text className="text-gray-500 text-sm font-Poppins">of 822</Text>
        <Text className="text-gray-500 text-sm font-Poppins">Consumed</Text>
      </View>
    </View>
  );
};

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading && !user) {
    return <Loading />;
  }

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  return (
    <SafeAreaView className="bg-[#FAFAFA] flex-1 px-5" edges={["top"]}>
      <View className="flex-row items-center justify-between py-5 bg-transparent">
        {/* Profile and Welcome message */}
        <View className="flex-row items-center justify-center gap-2">
          <Image
            source={
              user.profileLink
                ? { uri: user.profileLink }
                : require("@/assets/images/sample-profile.jpg")
            }
            resizeMethod="scale"
            resizeMode="contain"
            className="w-12 h-12 rounded-full"
          />
          <View className="flex-col items-start justify-center">
            <Text className="text-gray-500 text-base font-PoppinsMedium">
              Welcome,
            </Text>
            <Text className="text-black text-2xl font-PoppinsBold">
              {user.name}!
            </Text>
          </View>
        </View>

        <TouchableOpacity className="w-10 h-10 rounded-full bg-white items-center justify-center">
          <Ionicons name="person-outline" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Today's Status */}
      <Text className="text-black text-2xl font-PoppinsBold mt-5">
        Today's Status
      </Text>

      <View className="bg-white shadow-sm border-[1px] border-gray-200 rounded-3xl p-4 mt-4 mb-4 flex-row items-center">
        <View className="mr-4">
          <CustomCircularProgress />
        </View>
        <View className="flex-col flex-1">
          <View className="mb-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-PoppinsMedium">Protein</Text>
              <Text className="font-Poppins text-xs">20g / 50g</Text>
            </View>
            <Progress
              min={1}
              max={10}
              height={5}
              color="#9CE3D4"
              backgroundColor="#E1FAF2"
            />
          </View>

          <View className="mb-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-PoppinsMedium">Fat</Text>
              <Text className="font-Poppins text-xs">20g / 28g</Text>
            </View>
            <Progress
              min={5}
              max={10}
              height={5}
              color="#FAC85F"
              backgroundColor="#FFF1D8"
            />
          </View>

          <View className="mb-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-PoppinsMedium">Carbs</Text>
              <Text className="font-Poppins text-xs">20g / 50g</Text>
            </View>
            <Progress
              min={8}
              max={10}
              height={5}
              color="#77A5ED"
              backgroundColor="#DAE8FC"
            />
          </View>
        </View>
      </View>

      <View className="flex-col flex-1">
        <View className="bg-white shadow-sm border-[1px] border-gray-200 flex-row items-center p-4 rounded-xl mb-4">
          <View className="flex-row items-center justify-center w-[50px] h-[50px] rounded-full bg-[#FFF5ED] mr-4">
            <Ionicons name="restaurant-outline" size={24} color="black" />
          </View>

          <View className="flex-col">
            <Text className="font-PoppinsSemiBold text-black text-md">
              Add Breakfast
            </Text>
            <Text className="font-Poppins text-black text-sm">
              Recommended: 440 - 615 kcal
            </Text>
          </View>

          <TouchableOpacity className="bg-white w-[30px] h-[30px] rounded-full border-black border-[1px] items-center justify-center ml-auto">
            <Ionicons name="add-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View className="bg-white shadow-sm border-[1px] border-gray-200  flex-row items-center p-4 rounded-xl mb-4">
          <View className="flex-row items-center justify-center w-[50px] h-[50px] rounded-full bg-[#D9E3FB] mr-4">
            <Ionicons name="restaurant-outline" size={24} color="black" />
          </View>

          <View className="flex-col">
            <Text className="font-PoppinsSemiBold text-black text-md">
              Add Lunch
            </Text>
            <Text className="font-Poppins text-black text-sm">
              Recommended: 527 - 703 kcal
            </Text>
          </View>

          <TouchableOpacity className="bg-white w-[30px] h-[30px] rounded-full border-black border-[1px] items-center justify-center ml-auto">
            <Ionicons name="add-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View className="bg-white shadow-sm border-[1px] border-gray-200 flex-row items-center p-4 rounded-xl mb-4">
          <View className="flex-row items-center justify-center w-[50px] h-[50px] rounded-full bg-[#DCEAE5] mr-4">
            <Ionicons name="restaurant-outline" size={24} color="black" />
          </View>

          <View className="flex-col">
            <Text className="font-PoppinsSemiBold text-black text-md">
              Add Dinner
            </Text>
            <Text className="font-Poppins text-black text-sm">
              Recommended: 440 - 615 kcal
            </Text>
          </View>

          <TouchableOpacity className="bg-white w-[30px] h-[30px] rounded-full border-black border-[1px] items-center justify-center ml-auto">
            <Ionicons name="add-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
