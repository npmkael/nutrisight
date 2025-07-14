import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";

type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: any | null;
  style?: TextStyle;
  textProps?: TextProps;
  className?: string;
};

const Typo = ({
  size,
  color = "#000",
  fontWeight = "400",
  children,
  style,
  textProps = {},
  className,
}: TypoProps) => {
  const textStyle: TextStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color,
    fontWeight,
  };

  return (
    <Text style={[textStyle, style]} {...textProps} className={className}>
      {children}
    </Text>
  );
};

export default Typo;

const styles = StyleSheet.create({});
