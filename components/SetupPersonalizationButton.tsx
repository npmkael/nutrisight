import React from "react";
import { Text, TouchableOpacity } from "react-native";

type SetupPersonalizationButtonProps = {
  currentStep: number;
  totalSteps: number;
  handleContinue: () => void;
  handleAgreement: () => void;
  loading: boolean;
};

export default function SetupPersonalizationButton({
  currentStep,
  totalSteps,
  handleContinue,
  handleAgreement,
  loading,
}: SetupPersonalizationButtonProps) {
  return (
    <TouchableOpacity
      onPress={currentStep < totalSteps ? handleContinue : handleAgreement}
      style={{
        backgroundColor: "#000",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        opacity: loading ? 0.6 : 1,
      }}
      disabled={loading}
    >
      <Text style={{ color: "#fff", fontSize: 16 }}>
        {currentStep < totalSteps ? "Next" : "Finish"}
      </Text>
    </TouchableOpacity>
  );
}
