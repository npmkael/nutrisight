import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

export const CustomCircularProgress = ({
  progress = 50,
  calorieGoal = 1000,
}: {
  progress?: number;
  calorieGoal?: number;
}) => {
  const size = 140;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Calculate progress: assuming 70% progress for the goal
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        {/* Background circle with dashed style */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray="6 4"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="white"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* Center content */}
      <View className="absolute items-center justify-center">
        <Text
          className=" text-white"
          style={{
            fontSize: 36,
            fontFamily: "PoppinsBold",
            lineHeight: 36,
          }}
        >
          {calorieGoal}
        </Text>
        <Text
          className="text-white"
          style={{
            fontSize: 12,
            fontFamily: "Poppins",
          }}
        >
          Calorie Goal
        </Text>
      </View>
    </View>
  );
};
