import { Link, router } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";

// custom components
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";

// icons and images
import { icons } from "@/constants";
import { useAuth } from "@/context/AuthContext";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// Validation interfaces
interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
}

interface TouchedFields {
  email: boolean;
  password: boolean;
}

function SignIn() {
  const { login, loading } = useAuth();

  // Form state
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });

  // Touched fields (to show errors only after user interacts)
  const [touched, setTouched] = useState<TouchedFields>({
    email: false,
    password: false,
  });

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email.trim()) {
      return "Email is required";
    }
    // Comprehensive email regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return "";
  };

  // Real-time validation with useEffect
  useEffect(() => {
    setErrors({
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    });
  }, [form]);

  // Check if form is valid
  const isFormValid =
    !errors.email &&
    !errors.password &&
    form.email.trim() !== "" &&
    form.password !== "";

  // Handle field blur (mark as touched)
  const handleBlur = (field: keyof TouchedFields) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSignIn = useCallback(async () => {
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    // Validate all fields one more time
    if (!isFormValid) {
      Alert.alert(
        "Validation Error",
        "Please fix all errors before signing in."
      );
      return;
    }

    await login(form.email, form.password);
  }, [form, isFormValid, login]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row items-center p-4 gap-4 bg-white">
        <TouchableOpacity
          onPress={() => router.replace("/(auth)/welcome")}
          className="p-2 rounded-full bg-[#F4F4F4]"
        >
          <Ionicons name="arrow-back" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView className="flex-1 bg-white" keyboardShouldPersistTaps="handled">
          <View className="px-5 bg-white">
            <Text
              className="text-4xl text-black"
              style={{ fontFamily: "GeistSemiBold" }}
            >
              Sign In
            </Text>
            <Text
              className="text-base text-gray-500"
              style={{ fontFamily: "GeistRegular" }}
            >
              Welcome back! Please enter your details.
            </Text>
          </View>

          <View className="p-5">
            <InputField
              label="Email Address"
              placeholder="Enter your email"
              icon={icons.email}
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
              onBlur={() => handleBlur("email")}
              error={errors.email}
              isValid={!errors.email && form.email.trim() !== ""}
              showValidation={touched.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            
            <InputField
              label="Password"
              placeholder="Enter your password"
              icon={icons.lock}
              secureTextEntry={true}
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
              onBlur={() => handleBlur("password")}
              error={errors.password}
              isValid={!errors.password && form.password !== ""}
              showValidation={touched.password}
              autoCapitalize="none"
            />

            <CustomButton
              title="Sign In"
              disabled={!isFormValid || loading}
              loading={loading}
              onPress={handleSignIn}
              className="mt-6"
            />

            {/* OAuth */}
            <OAuth />

            <Link href="/sign-up" className="mt-10">
              <Text className="text-base text-center text-gray-600">
                Don't have an account?{" "}
                <Text className="font-semibold text-[#2D3644]">Sign Up</Text>
              </Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default memo(SignIn);
