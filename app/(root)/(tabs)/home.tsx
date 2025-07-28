import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularProgressBar from "../../../components/CircularProgressBar";

export default function Home() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <LinearGradient
        colors={["#E1DADA", "#BDCAD9", "#F3F4F7"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1  px-5"
      >
        <View className="flex-row items-center justify-between py-5 bg-transparent">
          {/* Profile and Welcome message */}
          <View className="flex-row items-center justify-center gap-2">
            <Image
              source={require("@/assets/images/sample-profile.jpg")}
              resizeMethod="scale"
              resizeMode="contain"
              className="w-12 h-12 rounded-full"
            />
            <View className="flex-col items-start justify-center">
              <Text className="text-gray-500 text-base font-PoppinsMedium">
                Welcome,
              </Text>
              <Text className="text-black text-2xl font-PoppinsBold">
                Zoey Carreon!
              </Text>
            </View>
          </View>

          <TouchableOpacity className="w-10 h-10 rounded-full bg-white border-gray-200 border-2 items-center justify-center">
            <Ionicons name="person-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>

        {/* Daily Calories */}
        <View
          className="bg-[#111111] rounded-2xl px-6 pt-4 mb-6"
          style={{
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Text className="font-Poppins text-white text-3xl mb-4">
            Daily Calories
          </Text>

          <View className="bg-[#292929] p-2 rounded-3xl flex-row items-center justify-center gap-6 mb-4">
            <View className="flex-col items-center justify-center">
              <View className="flex-row items-center justify-center gap-1">
                <Text className="font-PoppinsMedium text-white text-2xl">
                  972
                </Text>
                <Ionicons name="fast-food-outline" size={18} color="white" />
              </View>
              <Text className="font-Poppins text-white text-xs">
                Calories Taken
              </Text>
            </View>

            <View className="bg-[##F47450] rounded-full flex-col items-center justify-center w-[115px] h-[115px] p-4">
              <Text className="text-white font-PoppinsSemiBold text-3xl">
                1758
              </Text>
              <Text className="font-Poppins text-xs text-white">
                Calories Taken
              </Text>
            </View>

            <View className="flex-col items-center justify-center">
              <View className="flex-row items-center justify-center gap-1">
                <Text className="font-PoppinsMedium text-white text-2xl">
                  234
                </Text>
                <Ionicons name="water-outline" size={18} color="white" />
              </View>
              <Text className="font-Poppins text-white text-xs">
                Calories Burned
              </Text>
            </View>
          </View>

          {/* Carbs, Protein, and Fat */}
          <View className="flex-row items-center justify-evenly gap-2">
            {/* Carbs */}
            <View className="p-2 rounded-tr-[28px] rounded-tl-[28px] bg-[#D0B6F5] flex-col items-center justify-center flex-1">
              <View className="bg-[rgba(0,0,0,0.1)] w-[50px] h-[50px] p-4 rounded-full items-center justify-center mb-2">
                <CircularProgressBar
                  progress={25}
                  size={40}
                  strokeWidth={4}
                  color="#fff"
                  backgroundColor="rgba(25,31,52,0.2)"
                  showPercentage={true}
                  percentageTextSize={10}
                  percentageTextColor="white"
                />
              </View>

              <View className="flex-col items-center">
                <Text className="font-PoppinsSemiBold text-black text-lg">
                  Carbs
                </Text>
                <Text className="font-Poppins text-black text-xs">
                  90.62 / 220g
                </Text>
              </View>
            </View>

            {/* Protein */}
            <View className="p-2 rounded-tr-[28px] rounded-tl-[28px] bg-[#F5D557] flex-col items-center justify-center flex-1">
              <View className="bg-[rgba(0,0,0,0.1)] w-[50px] h-[50px] p-4 rounded-full items-center justify-center mb-2">
                <CircularProgressBar
                  progress={50}
                  size={40}
                  strokeWidth={4}
                  color="#fff"
                  backgroundColor="rgba(25,31,52,0.2)"
                  showPercentage={true}
                  percentageTextSize={10}
                  percentageTextColor="white"
                />
              </View>

              <View className="flex-col items-center">
                <Text className="font-PoppinsSemiBold text-black text-lg">
                  Protein
                </Text>
                <Text className="font-Poppins text-black text-xs">
                  40 / 86g
                </Text>
              </View>
            </View>

            <View className="p-2 rounded-tr-[28px] rounded-tl-[28px] bg-[#D0E46E] flex-col items-center justify-center flex-1">
              <View className="bg-[rgba(0,0,0,0.1)] w-[50px] h-[50px] p-4 rounded-full items-center justify-center mb-2">
                <CircularProgressBar
                  progress={93}
                  size={40}
                  strokeWidth={4}
                  color="#fff"
                  backgroundColor="rgba(25,31,52,0.2)"
                  showPercentage={true}
                  percentageTextSize={10}
                  percentageTextColor="white"
                />
              </View>

              <View className="flex-col items-center">
                <Text className="font-PoppinsSemiBold text-black text-lg">
                  Fat
                </Text>
                <Text className="font-Poppins text-black text-xs">
                  90.56 / 96g
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-col flex-1">
          <View className="bg-[#F1F4FF] flex-row items-center p-4 rounded-xl mb-4">
            <View className="flex-row items-center justify-center w-[50px] h-[50px] rounded-full bg-[#F4DB52] mr-4">
              <Ionicons name="restaurant-outline" size={24} color="black" />
            </View>

            <View className="flex-col">
              <Text className="font-PoppinsSemiBold text-black text-xl">
                Add Breakfast
              </Text>
              <Text className="font-Poppins text-black">
                Recommended: 440 - 615 kcal
              </Text>
            </View>

            <TouchableOpacity className="bg-white w-[40px] h-[40px] rounded-full border-black border-[1px] items-center justify-center ml-auto">
              <Ionicons name="add-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View className="bg-[#F1F4FF] flex-row items-center p-4 rounded-xl mb-4">
            <View className="flex-row items-center justify-center w-[50px] h-[50px] rounded-full bg-[#D2B8FA] mr-4">
              <Ionicons name="restaurant-outline" size={24} color="black" />
            </View>

            <View className="flex-col">
              <Text className="font-PoppinsSemiBold text-black text-xl">
                Add Lunch
              </Text>
              <Text className="font-Poppins text-black">
                Recommended: 527 - 703 kcal
              </Text>
            </View>

            <TouchableOpacity className="bg-white w-[40px] h-[40px] rounded-full border-black border-[1px] items-center justify-center ml-auto">
              <Ionicons name="add-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View className="bg-[#F1F4FF] flex-row items-center p-4 rounded-xl mb-4">
            <View className="flex-row items-center justify-center w-[50px] h-[50px] rounded-full bg-[#CDE26B] mr-4">
              <Ionicons name="restaurant-outline" size={24} color="black" />
            </View>

            <View className="flex-col">
              <Text className="font-PoppinsSemiBold text-black text-xl">
                Add Dinner
              </Text>
              <Text className="font-Poppins text-black">
                Recommended: 440 - 615 kcal
              </Text>
            </View>

            <TouchableOpacity className="bg-white w-[40px] h-[40px] rounded-full border-black border-[1px] items-center justify-center ml-auto">
              <Ionicons name="add-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
