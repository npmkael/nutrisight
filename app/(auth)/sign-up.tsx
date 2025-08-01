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

export default function SignUp() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[200px]">
          <Image source={images.signUpFood} className="z-0 w-full h-[200px]" />
          <Text className="text-2xl text-black font-PoppinsMedium absolute bottom-5 left-5">
            Create Your Account
          </Text>
        </View>
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
            onPress={() => register(form.name, form.email, form.password)}
            className="mt-6"
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
  );
}
