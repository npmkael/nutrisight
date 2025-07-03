import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Account() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text className="text-red-500 font-bold text-2xl">Account</Text>
    </SafeAreaView>
  );
}
