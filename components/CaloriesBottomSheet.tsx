import CustomButton from "@/components/CustomButton";
import TextInputField from "@/components/TextInputField";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { memo, useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CaloriesBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  currentValue: string;
  onSave: (value: string) => void;
  onClose: () => void;
}

function CaloriesBottomSheet({
  bottomSheetRef,
  currentValue,
  onSave,
  onClose,
}: CaloriesBottomSheetProps) {
  const [value, setValue] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize value when currentValue changes
  React.useEffect(() => {
    if (currentValue && !isInitialized) {
      setValue(currentValue);
      setIsInitialized(true);
    }
  }, [currentValue, isInitialized]);

  const snapPoints = React.useMemo(() => ["40%"], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const handleSave = useCallback(() => {
    const numValue = parseFloat(value);
    if (value.trim() && !isNaN(numValue) && numValue > 0) {
      onSave(value);
      bottomSheetRef.current?.close();
      onClose();
      setIsInitialized(false);
    }
  }, [value, onSave, onClose, bottomSheetRef]);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    onClose();
    setIsInitialized(false);
  }, [onClose, bottomSheetRef]);

  const handleValueChange = useCallback((newValue: string) => {
    // Only allow numbers and decimal points
    const numericValue = newValue.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    const parts = numericValue.split(".");
    if (parts.length > 2) {
      return;
    }

    setValue(numericValue);
  }, []);

  const handleIncrement = useCallback(() => {
    const currentNum = parseFloat(value) || 0;
    const newValue = Math.min(currentNum + 50, 5000);
    setValue(newValue.toString());
  }, [value]);

  const handleDecrement = useCallback(() => {
    const currentNum = parseFloat(value) || 0;
    const newValue = Math.max(currentNum - 50, 0);
    setValue(newValue.toString());
  }, [value]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={-1}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      onClose={handleClose}
    >
      <BottomSheetView style={{ flex: 1, padding: 20 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-2xl items-center justify-center bg-gray-100">
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={24}
                color="black"
              />
            </View>
            <View>
              <Text className="text-xl font-PoppinsSemiBold text-gray-900">
                Edit Calories
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleClose}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
          >
            <Ionicons name="close" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Input Section */}
        <View className="mb-6">
          <Text className="text-foreground text-sm font-Poppins mb-3">
            Calories (kcal)
          </Text>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={handleDecrement}
              className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center"
            >
              <Ionicons name="remove" size={24} color="#374151" />
            </TouchableOpacity>

            <View className="flex-1">
              <TextInputField
                value={value}
                onChangeText={handleValueChange}
                placeholderText="Enter calories"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <TouchableOpacity
              onPress={handleIncrement}
              className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center"
            >
              <Ionicons name="add" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <View className="mt-auto">
          <CustomButton
            title="Save Changes"
            onPress={handleSave}
            disabled={
              !value.trim() ||
              parseFloat(value) <= 0 ||
              isNaN(parseFloat(value))
            }
            className={
              !value.trim() ||
              parseFloat(value) <= 0 ||
              isNaN(parseFloat(value))
                ? "opacity-50"
                : ""
            }
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

export default memo(CaloriesBottomSheet);
