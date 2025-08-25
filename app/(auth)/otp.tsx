import { useLocalSearchParams } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/lib/utils";

import { useAuth } from "@/context/AuthContext";
import { moderateScale, textScale } from "@/lib/utils";
// components
import BackHeader from "@/components/BackHeader";
import CustomButton from "@/components/CustomButton";
import OTPTextInput from "react-native-otp-textinput";

function Otp() {
  const { verifyOtp, resendOtp } = useAuth();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResend = useCallback(async () => {
    if (!email) return;
    setResendTimer(60);
    try {
      await resendOtp(email);
      Alert.alert(
        "OTP Resent",
        "A new verification code has been sent to your email."
      );
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP. Please try again.");
    }
  }, [email, resendOtp]);

  const onContinuePress = useCallback(async () => {
    if (otpCode.length !== 4) {
      Alert.alert("Invalid OTP", "Please enter a 4-digit OTP.");
      return;
    }
    try {
      await verifyOtp(otpCode, email);
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
        <View className="mt-8 items-center">
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
        <View className="mt-auto px-4 py-8 border-t border-t-gray-100">
          <CustomButton
            title="Continue"
            onPress={onContinuePress}
            loading={false}
          />
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
