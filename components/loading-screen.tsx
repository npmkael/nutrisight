import { ActivityIndicator, Image, View } from "react-native";

const LoadingScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-[#2D3644]">
      <View className="flex-1 items-center justify-center">
        <Image
          source={require("@/assets/images/adaptive-icon.png")}
          className="w-60 h-60"
        />
      </View>
      <ActivityIndicator size={40} color="#fff" className="mb-12" />
    </View>
  );
};

export default LoadingScreen;
