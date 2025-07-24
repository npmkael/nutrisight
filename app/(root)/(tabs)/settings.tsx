import Typo from "@/components/Typo";
import { Ionicons } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";

import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";

export default function Settings() {
  return (
    <View className="flex-1 pt-5">
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
        <Container className="px-4 py-4">
          <View className="flex-row gap-4 items-center">
            <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
              <Ionicons name="person" size={18} color="black" />
            </View>

            <View className="flex-1">
              <Link href="/(root)/(settings)/name" className=" gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="font-PoppinsMedium text-lg text-gray-500 mb-1">
                    Enter your name{" "}
                  </Text>
                  <Octicons name="pencil" size={16} color="black" />
                </View>
              </Link>
              <Text className="font-Poppins text-sm">21 years old</Text>
            </View>
          </View>
        </Container>
      </ScrollView>
    </View>
  );
}

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
