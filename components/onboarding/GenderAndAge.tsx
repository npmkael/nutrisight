import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import TextInputField from "../TextInputField";

interface GenderAndAgeProps {
  selectedGender: string;
  setSelectedGender: (gender: string) => void;
  age: string;
  setAge: (age: string) => void;
}

export default function GenderAndAge({
  selectedGender,
  setSelectedGender,
  age,
  setAge,
}: GenderAndAgeProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-4">
        <Text className="text-3xl font-PoppinsSemiBold text-black mb-8">
          Tell us about yourself
        </Text>

        {/* Gender Section */}
        <View className="mb-6">
          <Text className="font-Poppins text-md text-gray-500 mb-1">
            What's your gender?
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className={`flex-1 py-4 px-6 rounded-lg border ${
                selectedGender === "male"
                  ? "bg-black border-black"
                  : "bg-white border-gray-300"
              }`}
              onPress={() => setSelectedGender("male")}
            >
              <Text
                className={`text-center font-PoppinsMedium text-base ${
                  selectedGender === "male" ? "text-white" : "text-black"
                }`}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-4 px-6 rounded-lg border ${
                selectedGender === "female"
                  ? "bg-black border-black"
                  : "bg-white border-gray-300"
              }`}
              onPress={() => setSelectedGender("female")}
            >
              <Text
                className={`text-center font-PoppinsMedium text-base ${
                  selectedGender === "female" ? "text-white" : "text-black"
                }`}
              >
                Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-4 px-6 rounded-lg border ${
                selectedGender === "other"
                  ? "bg-black border-black"
                  : "bg-white border-gray-300"
              }`}
              onPress={() => setSelectedGender("other")}
            >
              <Text
                className={`text-center font-PoppinsMedium text-base ${
                  selectedGender === "other" ? "text-white" : "text-black"
                }`}
              >
                Other
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Age Section */}
        <View className="mb-6">
          <Text className="font-Poppins text-md text-gray-500 mb-1">
            How old are you?
          </Text>
          <View className="flex-row items-center gap-3">
            <TextInputField value={age} onChangeText={setAge} maxLength={3} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
