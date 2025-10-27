import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function InfoCard({
  title,
  content,
  className,
}: {
  title: string;
  content: string;
  className?: string;
}) {
  return (
    <View className={`bg-blue-50 p-4 rounded-2xl mb-8 ${className}`}>
      <View className="flex-row items-center mb-2">
        <Ionicons name="information-circle" size={20} color="#3B82F6" />
        <Text className="text-sm font-PoppinsSemiBold text-blue-900 ml-2">
          {title}
        </Text>
      </View>
      <Text className="text-sm font-Poppins text-blue-800 leading-5">
        {content}
      </Text>
    </View>
  );
}
