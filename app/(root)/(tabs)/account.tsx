import Typo from "@/components/Typo";
import { icons } from "@/constants/index";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const PROFILE = {
  name: "Rencie Narido",
  email: "renciepogi_09@gmail.com",
  gender: "Rather not say",
  birthdate: "09/12/2004",
  height: "5ft 9in",
  weight: "120 kg",
  bmi: "18.5 (Normal Weight)",
  allergens: "Milk · Eggs · Peanuts · Wheat · Soybeans",
  medical: "n/a",
};

export default function Account() {
  const [showPersonal, setShowPersonal] = useState(true);
  const [showHealth, setShowHealth] = useState(true);
  const [avatar, setAvatar] = useState<string | null>(null);

  // Open image picker and update avatar
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access gallery is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
      // Optionally: upload the image here
    }
  };

  return (
    <LinearGradient
      colors={["#E1DADA", "#BDCAD9", "#F3F4F7"]}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 pt-5"
    >
      <View className="flex-row items-center justify-between px-5 py-5 bg-transparent">
        <Typo size={24} className="font-PoppinsSemiBold">
          Account
        </Typo>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="items-center pt-4 pb-6 px-4">
          {/* Profile Header */}
          <Typo size={22} className="font-PoppinsSemiBold text-center">
            {PROFILE.name}
          </Typo>
          {/* Email */}
          <Typo
            size={14}
            color="#888"
            className="font-Poppins text-center mb-2"
          >
            {PROFILE.email}
          </Typo>
          {/* Avatar */}
          <TouchableOpacity
            className="w-28 h-28 rounded-full bg-white shadow-lg items-center justify-center mb-4"
            onPress={pickImage}
            activeOpacity={0.8}
          >
            <Image
              source={
                avatar
                  ? { uri: avatar }
                  : require("@/assets/images/sample-profile.jpg")
              }
              className="w-24 h-24 rounded-full"
              resizeMode="cover"
            />
            <View className="absolute bottom-1 right-1 bg-white rounded-full p-1 border border-gray-200">
              <AntDesign name="picture" size={16} color="gray" />
            </View>
          </TouchableOpacity>

          {/* Edit Button */}
          <TouchableOpacity className="flex-row items-center justify-center gap-2 bg-white rounded-xl px-4 py-2">
            <AntDesign name="edit" size={16} color="gray" />
            <Typo size={14} className="font-PoppinsSemiBold">
              Edit my profile
            </Typo>
          </TouchableOpacity>
        </View>

        {/* Personal Information Section */}
        <View className="mx-4 mt-2 bg-white rounded-2xl shadow-md">
          <TouchableOpacity
            className="flex-row items-center justify-between px-5 py-4"
            onPress={() => setShowPersonal((v) => !v)}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center gap-2">
              <Image source={icons.person} className="w-5 h-5 mr-2" />
              <Typo size={16} className="font-PoppinsSemiBold">
                Personal Information
              </Typo>
            </View>
            <Text className="text-2xl text-gray-400">
              {showPersonal ? "\u25BC" : "\u25B6"}
            </Text>
          </TouchableOpacity>
          {showPersonal && (
            <View className="px-5 pb-4">
              <Field label="Username" value={PROFILE.name} />
              <Field label="Gender" value={PROFILE.gender} />
              <Field label="Birthdate" value={PROFILE.birthdate} />
              <Field label="Email" value={PROFILE.email} />
            </View>
          )}
        </View>

        {/* Health Information Section */}
        <View className="mx-4 mt-6 bg-white rounded-2xl shadow-md mb-6">
          <TouchableOpacity
            className="flex-row items-center justify-between px-5 py-4"
            onPress={() => setShowHealth((v) => !v)}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center gap-4">
              <FontAwesome name="heartbeat" size={18} color="black" />
              <Typo size={16} className="font-PoppinsSemiBold">
                Health Information
              </Typo>
            </View>
            <Text className="text-2xl text-gray-400">
              {showHealth ? "\u25BC" : "\u25B6"}
            </Text>
          </TouchableOpacity>
          {showHealth && (
            <View className="px-5 pb-4">
              <Field label="Height" value={PROFILE.height} />
              <Field label="Weight" value={PROFILE.weight} />
              <Field label="BMI" value={PROFILE.bmi} />
              <Field label="Allergens" value={PROFILE.allergens} />
              <Field label="Medical Conditions" value={PROFILE.medical} />
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View className="mb-2">
      <Text className="text-xs text-gray-400 font-Poppins mb-1">{label}</Text>
      <Text className="text-base font-PoppinsSemiBold text-gray-700 bg-neutral-100 rounded-lg px-3 py-2">
        {value}
      </Text>
    </View>
  );
}
