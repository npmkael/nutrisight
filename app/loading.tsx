import React from "react";
import { Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const Loading = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className="text-4xl font-bold">Loading...</Text>
    </SafeAreaView>
  );
};

export default Loading;
