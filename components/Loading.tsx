import React, { memo } from "react";
import { ActivityIndicator, ActivityIndicatorProps, View } from "react-native";

const Loading = ({
  size = "large",
  color = "#fff",
}: ActivityIndicatorProps) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default memo(Loading);
