import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface IngredientProps {
  name: string;
  onDelete: () => void;
}

export const Ingredient = ({ name, onDelete }: IngredientProps) => {
  return (
    <View className="flex-row items-center justify-between rounded-xl border border-border p-4">
      <Text className="font-PoppinsSemiBold text-lg text-black">{name}</Text>
      <TouchableOpacity onPress={onDelete}>
        <Ionicons name="trash-outline" size={16} color="black" />
      </TouchableOpacity>
    </View>
  );
};
