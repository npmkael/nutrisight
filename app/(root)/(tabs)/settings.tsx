import Typo from "@/components/Typo";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";

import { Link, useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { memo } from "react";
import Loading from "../../../components/Loading";

function Settings() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading && !user) return <Loading />;

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={["top"]}>
      {/* Fixed Header */}
      <View className="flex-row items-center justify-between px-5 py-5 bg-transparent">
        <Typo size={24} className="font-PoppinsSemiBold">
          Settings
        </Typo>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
      >
        <Container className="px-4 py-4 mb-6">
          <View className="flex-row gap-4 items-center">
            <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
              <Ionicons name="person" size={18} color="black" />
            </View>

            <View className="flex-1">
              <Link href="/(root)/(settings)/name" className=" gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="font-PoppinsMedium text-lg text-gray-500 mb-1">
                    {user.name ? `${user.name}` : "Enter your name"}
                  </Text>
                  <Octicons name="pencil" size={10} color="black" />
                </View>
              </Link>
              <Text className="font-Poppins text-sm">
                {user.age ? `${user.age} years old` : "Age: N/A"}
              </Text>
            </View>
          </View>
        </Container>

        <Container className="px-4 py-4 mb-6">
          <TouchableOpacity
            className="flex-row items-center justify-between gap-2"
            onPress={() => router.push("/(root)/(settings)/details")}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="person" size={18} color="black" />
              <Text className="text-sm font-Poppins">Personal details</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="grey" />
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200 my-4" />

          <TouchableOpacity className="flex-row items-center justify-between gap-2">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="adjust" size={18} color="black" />
              <Text className="text-sm font-Poppins">
                Adjust macronutrients
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="grey" />
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200 my-4" />

          <TouchableOpacity className="flex-row items-center justify-between gap-2">
            <View className="flex-row items-center gap-2">
              <Ionicons name="flag" size={18} color="black" />
              <Text className="text-sm font-Poppins">
                Goal & current weight
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="grey" />
          </TouchableOpacity>
        </Container>

        <Container className="px-4 py-4 mb-6">
          <TouchableOpacity className="flex-row items-center justify-between gap-2">
            <View className="flex-row items-center gap-2">
              <Ionicons name="document-text" size={18} color="black" />
              <Text className="text-sm font-Poppins">Terms and Conditions</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="grey" />
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200 my-4" />

          <TouchableOpacity className="flex-row justify-between items-center gap-2">
            <View className="flex-row items-center gap-2">
              <Ionicons name="shield" size={18} color="black" />
              <Text className="text-sm font-Poppins">Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="grey" />
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200 my-4" />

          <TouchableOpacity className="flex-row items-center justify-between gap-2">
            <View className="flex-row items-center gap-2">
              <Feather name="mail" size={18} color="black" />
              <Text className="text-sm font-Poppins">Support Email</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="grey" />
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200 my-4" />

          <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={() =>
              Alert.alert(
                "Delete Account",
                "Are you sure you want to delete your account?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", onPress: () => console.log("Delete") },
                ]
              )
            }
          >
            <Feather name="user-minus" size={18} color="black" />
            <Text className="text-sm font-Poppins">Delete Account</Text>
          </TouchableOpacity>
        </Container>

        <Container className="px-4 py-4 mb-6">
          <TouchableOpacity
            onPress={logout}
            className="flex-row items-center gap-2"
          >
            <MaterialIcons name="logout" size={18} color="black" />
            <Text className="text-sm font-Poppins">Logout</Text>
          </TouchableOpacity>
        </Container>

        <Text className="text-sm font-Poppins text-center uppercase">
          Version 0.0.1
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default memo(Settings);

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <View className={`bg-white rounded-2xl shadow-sm ${className}`}>
      {children}
    </View>
  );
};
