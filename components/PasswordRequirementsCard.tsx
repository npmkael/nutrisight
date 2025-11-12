import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type PasswordRequirementsCardProps = {
  password: string;
  style?: StyleProp<ViewStyle>;
};

type PasswordRule = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

const PASSWORD_RULES: PasswordRule[] = [
  {
    id: "length",
    label: "Minimum 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "At least one uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "At least one lowercase letter",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "At least one number",
    test: (password) => /\d/.test(password),
  },
  {
    id: "special",
    label: "At least one special character",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

export default function PasswordRequirementsCard({
  password,
  style,
}: PasswordRequirementsCardProps) {
  const animationRefs = useRef<Record<string, Animated.Value>>();

  if (!animationRefs.current) {
    animationRefs.current = PASSWORD_RULES.reduce(
      (acc, rule) => ({
        ...acc,
        [rule.id]: new Animated.Value(rule.test(password) ? 1 : 0),
      }),
      {} as Record<string, Animated.Value>
    );
  }

  const ruleStatuses = useMemo(
    () =>
      PASSWORD_RULES.map((rule) => ({
        ...rule,
        isMet: rule.test(password),
      })),
    [password]
  );

  useEffect(() => {
    ruleStatuses.forEach(({ id, isMet }) => {
      const animatedValue = animationRefs.current?.[id];
      if (!animatedValue) {
        return;
      }

      Animated.spring(animatedValue, {
        toValue: isMet ? 1 : 0,
        useNativeDriver: true,
        friction: 12,
        tension: 120,
      }).start();
    });
  }, [ruleStatuses]);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.heading}>Password must include:</Text>
      {ruleStatuses.map(({ id, label, isMet }, index) => {
        const animatedValue = animationRefs.current?.[id];

        const opacity = animatedValue
          ? animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.55, 1],
            })
          : 1;

        const scale = animatedValue
          ? animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.97, 1],
            })
          : 1;

        const isLast = index === ruleStatuses.length - 1;

        return (
          <Animated.View
            key={id}
            style={[
              styles.requirementRow,
              isMet ? styles.requirementRowMet : styles.requirementRowDefault,
              !isLast && styles.requirementRowSpacing,
              { opacity, transform: [{ scale }] },
            ]}
          >
            <Ionicons
              name={isMet ? "checkmark-circle" : "close-circle"}
              size={20}
              color={isMet ? "#10B981" : "#9CA3AF"}
              accessibilityLabel={`${label} ${isMet ? "met" : "not met"}`}
            />
            <Text
              style={[
                styles.requirementText,
                isMet
                  ? styles.requirementTextMet
                  : styles.requirementTextDefault,
              ]}
            >
              {label}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "rgba(15, 23, 42, 0.04)",
  },
  heading: {
    fontSize: 13,
    fontFamily: "PoppinsSemiBold",
    color: "#0F172A",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  requirementRowSpacing: {
    marginBottom: 8,
  },
  requirementRowMet: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
  },
  requirementRowDefault: {
    backgroundColor: "rgba(148, 163, 184, 0.12)",
  },
  requirementText: {
    marginLeft: 12,
    fontSize: 13,
    fontFamily: "Poppins",
    letterSpacing: 0.1,
  },
  requirementTextMet: {
    color: "#047857",
    fontFamily: "PoppinsSemiBold",
  },
  requirementTextDefault: {
    color: "#475569",
  },
});
