import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
  loading?: boolean;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = "Search for food...",
  loading = false,
  autoFocus = false,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`flex-row items-center bg-white rounded-2xl px-4 py-2 border ${
        isFocused ? "border-[#2D3644]" : "border-gray-200"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Ionicons
        name="search"
        size={20}
        color={isFocused ? "#2D3644" : "#9CA3AF"}
      />
      <TextInput
        className="flex-1 ml-3 font-Poppins text-gray-900"
        style={{ fontSize: 16 }}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus={autoFocus}
        returnKeyType="search"
      />
      {loading ? (
        <ActivityIndicator size="small" color="#10b981" />
      ) : value.length > 0 ? (
        <TouchableOpacity onPress={onClear} className="p-1">
          <Ionicons name="close-circle" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
