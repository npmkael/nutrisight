import { Link, router } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// custom components
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import PasswordRequirementsCard from "@/components/PasswordRequirementsCard";

// icons and images
import { icons } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// Validation interfaces
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface TouchedFields {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}

function SignUp() {
  const { register, loading } = useAuth();

  // Form state
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Touched fields (to show errors only after user interacts)
  const [touched, setTouched] = useState<TouchedFields>({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Validation functions
  const validateFirstName = (name: string): string => {
    if (!name.trim()) {
      return "First name is required";
    }
    if (name.trim().length < 2) {
      return "First name must be at least 2 characters";
    }
    // Only letters and spaces
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      return "First name can only contain letters and spaces";
    }
    return "";
  };

  const validateLastName = (name: string): string => {
    if (!name.trim()) {
      return "Last name is required";
    }
    if (name.trim().length < 2) {
      return "Last name must be at least 2 characters";
    }
    // Only letters and spaces
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      return "Last name can only contain letters and spaces";
    }
    return "";
  };

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
    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    // Check for number
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const validateConfirmPassword = (
    confirmPassword: string,
    password: string
  ): string => {
    if (!confirmPassword) {
      return "Please confirm your password";
    }
    if (confirmPassword !== password) {
      return "Passwords do not match";
    }
    return "";
  };

  // Real-time validation with useEffect
  useEffect(() => {
    setErrors({
      firstName: validateFirstName(form.firstName),
      lastName: validateLastName(form.lastName),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(
        form.confirmPassword,
        form.password
      ),
    });
  }, [form]);

  // Check if form is valid
  const isFormValid =
    !errors.firstName &&
    !errors.lastName &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword &&
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    form.email.trim() !== "" &&
    form.password !== "" &&
    form.confirmPassword !== "";

  // Handle field blur (mark as touched)
  const handleBlur = (field: keyof TouchedFields) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleRegister = useCallback(async () => {
    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields one more time
    if (!isFormValid) {
      Alert.alert(
        "Validation Error",
        "Please fix all errors before submitting the form."
      );
      return;
    }

    const success = await register(
      form.firstName,
      form.lastName,
      form.email,
      form.password
    );

    if (!success) {
      router.replace("/(auth)/sign-up");
      return;
    }

    // Show success message
    Alert.alert(
      "Success! 🎉",
      "Your account has been created successfully. Please verify your email.",
      [
        {
          text: "OK",
          onPress: () => {
            router.replace({
              pathname: "/(auth)/otp",
              params: { email: form.email },
            });
          },
        },
      ]
    );
  }, [form, isFormValid]);

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
        <ScrollView
          className="flex-1 bg-white"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 48 }}
        >
          <View className="px-5 bg-white">
            <Text
              className="text-4xl text-black"
              style={{ fontFamily: "GeistSemiBold" }}
            >
              Sign Up
            </Text>
            <Text
              className="text-base text-gray-500"
              style={{ fontFamily: "GeistRegular" }}
            >
              Welcome to NutriSight! Please enter your details.
            </Text>
          </View>
          <View className="flex-1 bg-white">
            <View className="p-5">
              <InputField
                label="First Name"
                placeholder="Enter your first name"
                icon={icons.person}
                value={form.firstName}
                onChangeText={(value) => setForm({ ...form, firstName: value })}
                onBlur={() => handleBlur("firstName")}
                error={errors.firstName}
                isValid={!errors.firstName && form.firstName.trim() !== ""}
                showValidation={touched.firstName}
                autoCapitalize="words"
              />

              <InputField
                label="Last Name"
                placeholder="Enter your last name"
                icon={icons.person}
                value={form.lastName}
                onChangeText={(value) => setForm({ ...form, lastName: value })}
                onBlur={() => handleBlur("lastName")}
                error={errors.lastName}
                isValid={!errors.lastName && form.lastName.trim() !== ""}
                showValidation={touched.lastName}
                autoCapitalize="words"
              />

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

              <InputField
                label="Confirm Password"
                placeholder="Re-enter your password"
                icon={icons.lock}
                secureTextEntry={true}
                value={form.confirmPassword}
                onChangeText={(value) =>
                  setForm({ ...form, confirmPassword: value })
                }
                onBlur={() => handleBlur("confirmPassword")}
                error={errors.confirmPassword}
                isValid={!errors.confirmPassword && form.confirmPassword !== ""}
                showValidation={touched.confirmPassword}
                autoCapitalize="none"
              />

              <PasswordRequirementsCard password={form.password} />

              <CustomButton
                title="Sign Up"
                onPress={handleRegister}
                className="mt-6"
                disabled={!isFormValid || loading}
                loading={loading}
              />

              {/* OAuth */}
              <OAuth />

              <Link href="/sign-in" className="mt-10">
                <Text className="text-base text-center text-gray-600">
                  Already have an account?{" "}
                  <Text className="font-semibold text-[#2D3644]">Log In</Text>
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default memo(SignUp);
