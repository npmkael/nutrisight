import React from "react";
import { Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const Onboarding = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className="text-4xl font-bold">Onboarding</Text>
    </SafeAreaView>
  );
};

export default Onboarding;
