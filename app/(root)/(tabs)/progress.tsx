import BMIClassification from "@/components/BMIClassification";
import DietSummary from "@/components/DietSummary";
import InfoTooltip from "@/components/InfoTooltip";
import TargetWeightChart from "@/components/target-weight-chart";
import Typo from "@/components/Typo";
import { LoggedWeight, useAuth } from "@/context/AuthContext";
import { setPrecisionIfNotInteger } from "@/utils/helpers";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { memo, useCallback, useMemo } from "react";
import { Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "../../../components/Loading";

// Generate dummy data for demonstration (30 days of weight tracking)
const generateDummyWeightData = (): LoggedWeight[] => {
  const dummyData: LoggedWeight[] = [];
  const today = new Date();
  const startWeight = 85.0; // Starting at 85kg
  const targetWeight = 75.0; // Target is 75kg

  // Generate data for the past 30 days with realistic weight loss progression
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simulate realistic weight loss with daily fluctuations
    // Average loss of ~0.5kg per week (healthy rate)
    const weeksPassed = (30 - i) / 7;
    const baseWeight = startWeight - weeksPassed * 0.5;

    // Add realistic daily fluctuations (±0.3kg)
    const fluctuation = (Math.random() - 0.5) * 0.6;
    const weight = baseWeight + fluctuation;

    // Only add data for some days (not every day) for more realistic tracking
    if (Math.random() > 0.3) {
      // ~70% chance of logging weight each day
      dummyData.push({
        value: parseFloat(weight.toFixed(1)),
        date: date.toISOString(),
      });
    }
  }

  return dummyData;
};

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

  // Use dummy data if no real data exists, otherwise use real data
  const dummyData = useMemo(() => generateDummyWeightData(), []);
  const loggedWeights =
    user.loggedWeights && user.loggedWeights.length > 0
      ? user.loggedWeights
      : dummyData;

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <LinearGradient
        colors={["rgba(236, 190, 88, 0.08)", "rgba(54, 102, 157, 0.08)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        locations={[0, 0.5, 1]}
        className="flex-1"
      >
        {/* <StatusBar style="dark" /> */}
        {/* Fixed Header */}
        <View className="flex-row items-center justify-between px-5 py-4 bg-transparent">
          <Typo size={24} className="font-PoppinsSemiBold text-white">
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
                  : require("@/assets/images/default-profile.jpg")
              }
              resizeMethod="scale"
              resizeMode="contain"
              className="w-[65px] h-[65px] rounded-full absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-1/2 border-4 border-white shadow-lg"
            />

            <View className="px-4 py-4">
              <Typo size={18} className="font-PoppinsSemiBold text-center mt-6">
                {user.name}
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
                    {user.bmi ? setPrecisionIfNotInteger(user.bmi) : "N/A"}
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
            bmi={user.bmi ? setPrecisionIfNotInteger(user.bmi) : 0}
            onLogWeight={redirectToLogWeight}
            name={user.firstName}
            profileImageUrl={user.profileLink}
          />

          <View className="flex-row justify-between items-center mt-6 mb-2 mx-4">
            <Typo size={18} className="font-PoppinsSemiBold">
              Weight Progress Tracker
            </Typo>
            <InfoTooltip
              title="Weight Progress Tracker"
              content="Track your weight changes with weekly bar charts or monthly line graphs. The weekly view shows daily entries, while the monthly view displays trends over time. Toggle between views to see your progress from different perspectives. The dashed line represents your target weight goal."
            />
          </View>

          <View className="bg-white rounded-lg p-4 shadow-xl">
            <TargetWeightChart
              loggedWeights={loggedWeights}
              targetWeight={user.targetWeight || 75}
            />
          </View>

          {/* Diet Summary Card */}
          <DietSummary totalCalories={1000} user={user} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

export default memo(Progress);
