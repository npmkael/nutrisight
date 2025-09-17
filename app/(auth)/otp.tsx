import { useLocalSearchParams } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/lib/utils";

import { useAuth } from "@/context/AuthContext";
import { moderateScale, textScale } from "@/lib/utils";
// components
import BackHeader from "@/components/BackHeader";
import OTPTextInput from "react-native-otp-textinput";

function Otp() {
  const { verifyOtp, resendOtp } = useAuth();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResend = useCallback(async () => {
    if (!email) return;
    if (resendTimer > 0) return;

    try {
      setLoading(true);
      const success = await resendOtp(email);
      if (!success) {
        setResendTimer(0);
        Alert.alert("Error", "Failed to resend OTP. Please try again.");
        return;
      }

      Alert.alert(
        "OTP Resent",
        "A new verification code has been sent to your email."
      );
      setResendTimer(60);
    } catch (error) {
      console.log("Resend OTP error:", error);
      setResendTimer(0);
      Alert.alert("Error", "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [email, resendTimer, resendOtp]);

  const onContinuePress = useCallback(async () => {
    if (!email) {
      alert("Email is required");
      return;
    }
    if (otpCode.length !== 4) {
      Alert.alert("Invalid OTP", "Please enter a 4-digit OTP.");
      return;
    }
    try {
      console.log("Sending OTP to:", email);
      await verifyOtp(otpCode, email);
      return;
    } catch (error) {
      Alert.alert("Verification Failed", "The OTP you entered is incorrect.");
    }
  }, [otpCode, email, verifyOtp]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <BackHeader />

      {/* Main Content */}
      <View className="flex-1">
        {/* Title Section */}
        <View className="mt-8 px-4">
          <Text className="text-3xl text-gray-900 mb-2 font-PoppinsSemiBold">
            Verification Code
          </Text>
          <Text className="text-base text-gray-600 leading-6">
            We&apos;ve sent a 4-digit verification code to{" "}
            <Text className="font-PoppinsMedium">{email}</Text>
          </Text>
        </View>

        {/* OTP Input Section */}
        <View className="px-4">
          <OTPTextInput
            handleTextChange={setOtpCode}
            containerStyle={{
              marginTop: moderateScale(48),
              marginBottom: moderateScale(24),
            }}
            textInputStyle={styles.textInputStyle}
            inputCount={4}
            tintColor={colors.primary}
            offTintColor={colors.offColor}
            keyboardType="number-pad"
          />
        </View>

        {/* Resend Section */}
        <View className="mt-8 items-center flex-1">
          <Text className="text-sm text-gray-500 mb-2">
            Didn&apos;t receive the code?
          </Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={resendTimer > 0}
            className="items-center"
          >
            <Text
              className={`text-base font-medium ${
                resendTimer > 0 ? "text-gray-400" : "text-[#2D3644]"
              }`}
            >
              {resendTimer > 0
                ? `Resend code in ${resendTimer}s`
                : "Resend verification code"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <View
          style={{ padding: 16, borderTopWidth: 1, borderTopColor: "#eee" }}
        >
          <TouchableOpacity
            onPress={onContinuePress}
            className="bg-primary p-4 rounded-lg"
          >
            <Text
              className="text-white text-center"
              style={{
                fontFamily: "PoppinsMedium",
              }}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default memo(Otp);

const styles = StyleSheet.create({
  weHaveTextstyle: {
    fontSize: textScale(16),
    fontWeight: "500",
    marginTop: moderateScale(6),
  },
  textInputStyle: {
    borderWidth: 0.5,
    borderRadius: 20,
    height: moderateScale(70),
    width: moderateScale(70),
  },
});
