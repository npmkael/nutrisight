import React, { memo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface LineProgressBarProps {
  progress: number; // 0-100
  height?: number;
  filledColor?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

const LineProgressBar: React.FC<LineProgressBarProps> = ({
  progress,
  height = 10,
  filledColor = "#FFD600",
  backgroundColor = "#000",
  style,
}) => {
  return (
    <View style={[styles.container, { height, backgroundColor }, style]}>
      <View
        style={[
          styles.filled,
          {
            width: `${Math.max(0, Math.min(progress, 100))}%`,
            backgroundColor: filledColor,
            height: "100%",
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 2,
    overflow: "hidden",
  },
  filled: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
  },
});

export default memo(LineProgressBar);
