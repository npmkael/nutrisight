import { verticalScale } from "@/utils/styling";
import { memo, ReactNode, useMemo } from "react";
import { Text, TextProps, TextStyle } from "react-native";

type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: ReactNode | null;
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
  // use memoization for performance optimization
  const textStyle: TextStyle = useMemo(
    () => ({
      fontSize: size ? verticalScale(size) : verticalScale(18),
      color,
      fontWeight,
    }),
    [size, color, fontWeight]
  );

  return (
    <Text style={[textStyle, style]} {...textProps} className={className}>
      {children}
    </Text>
  );
};

export default memo(Typo);

// const styles = StyleSheet.create({});
