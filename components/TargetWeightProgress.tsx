import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import Typo from "./Typo";

import { memo } from "react";
import { LineChart } from "react-native-gifted-charts";

function TargetWeightProgress({
  lineData,
}: {
  lineData: { value: number; label: string; year: number }[];
}) {
  return (
    <>
      <View className="flex-row justify-between items-center mt-6 mb-2 mx-4">
        <Typo size={18} className="font-PoppinsSemiBold">
          Target Weight Monthly Progress
        </Typo>
        <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
      </View>
      <View className="bg-white rounded-2xl shadow-xl p-4">
        <View className="flex-col">
          <View>
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
        </View>
      </View>
    </>
  );
}

export default memo(TargetWeightProgress);
