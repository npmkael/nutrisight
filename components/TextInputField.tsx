import { memo, useState } from "react";
import { TextInput } from "react-native";

function TextInputField({
  value,
  onChangeText,
  maxLength,
  keyboardType = "numeric",
  editable = true,
}: {
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
  keyboardType?: "numeric" | "default";
  editable?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      className={`bg-[#F5F5F5] rounded-lg p-4 text-black font-Poppins flex-1 border  ${
        isFocused ? "border-primary-500" : "border-gray-300"
      }`}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      maxLength={maxLength}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      editable={editable}
    />
  );
}

export default memo(TextInputField);
