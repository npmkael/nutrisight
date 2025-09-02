import BMIClassification from "@/components/BMIClassification";
import DietSummary from "@/components/DietSummary";
import TargetWeightProgress from "@/components/TargetWeightProgress";
import Typo from "@/components/Typo";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { memo, useCallback } from "react";
import { Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "../../../components/Loading";

function Progress() {
  const { user, loading } = useAuth();

  if (loading && !user) {
    return <Loading />;
  }

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  const redirectToLogWeight = useCallback(() => {
    router.push("/(root)/log-weight");
  }, []);

  return (
    <SafeAreaView className="bg-white flex-1" edges={["top"]}>
      {/* <StatusBar style="dark" /> */}
      {/* Fixed Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-transparent">
        <Typo size={24} className="font-PoppinsSemiBold">
          My Progress
        </Typo>
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
            source={
              user.profileLink
                ? { uri: user.profileLink }
                : require("@/assets/images/sample-profile.jpg")
            }
            resizeMethod="scale"
            resizeMode="contain"
            className="w-[65px] h-[65px] rounded-full absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-1/2 border-4 border-white shadow-lg"
          />

          <View className="px-4 py-4">
            <Typo size={18} className="font-PoppinsSemiBold text-center mt-6">
              {user.firstName}
            </Typo>
            <View className="h-[1px] bg-gray-200 w-full mb-2" />
            <View className="flex-row items-center justify-evenly">
              <View className="flex-col items-center">
                <Typo size={12} className="font-Poppins">
                  Current Weight
                </Typo>
                <Typo size={16} className="font-PoppinsSemiBold">
                  {user.weight ? `${user.weight} kg` : "N/A"}
                </Typo>
              </View>
              <View className="flex-col items-center">
                <Typo size={12} className="font-Poppins">
                  Current BMI
                </Typo>
                <Typo size={16} className="font-PoppinsSemiBold">
                  {user.bmi ? user.bmi.toFixed(2) : "N/A"}
                </Typo>
              </View>
              <View className="flex-col items-center">
                <Typo size={12} className="font-Poppins">
                  Target Weight
                </Typo>
                <Typo size={16} className="font-PoppinsSemiBold">
                  {user.targetWeight ? `${user.targetWeight} kg` : "N/A"}
                </Typo>
              </View>
            </View>
          </View>
        </View>

        {/* BMI Classification Card */}
        <BMIClassification
          bmi={user.bmi ? Number(user.bmi.toFixed(2)) : 0}
          onLogWeight={redirectToLogWeight}
          name={user.firstName}
        />

        {/* Target Weight Progress Card */}
        <TargetWeightProgress lineData={user.loggedWeights || []} />

        {/* Diet Summary Card */}
        <DietSummary totalCalories={1000} user={user} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default memo(Progress);
