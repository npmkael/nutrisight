import { icons } from "@/constants";
import { useRouter } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";

export default function BackHeader() {
  const router = useRouter();

  return (
    <View className="flex-row items-center px-4 py-2">
      <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
        <Image
          source={icons.backArrow}
          className="w-6 h-6"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}
