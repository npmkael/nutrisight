import CustomButton from "@/components/CustomButton";
import TextInputField from "@/components/TextInputField";
import { icons } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { memo, useCallback, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ProteinBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  currentValue: string;
  onSave: (value: string) => void;
  onClose: () => void;
}

function ProteinBottomSheet({
  bottomSheetRef,
  currentValue,
  onSave,
  onClose,
}: ProteinBottomSheetProps) {
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
    if (value.trim()) {
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
    const newValue = Math.min(currentNum + 10, 300);
    setValue(newValue.toString());
  }, [value]);

  const handleDecrement = useCallback(() => {
    const currentNum = parseFloat(value) || 0;
    const newValue = Math.max(currentNum - 10, 0);
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
              <Image
                source={icons.protein}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text className="text-xl font-PoppinsSemiBold text-gray-900">
                Edit Protein
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
            Protein (grams)
          </Text>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={handleDecrement}
              className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center"
            >
              <Ionicons name="remove" size={24} color="#000" />
            </TouchableOpacity>

            <View className="flex-1">
              <TextInputField
                value={value}
                onChangeText={handleValueChange}
                placeholderText="Enter grams"
                keyboardType="numeric"
                maxLength={4}
              />
            </View>

            <TouchableOpacity
              onPress={handleIncrement}
              className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center"
            >
              <Ionicons name="add" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <View className="mt-auto">
          <CustomButton
            title="Save Changes"
            onPress={handleSave}
            disabled={!value.trim()}
            className={!value.trim() ? "opacity-50" : ""}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

export default memo(ProteinBottomSheet);
