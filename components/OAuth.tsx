import { Image, Text, View } from "react-native";

// custom components
import CustomButton from "./CustomButton";

// icons and images
import { icons } from "@/constants/index";
import { useAuth } from "@/context/AuthContext";
import { memo } from "react";

function OAuth() {
  const { signWithGoogle, loading } = useAuth();

  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-gray-100" />
        <Text className="text-lg text-gray-500">or continue with</Text>
        <View className="flex-1 h-[1px] bg-gray-100" />
      </View>

      <CustomButton
        title="Continue with Google"
        className="mt-5 w-full shadow-none"
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
        bgVariant="outline"
        textVariant="primary"
        disabled={loading}
        onPress={signWithGoogle}
      />
    </View>
  );
}

export default memo(OAuth);
