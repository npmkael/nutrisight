import { Link, router } from "expo-router";
import { memo, useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// custom components
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";

// icons and images
import { icons } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

function SignUp() {
  const { register, loading } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleRegister = useCallback(async () => {
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
    router.replace({
      pathname: "/(auth)/otp",
      params: { email: form.email },
    });
  }, [form]);

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
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 bg-white">
          <View className="p-5">
            <InputField
              label="First Name"
              placeholder="Enter your first name"
              icon={icons.person}
              value={form.firstName}
              onChangeText={(value) => setForm({ ...form, firstName: value })}
            />
            <InputField
              label="Last Name"
              placeholder="Enter your last name"
              icon={icons.person}
              value={form.lastName}
              onChangeText={(value) => setForm({ ...form, lastName: value })}
            />
            <InputField
              label="Email"
              placeholder="Enter your email"
              icon={icons.email}
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
            />
            <InputField
              label="Password"
              placeholder="Enter your password"
              icon={icons.lock}
              secureTextEntry={true}
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
            />

            <CustomButton
              title="Sign Up"
              onPress={handleRegister}
              className="mt-6"
              disabled={loading}
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
    </SafeAreaView>
  );
}

export default memo(SignUp);
