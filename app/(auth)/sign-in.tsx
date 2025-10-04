import { Link, router } from "expo-router";
import { memo, useState } from "react";
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

function SignIn() {
  const { login, loading } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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
            title="Sign In"
            disabled={loading}
            loading={loading}
            onPress={() => login(form.email, form.password)}
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
    </SafeAreaView>
  );
}

export default memo(SignIn);
