import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

export const CustomCircularProgress = ({
  progress,
  consumedCalories,
  targetCalories,
}: {
  progress?: number;
  consumedCalories?: number;
  targetCalories?: number;
}) => {
  const size = 140;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Calculate progress: cap at 100%
  const actualProgress = Math.min(100, progress || 0);
  const strokeDashoffset =
    circumference - (actualProgress / 100) * circumference;

  // Check if goal is exceeded
  const isExceeded = (consumedCalories || 0) > (targetCalories || 0);
  const strokeColor = isExceeded ? "#FF6B6B" : "white";

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
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* Center content - Consumed Calories */}
      <View className="absolute items-center justify-center">
        <Text
          className="text-white"
          style={{
            fontSize: 36,
            fontFamily: "PoppinsBold",
            lineHeight: 36,
          }}
        >
          {Math.round(consumedCalories || 0)}
        </Text>
        <Text
          className="text-white"
          style={{
            fontSize: 12,
            fontFamily: "Poppins",
          }}
        >
          Consumed
        </Text>
      </View>

      {/* Target Calories - Outside below the circle */}
      <View className="absolute top-[150px] items-center">
        <Text
          className="text-white"
          style={{
            fontSize: 14,
            fontFamily: "Poppins",
          }}
        >
          Goal: {Math.round(targetCalories || 0)} kcal
        </Text>
      </View>
    </View>
  );
};
