import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Progress() {
  return (
    <>
      <View className="bg-blue-500 rounded-full w-[300px] h-[300px] absolute right-0" />
      <View />
      <SafeAreaView className="flex-1 items-center justify-center"></SafeAreaView>
    </>
  );
}
