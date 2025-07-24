import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Name() {
  const [name, setName] = useState("");
  const router = useRouter();

  const back = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={back}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Title */}
        <Text className="font-PoppinsSemiBold text-4xl mb-8">Edit name</Text>

        {/* Input Field */}
        <TextInput
          style={styles.input}
          placeholder="Enter name here"
          placeholderTextColor="#6E6B7B"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Done Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.doneButton, !name && styles.doneButtonDisabled]}
          disabled={!name}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  backArrow: {
    fontSize: 22,
    color: "#222",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 28,
  },
  input: {
    borderWidth: 2,
    borderColor: "#222",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: "#222",
  },
  bottomBar: {
    padding: 16,
    backgroundColor: "#fff",
  },
  doneButton: {
    backgroundColor: "#E5E4E6",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    opacity: 1,
  },
  doneButtonDisabled: {
    opacity: 0.5,
  },
  doneButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
