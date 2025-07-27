import { icons } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import colors from "@/lib/utils";

import CustomButton from "@/components/CustomButton";
import { useAuth } from "@/context/AuthContext";
import { moderateScale, textScale } from "@/lib/utils";
import OTPTextInput from "react-native-otp-textinput";

export default function Otp() {
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

  const handleResend = async () => {
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
  };

  const onContinuePress = async () => {
    if (otpCode.length !== 4) {
      Alert.alert("Invalid OTP", "Please enter a 4-digit OTP.");
      return;
    }
    try {
      await verifyOtp(otpCode, email);
    } catch (error) {
      Alert.alert("Verification Failed", "The OTP you entered is incorrect.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Image
            source={icons.backArrow}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-6">
        {/* Title Section */}
        <View className="mt-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Verification Code
          </Text>
          <Text className="text-base text-gray-600 leading-6">
            We&apos;ve sent a 4-digit verification code to{" "}
            <Text className="font-PoppinsMedium">{email}</Text>
          </Text>
        </View>

        {/* OTP Input Section */}
        <OTPTextInput
          handleTextChange={setOtpCode}
          containerStyle={{
            marginTop: moderateScale(48),
            marginBottom: moderateScale(24),
          }}
          textInputStyle={styles.textInputStyle}
          inputCount={4}
          tintColor={colors.btnColor}
          offTintColor={colors.offColor}
          keyboardType="number-pad"
        />

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
        <View className="mt-auto mb-8">
          <CustomButton title="Continue" onPress={onContinuePress} />
        </View>
      </View>
    </SafeAreaView>
  );
}

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
