import { capitalizeFirstLetter } from "@/utils/helpers";
import React, { memo } from "react";
import { Text, View } from "react-native";

function StrokeText({ children }: { children: string }) {
  // Render text 4 times offset for "stroke", then main text
  return (
    <View style={{ position: "relative" }}>
      {/* Stroke layers */}
      <Text
        style={{
          position: "absolute",
          left: 1,
          top: 0,
          color: "#000",
          fontFamily: "Poppins",
          fontSize: 12,
          letterSpacing: 1,
        }}
      >
        {children}
      </Text>
      <Text
        style={{
          position: "absolute",
          left: -1,
          top: 0,
          color: "#000",
          fontFamily: "Poppins",
          fontSize: 12,
          letterSpacing: 1,
        }}
      >
        {children}
      </Text>
      <Text
        style={{
          position: "absolute",
          left: 0,
          top: 1,
          color: "#000",
          fontFamily: "Poppins",
          fontSize: 12,
          letterSpacing: 1,
        }}
      >
        {children}
      </Text>
      <Text
        style={{
          position: "absolute",
          left: 0,
          top: -1,
          color: "#000",
          fontFamily: "Poppins",
          fontSize: 12,
          letterSpacing: 1,
        }}
      >
        {children}
      </Text>
      {/* Main text */}
      <Text
        style={{
          color: "#fff",
          fontFamily: "Poppins",
          fontSize: 12,
          letterSpacing: 1,
        }}
      >
        {children}
      </Text>
    </View>
  );
}

function ResultSourceBadge({ source }: { source: string }) {
  return (
    <View
      className="px-3 py-1 rounded-xl self-start mb-2"
      style={{
        backgroundColor:
          source.toLowerCase() === "mynetdiary"
            ? "#A7F3D0"
            : source.toLowerCase() === "nutritionix"
              ? "#34D399"
              : source.toLowerCase() === "usda"
                ? "#3B82F6"
                : source.toLowerCase() === "open food facts"
                  ? "#F59E42"
                  : source.toLowerCase() === "gemini"
                    ? "#A259F7"
                    : source.toLowerCase() === "book"
                      ? "#FBBF24"
                      : "#9CA3AF",
        borderWidth: 1,
        borderColor: "#d1d5db",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <StrokeText>{`by ${capitalizeFirstLetter(source === "mynetdiary" ? "MyNetDiary" : source === "open food facts" ? "Open Food Facts" : source === "usda" ? "USDA" : source === "book" ? "FNRI" : source)}`}</StrokeText>
    </View>
  );
}
export default memo(ResultSourceBadge);
