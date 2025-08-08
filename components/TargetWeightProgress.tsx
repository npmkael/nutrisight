import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Typo from "./Typo";

import { memo } from "react";
import { LineChart } from "react-native-gifted-charts";

function TargetWeightProgress() {
  const lineData = [
    { value: 45, label: "Jan" },
    { value: 55, label: "Feb" },
    { value: 35, label: "Mar" },
    { value: 50, label: "Apr" },
    { value: 70, label: "May" },
  ];

  return (
    <>
      <View className="flex-row justify-between items-center mt-6 mb-2 mx-4">
        <Typo size={18} className="font-PoppinsSemiBold">
          Target Weight Progress
        </Typo>
        <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
      </View>
      <View className="bg-white rounded-2xl shadow-xl p-4">
        <View className="flex-col">
          <View className="mb-7">
            <LineChart
              data={lineData}
              thickness={2}
              width={200}
              color="#27A5C6" // light blue line
              hideRules={false}
              rulesColor="#E5E5E5"
              rulesType="solid"
              yAxisTextStyle={{ color: "#555", fontSize: 12 }}
              xAxisLabelTextStyle={{ color: "#555", fontSize: 12 }}
              dataPointsColor="#27A5C6"
              dataPointsRadius={3}
              noOfSections={5}
              yAxisLabelSuffix="kg"
              yAxisLabelWidth={40}
              backgroundColor="#fff"
              xAxisColor="transparent"
              yAxisColor="transparent"
              showVerticalLines
              verticalLinesColor="#eee"
              verticalLinesThickness={1}
              spacing={40}
              isAnimated
            />
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="font-Poppins text-gray-400 text-sm">
              Current Weight
            </Text>
            <Text className="font-PoppinsSemiBold text-sm">68kg</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="font-Poppins text-gray-400 text-sm mb-2">
              Target Weight
            </Text>
            <Text className="font-PoppinsSemiBold text-sm">198kg</Text>
          </View>

          <View className="w-full h-[1px] bg-gray-200 rounded-full" />

          <View className="flex-row justify-between items-center mt-2">
            <Text className="font-Poppins text-gray-400 text-sm">To gain</Text>
            <Text className="font-PoppinsSemiBold text-sm">52kg</Text>
          </View>
        </View>
      </View>
    </>
  );
}

export default memo(TargetWeightProgress);
