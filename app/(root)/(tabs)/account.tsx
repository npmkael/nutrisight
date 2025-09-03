import Typo from "@/components/Typo";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
      <View className="flex-row items-center justify-between px-5 py-4 bg-transparent">
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
          <TouchableOpacity
            className="flex-row items-center justify-between gap-2"
            onPress={() => router.push("/(root)/(settings)/details")}
          >
            <View className="flex-row items-center gap-4">
              <View>
                <Image
                  source={require("../../../assets/images/sample-profile.jpg")}
                  className="w-16 h-16 rounded-full"
                />
              </View>
              <View className="flex-col gap-1">
                <Text className="text-md font-PoppinsSemiBold">
                  {user.name ? user.name : "N/A"}
                </Text>
                <Text className="text-sm font-Poppins text-gray-500">
                  {user.email ? user.email : "No email"}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={14} color="grey" />
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
          Version 1.0.0
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
