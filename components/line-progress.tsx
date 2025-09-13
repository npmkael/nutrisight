import { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";

export const Progress = ({
  min,
  max,
  height,
  color,
  backgroundColor,
}: {
  min: number;
  max: number;
  height: number;
  color: string;
  backgroundColor: string;
}) => {
  const [width, setWidth] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const reactive = useRef(new Animated.Value(-1000)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: reactive,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    reactive.setValue(-width + (width * min) / max);
  }, [min, width]);

  return (
    <View
      onLayout={(e) => {
        const newWidth = e.nativeEvent.layout.width;
        setWidth(newWidth);
      }}
      style={{
        height,
        backgroundColor: backgroundColor,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={{
          height,
          width: "100%",
          backgroundColor: color,
          position: "absolute",
          left: 0,
          top: 0,
          transform: [
            {
              translateX: animatedValue,
            },
          ],
        }}
      />
    </View>
  );
};
