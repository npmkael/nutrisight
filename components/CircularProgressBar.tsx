import React, { memo, useMemo } from "react";
import { Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

interface CircularProgressBarProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  percentageTextSize?: number;
  percentageTextColor?: string;
  label?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function CircularProgressBar({
  progress,
  size = 40,
  strokeWidth = 4,
  color = "#F47450",
  backgroundColor = "rgba(0,0,0,0.2)",
  showPercentage = false,
  percentageTextSize = 12,
  percentageTextColor = "white",
  label = "%",
}: CircularProgressBarProps) {
  // memoize
  const radius = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
  const circumference = useMemo(() => radius * 2 * Math.PI, [radius]);
  const progressValue = useSharedValue(0);

  React.useEffect(() => {
    progressValue.value = withTiming(progress, { duration: 1000 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = interpolate(
      progressValue.value,
      [0, 100],
      [circumference, 0]
    );
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          animatedProps={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {showPercentage && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: percentageTextSize,
              color: percentageTextColor,
              fontFamily: "PoppinsMedium",
            }}
          >
            {progress % 1 === 0 ? progress : progress.toFixed(1)}
            {label}
          </Text>
        </View>
      )}
    </View>
  );
}

export default memo(CircularProgressBar);
