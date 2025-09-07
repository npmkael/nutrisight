import { memo, useState } from "react";
import { TextInput } from "react-native";

function TextInputField({
  value,
  onChangeText,
  maxLength,
  keyboardType = "numeric",
  editable = true,
  placeholderText = "",
}: {
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
  keyboardType?: "numeric" | "default";
  editable?: boolean;
  placeholderText?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      className={`bg-[#FAFAFA] rounded-lg p-4 text-black font-Poppins flex-1 border  ${
        isFocused ? "border-primary-500" : "border-border"
      }`}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      maxLength={maxLength}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={placeholderText}
      placeholderTextColor="#a0a0a0"
      editable={editable}
    />
  );
}

export default memo(TextInputField);
