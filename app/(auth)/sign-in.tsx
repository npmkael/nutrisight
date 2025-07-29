import { Link } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

// custom components
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";

// icons and images
import { icons, images } from "@/constants";
import { useAuth } from "@/context/AuthContext";

export default function SignIn() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <Image source={images.signUpFood} className="z-0 w-full h-[250px]" />
        <Text className="text-2xl text-black font-PoppinsMedium absolute bottom-5 left-5">
          Welcome 👋🏻
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
  );
}
