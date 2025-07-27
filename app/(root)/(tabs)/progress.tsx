import BMIClassification from "@/components/BMIClassification";
import DietSummary from "@/components/DietSummary";
import TargetWeightProgress from "@/components/TargetWeightProgress";
import Typo from "@/components/Typo";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

export default function Progress() {
  return (
    <LinearGradient
      className="flex-1 pt-5"
      colors={["#E1DADA", "#BDCAD9", "#F3F4F7"]}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Fixed Header */}
      <View className="flex-row items-center justify-between px-5 py-5 bg-transparent">
        <Typo size={24} className="font-PoppinsSemiBold">
          My Progress
        </Typo>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-white border-gray-200 border-2 items-center justify-center">
          <Ionicons name="person-outline" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
      >
        {/* Profile Card with weight, bmi, and target weight */}
        <View className="bg-white rounded-2xl relative shadow-xl mt-6">
          {/* Profile */}

          <Image
            source={require("@/assets/images/sample-profile.jpg")}
            resizeMethod="scale"
            resizeMode="contain"
            className="w-[65px] h-[65px] rounded-full absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-1/2 border-4 border-white shadow-lg"
          />

          <View className="px-4 py-4">
            <Typo size={18} className="font-PoppinsSemiBold text-center mt-6">
              Rencie Narido
            </Typo>
            <View className="h-[1px] bg-gray-200 w-full mb-2" />
            <View className="flex-row items-center justify-evenly">
              <View className="flex-col items-center">
                <Typo size={12} className="font-Poppins">
                  Current Weight
                </Typo>
                <Typo size={16} className="font-PoppinsSemiBold">
                  68kg
                </Typo>
              </View>
              <View className="flex-col items-center">
                <Typo size={12} className="font-Poppins">
                  Current BMI
                </Typo>
                <Typo size={16} className="font-PoppinsSemiBold">
                  19.45
                </Typo>
              </View>
              <View className="flex-col items-center">
                <Typo size={12} className="font-Poppins">
                  Target Weight
                </Typo>
                <Typo size={16} className="font-PoppinsSemiBold">
                  190kg
                </Typo>
              </View>
            </View>
          </View>
        </View>

        {/* BMI Classification Card */}
        <BMIClassification
          bmi={19.45}
          onLogWeight={() => {}}
          name="Rencie Narido"
        />

        {/* Target Weight Progress Card */}
        <TargetWeightProgress />

        {/* Diet Summary Card */}
        <DietSummary />
      </ScrollView>
    </LinearGradient>
  );
}
