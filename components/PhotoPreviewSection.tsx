import { CameraCapturedPicture } from "expo-camera";

import Typo from "@/components/Typo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import CircularProgressBar from "@/components/CircularProgressBar";
import LineProgressBar from "@/components/LineProgressBar";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Swiper from "react-native-swiper";

export default function PhotoPreviewSection({
  photo,
  handleRetakePhoto,
}: {
  photo: CameraCapturedPicture;
  handleRetakePhoto: () => void;
}) {
  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <Image
        className="absolute top-0 left-0 right-0"
        source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        style={{ height: 400, width: "100%" }}
        blurRadius={30}
        resizeMode="cover"
      />
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-8 pb-2">
        <TouchableOpacity onPress={handleRetakePhoto}>
          <Entypo name="chevron-with-circle-left" size={28} color="white" />
        </TouchableOpacity>
        <View className="w-1 h-1 bg-gray-300/0" />
      </View>
      {/* Image */}
      <View className="items-center mt-2">
        <Image
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
          className="w-[320px] h-[250px] rounded-2xl object-cover shadow-xl"
        />
      </View>
      {/* Card */}
      <ScrollView
        className="flex-1 bg-white mt-[-24px] rounded-t-3xl px-4 shadow-xl"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
      >
        {/* Date/Time */}
        <View className="bg-[#F3F4F7] rounded-2xl flex-row items-center justify-center mb-2 gap-2 px-2 py-2 w-32">
          <AntDesign name="instagram" size={24} color="black" />
          <View>
            <Text className="text-xs text-gray-400 font-Poppins">
              14/05/2025
            </Text>
            <Text className="text-xs text-gray-400 font-Poppins">12:30pm</Text>
          </View>
        </View>
        {/* Food Name */}
        <Typo size={28} className="font-Poppins text-gray-900 mb-6">
          Boba Milk Tea
        </Typo>
        {/* Calories Card */}
        <View className="flex-row items-center bg-white rounded-2xl px-6 py-4 shadow border border-gray-100 mb-6">
          <View className="bg-gray-100 rounded-2xl p-4">
            <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={36}
              color="black"
            />
          </View>
          <View className="ml-4">
            <Text className="text-gray-500 font-Poppins">
              Estimated Total Calories
            </Text>
            <Text className="font-PoppinsBold text-gray-900 text-4xl">
              1024
            </Text>
          </View>
        </View>

        {/* Estimated Nutrients Summary */}
        <View className="flex-col bg-white rounded-2xl pt-4 shadow border border-gray-100 mb-4">
          <View className="flex-col mx-4 mb-4">
            <Text
              className="font-Poppins"
              style={{
                lineHeight: 10,
              }}
            >
              Estimated Nutrients
            </Text>
            <Text className="font-PoppinsSemiBold text-3xl">Summary</Text>
          </View>

          <Swiper
            loop={false}
            className="h-[265px]"
            dot={
              <View className="w-[32px] h-[4px] mx-1 bg-[#f1f1f1] rounded-full" />
            }
            activeDot={
              <View className="w-[32px] h-[4px] mx-1 bg-black rounded-full" />
            }
          >
            {/* add ka nalang another view kung gusto mo pa ng isang swiper */}
            <View className="mx-4">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="bg-gray-100 rounded-3xl px-4 py-4 items-center flex-1">
                  <Text className="font-PoppinsSemiBold tracking-widest text-md mb-1">
                    Carbs
                  </Text>

                  <CircularProgressBar
                    progress={50}
                    size={55}
                    strokeWidth={4}
                    color="#30B0C7"
                    backgroundColor="rgba(0,0,0,0.05)"
                    showPercentage={true}
                    percentageTextSize={10}
                    percentageTextColor="black"
                    label="g"
                  />
                </View>
                <View className="bg-gray-100 rounded-3xl px-4 py-4 items-center flex-1">
                  <Text className="font-PoppinsSemiBold tracking-widest text-md mb-1">
                    Protein
                  </Text>

                  <CircularProgressBar
                    progress={28}
                    size={55}
                    strokeWidth={4}
                    color="#F47450"
                    backgroundColor="rgba(0,0,0,0.05)"
                    showPercentage={true}
                    percentageTextSize={10}
                    percentageTextColor="black"
                    label="g"
                  />
                </View>
                <View className="bg-gray-100 rounded-3xl px-4 py-4 items-center flex-1">
                  <Text className="font-PoppinsSemiBold tracking-widest text-md mb-1">
                    Fiber
                  </Text>

                  <CircularProgressBar
                    progress={20}
                    size={55}
                    strokeWidth={4}
                    color="#FF2D55"
                    backgroundColor="rgba(0,0,0,0.05)"
                    showPercentage={true}
                    percentageTextSize={10}
                    percentageTextColor="black"
                    label="g"
                  />
                </View>
              </View>

              <View className="flex-row items-center gap-2 mb-2">
                <View className="bg-gray-100 rounded-3xl px-4 py-4 items-center flex-1">
                  <Text className="font-PoppinsSemiBold tracking-widest text-md mb-1">
                    Calcium
                  </Text>

                  <CircularProgressBar
                    progress={40}
                    size={55}
                    strokeWidth={4}
                    color="#34C759"
                    backgroundColor="rgba(0,0,0,0.05)"
                    showPercentage={true}
                    percentageTextSize={10}
                    percentageTextColor="black"
                    label="g"
                  />
                </View>
                <View className="bg-gray-100 rounded-3xl px-4 py-4 items-center flex-1">
                  <Text className="font-PoppinsSemiBold tracking-widest text-md mb-1">
                    Iron
                  </Text>

                  <CircularProgressBar
                    progress={14}
                    size={55}
                    strokeWidth={4}
                    color="#5856D6"
                    backgroundColor="rgba(0,0,0,0.05)"
                    showPercentage={true}
                    percentageTextSize={10}
                    percentageTextColor="black"
                    label="g"
                  />
                </View>
                <View className="bg-gray-100 rounded-3xl px-6 py-4 items-center flex-1">
                  <Text className="font-PoppinsSemiBold tracking-widest text-md mb-1">
                    Fat
                  </Text>

                  <CircularProgressBar
                    progress={30}
                    size={55}
                    strokeWidth={4}
                    color="#AF52DE"
                    backgroundColor="rgba(0,0,0,0.05)"
                    showPercentage={true}
                    percentageTextSize={10}
                    percentageTextColor="black"
                    label="g"
                  />
                </View>
              </View>
            </View>

            <View className="mx-4">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="bg-gray-100 rounded-3xl px-6 py-4 items-center flex-1">
                  <Text className="font-PoppinsSemiBold tracking-widest text-md mb-1">
                    Carbs
                  </Text>

                  <CircularProgressBar
                    progress={50}
                    size={55}
                    strokeWidth={4}
                    color="#30B0C7"
                    backgroundColor="rgba(0,0,0,0.05)"
                    showPercentage={true}
                    percentageTextSize={10}
                    percentageTextColor="black"
                    label="g"
                  />
                </View>
                <View className="bg-gray-100 rounded-3xl px-6 py-4 items-center flex-1">
                  <Text className="font-PoppinsSemiBold tracking-widest text-md mb-1">
                    Protein
                  </Text>

                  <CircularProgressBar
                    progress={28}
                    size={55}
                    strokeWidth={5}
                    color="#F47450"
                    backgroundColor="rgba(0,0,0,0.05)"
                    showPercentage={true}
                    percentageTextSize={10}
                    percentageTextColor="black"
                    label="g"
                  />
                </View>
                <View className="bg-gray-100 rounded-3xl px-6 py-4 items-center flex-1">
                  <Text className="font-PoppinsSemiBold tracking-widest text-md mb-1">
                    Fiber
                  </Text>

                  <CircularProgressBar
                    progress={20}
                    size={55}
                    strokeWidth={4}
                    color="#FF2D55"
                    backgroundColor="rgba(0,0,0,0.05)"
                    showPercentage={true}
                    percentageTextSize={10}
                    percentageTextColor="black"
                    label="g"
                  />
                </View>
              </View>

              <View className="flex-row items-center gap-2 mb-2">
                <View className="bg-gray-100 rounded-3xl px-6 py-4 items-center flex-1">
                  <Text className="font-PoppinsSemiBold tracking-widest text-md mb-1">
                    Calcium
                  </Text>

                  <CircularProgressBar
                    progress={40}
                    size={55}
                    strokeWidth={4}
                    color="#34C759"
                    backgroundColor="rgba(0,0,0,0.05)"
                    showPercentage={true}
                    percentageTextSize={10}
                    percentageTextColor="black"
                    label="g"
                  />
                </View>
                <View className="bg-gray-100 rounded-3xl px-6 py-4 items-center flex-1">
                  <Text className="font-PoppinsSemiBold tracking-widest text-md mb-1">
                    Iron
                  </Text>

                  <CircularProgressBar
                    progress={14}
                    size={55}
                    strokeWidth={4}
                    color="#5856D6"
                    backgroundColor="rgba(0,0,0,0.05)"
                    showPercentage={true}
                    percentageTextSize={10}
                    percentageTextColor="black"
                    label="g"
                  />
                </View>
                <View className="bg-gray-100 rounded-3xl px-6 py-4 items-center flex-1">
                  <Text className="font-PoppinsSemiBold tracking-widest text-md mb-1">
                    Fat
                  </Text>

                  <CircularProgressBar
                    progress={30}
                    size={55}
                    strokeWidth={4}
                    color="#AF52DE"
                    backgroundColor="rgba(0,0,0,0.05)"
                    showPercentage={true}
                    percentageTextSize={10}
                    percentageTextColor="black"
                    label="g"
                  />
                </View>
              </View>
            </View>
          </Swiper>
        </View>

        {/* Healthiness Rating */}
        <View className="flex-row bg-white rounded-2xl p-4 shadow border items-center border-gray-100 gap-2 justify-evenly mb-4">
          <View className="bg-gray-100 rounded-2xl p-4">
            <FontAwesome5 name="heartbeat" size={36} color="black" />
          </View>
          <View className="flex-col gap-2">
            <Text className="font-Poppins text-xl">Healthiness Rating</Text>
            <LineProgressBar progress={30} height={5} />
          </View>

          <Text className="font-PoppinsBold text-4xl">3/10</Text>
        </View>

        {/* Allergens */}
        <View className="rounded-2xl p-4 shadow border border-[#FFA4A4] bg-[#FFEEEE] mb-6">
          <View className="flex-row gap-4">
            <FontAwesome
              name="warning"
              size={18}
              color="red"
              className="mt-1"
            />

            <View className="flex-col gap-1">
              <Text className="font-PoppinsBold text-2xl">
                Allergens: <Text className="font-Poppins">Soybeans</Text>
              </Text>
              <Text className="font-Poppins">
                Please read all labels carefully and consult with a healthcare
                provider if you have any concerns.
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-2">
          <TouchableOpacity className="bg-white rounded-2xl px-6 py-2 shadow border border-black flex-1">
            <Text className="font-Poppins text-center text-black uppercase">
              Discard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-black rounded-2xl px-6 py-2 shadow border border-black flex-1">
            <Text className="font-Poppins text-center text-white uppercase">
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
