import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import Typo from "./Typo";

import { LineChart } from "react-native-gifted-charts";

export default function TargetWeightProgress() {
  const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }];

  return (
    <>
      <View className="flex-row justify-between items-center mt-6 mb-2 mx-4">
        <Typo size={18} className="font-PoppinsSemiBold">
          Target Weight Progress
        </Typo>
        <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
      </View>
      <View className="bg-white rounded-2xl shadow-xl p-4">
        <LineChart data={data} />
      </View>
    </>
  );
}
