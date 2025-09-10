import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import CircularProgressBar from "./CircularProgressBar";

// Nutrition Card Component
interface NutritionCardProps {
  label: string;
  value: string;
  progress: number;
  color: string;
  icon: any;
  onEdit: () => void;
}

export const NutritionCard = memo(
  ({ label, value, progress, color, icon, onEdit }: NutritionCardProps) => (
    <Animated.View
      entering={FadeIn.duration(600)}
      className="bg-white p-4 rounded-2xl border border-border"
    >
      <View className="flex-row items-center gap-2 mb-3">
        <View className="flex-row items-center justify-center bg-[#F4F4F4] rounded-full p-2">
          <Image
            source={icon}
            className="w-5 h-5"
            style={{ tintColor: color }}
          />
        </View>
        <Text className="text-foreground font-PoppinsMedium text-sm">
          {label}
        </Text>
      </View>

      <View className="items-center mb-4">
        <CircularProgressBar
          progress={progress}
          size={80}
          strokeWidth={6}
          color={color}
          backgroundColor="rgba(0,0,0,0.1)"
          showPercentage={false}
        />
        <View className="absolute inset-0 flex-1 justify-center items-center">
          <Text className="text-md font-PoppinsSemiBold text-gray-900">
            {value}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onEdit}
        className="absolute bottom-3 right-3 p-1"
      >
        <MaterialCommunityIcons name="pencil" size={20} color="#000" />
      </TouchableOpacity>
    </Animated.View>
  )
);
