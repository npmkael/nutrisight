import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <View className={`bg-white rounded-xl shadow-sm ${className}`}>
      {children}
    </View>
  );
};

export default function Details() {
  const [name, setName] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  const back = () => {
    router.back();
  };

  // Format allergens display - show first 4, then "..." if more
  const formatAllergens = () => {
    if (!user?.allergens || user.allergens.length === 0) {
      return "None";
    }

    if (user.allergens.length <= 4) {
      return user.allergens.join(", ");
    }

    return user.allergens.slice(0, 4).join(", ") + ", ...";
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fafafa" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* Header with Back Button and Title */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={back}>
            <Ionicons name="arrow-back" size={18} color="black" />
          </TouchableOpacity>

          <Text
            style={styles.titleText}
            className="font-PoppinsSemiBold text-2xl"
          >
            Personal details
          </Text>
        </View>

        <Container className="px-4 py-2 mb-6">
          <View className="flex-row justify-between items-center">
            <View className="flex-col gap-1">
              <Text className="font-Poppins text-sm text-gray-400">
                Goal Weight
              </Text>
              <Text className="font-PoppinsSemiBold text-sm text-black">
                129 lbs
              </Text>
            </View>
            <TouchableOpacity className="bg-black rounded-full px-2 py-1">
              <Text className="font-Poppins text-white text-[10px]">
                Change Goal
              </Text>
            </TouchableOpacity>
          </View>
        </Container>

        <Container className="px-4 py-4 mb-6">
          <TouchableOpacity
            className="flex-row items-center justify-between gap-2"
            onPress={() => router.push("/(root)/(settings)/weight")}
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-sm font-Poppins">Current Weight</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="font-PoppinsSemiBold text-sm">
                {user?.weight || "60"} lbs
              </Text>
              <Ionicons name="pencil" size={14} color="#E4E4E4" />
            </View>
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200 my-[10px]" />

          <TouchableOpacity
            className="flex-row justify-between items-center gap-2"
            onPress={() => router.push("/(root)/(settings)/height")}
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-sm font-Poppins">Height</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="font-PoppinsSemiBold text-sm">
                {user?.height || "182"} cm
              </Text>
              <Ionicons name="pencil" size={14} color="#E4E4E4" />
            </View>
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200 my-[10px]" />

          <TouchableOpacity
            className="flex-row justify-between items-center gap-2"
            onPress={() => router.push("/(root)/(settings)/age")}
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-sm font-Poppins">Age</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="font-PoppinsSemiBold text-sm">
                {user?.birthdate
                  ? Math.floor(
                      (new Date().getTime() -
                        new Date(user.birthdate).getTime()) /
                        (1000 * 60 * 60 * 24 * 365.25)
                    )
                  : "23"}
              </Text>
              <Ionicons name="pencil" size={14} color="#E4E4E4" />
            </View>
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200 my-[10px]" />

          <TouchableOpacity
            className="flex-row justify-between items-center gap-2"
            onPress={() => router.push("/(root)/(settings)/gender")}
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-sm font-Poppins">Gender</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="font-PoppinsSemiBold text-sm">
                {user?.gender || "Male"}
              </Text>
              <Ionicons name="pencil" size={14} color="#E4E4E4" />
            </View>
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200 my-[10px]" />

          <TouchableOpacity
            className="flex-row justify-between items-center gap-2"
            onPress={() => router.push("/(root)/(settings)/allergens")}
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-sm font-Poppins">Allergens</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text
                className="font-PoppinsSemiBold text-sm"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {formatAllergens()}
              </Text>
              <Ionicons name="pencil" size={14} color="#E4E4E4" />
            </View>
          </TouchableOpacity>
        </Container>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    position: "relative",
  },
  backButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#EAEAEA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  titleText: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
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
    backgroundColor: "#FAFAFA",
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
