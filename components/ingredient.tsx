import { capitalizeFirstLetter } from "@/utils/helpers";
import { Text, View } from "react-native";

interface IngredientProps {
  name: string;
  allergen?: string[];
  // onDelete: () => void;
}

export const Ingredient = ({ name, allergen }: IngredientProps) => {
  return (
    <View className="flex-row items-center justify-between rounded-xl border border-border p-4">
      <View className="flex-1">
        <Text className="font-PoppinsSemiBold text-lg text-black">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </Text>
        {allergen && allergen.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 4,
            }}
          >
            {allergen.map((a, idx) => (
              <View
                key={idx}
                className="bg-[#FFA4A4] px-3 py-1 rounded-xl"
                style={{ marginRight: 4, marginBottom: 4 }}
              >
                <Text className="font-Poppins text-black">
                  {capitalizeFirstLetter(a)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      {/* <TouchableOpacity onPress={onDelete}>
        <Ionicons name="trash-outline" size={16} color="black" />
      </TouchableOpacity> */}
    </View>
  );
};
