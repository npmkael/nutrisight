import { icons } from "@/constants";
import { router } from "expo-router";
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
import { moderateScale, textScale } from "@/lib/utils";
import OTPTextInput from "react-native-otp-textinput";

export default function Otp() {
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const verifyOtp = (otpCode: string) => {
    // Here you would typically make an API call to verify the OTP
    console.log("Verifying OTP:", otpCode);
    Alert.alert("Success", "OTP verified successfully!");
    // Navigate to next screen
    // router.push('/(root)');
  };

  const handleResend = () => {
    setResendTimer(60);
    // Here you would typically make an API call to resend OTP
    Alert.alert(
      "OTP Resent",
      "A new verification code has been sent to your email."
    );
  };

  const onContinuePress = () => {
    console.log("Continue pressed");
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
          <Text className="text-3xl text-gray-900 mb-2 font-PoppinsSemiBold">
            Verification Code
          </Text>
          <Text className="text-base text-gray-600 leading-6 font-PoppinsMedium">
            We've sent a 4-digit verification code to your email address
          </Text>
        </View>

        {/* OTP Input Section */}
        <OTPTextInput
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
            Didn't receive the code?
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
