import Typo from "@/components/Typo";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePickerWeek from "../../../components/DatePickerWeek";
import Loading from "../../../components/Loading";
import MealTimeline, { type MealEntry } from "../../../components/MealTimeline";

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
  const { user, loading, uploadProfilePicture } = useAuth();
  const router = useRouter();
  const [showPersonal, setShowPersonal] = useState(true);
  const [showHealth, setShowHealth] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // dummy data
  const [meals] = useState<MealEntry[]>([
    {
      id: "1",
      time: "07:00",
      title: "Coffee and Toast",
      calories: 200,
      macros: {
        carbs: 25,
        protein: 5,
        fat: 8,
      },
      icon: "cafe",
      isLogged: true,
      mealType: "Breakfast",
    },
    {
      id: "2",
      time: "08:00",
      title: "Oatmeal with Berries and Almonds",
      calories: 300,
      macros: {
        carbs: 45,
        protein: 8,
        fat: 10,
      },
      icon: "restaurant",
      isLogged: true,
      mealType: "Breakfast",
    },
    {
      id: "3",
      time: "10:00",
      title: "Greek Yogurt with Honey",
      calories: 150,
      macros: {
        carbs: 20,
        protein: 15,
        fat: 3,
      },
      icon: "cafe",
      isLogged: true,
      mealType: "Breakfast",
    },
    {
      id: "4",
      time: "12:00",
      title: "Grilled Chicken Salad",
      calories: 450,
      macros: {
        carbs: 25,
        protein: 35,
        fat: 15,
      },
      icon: "leaf",
      isLogged: true,
      mealType: "Lunch",
    },
    {
      id: "5",
      time: "15:00",
      title: "Protein Smoothie",
      calories: 200,
      macros: {
        carbs: 15,
        protein: 25,
        fat: 5,
      },
      icon: "water",
      isLogged: true,
      mealType: "Lunch",
    },
    {
      id: "6",
      time: "19:00",
      title: "Salmon with Quinoa",
      calories: 520,
      macros: {
        carbs: 30,
        protein: 40,
        fat: 20,
      },
      icon: "fish",
      isLogged: false,
      mealType: "Dinner",
    },
  ]);

  // Handle date selection
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    console.log("Selected date:", date.toDateString());
  };

  // Handle meal editing
  const handleEditMeal = (mealId: string) => {
    console.log("Edit meal:", mealId);
    // Navigate to edit screen or show modal
  };

  // Open image picker and update avatar
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access gallery is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      try {
        await uploadProfilePicture(uri);
        alert("Profile picture updated successfully!");
      } catch (error) {
        console.error(error);
        alert("Failed to update profile picture.");
      }
    }
  };

  if (loading && !user) {
    return <Loading />;
  }

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#fff]" edges={["top"]}>
      <View className="flex-row items-center justify-between px-5 py-5 bg-transparent">
        <Typo size={24} className="font-PoppinsSemiBold">
          Meals
        </Typo>

        <TouchableOpacity className="w-10 h-10 rounded-full bg-[#FAFAFA] items-center justify-center">
          <Ionicons name="settings-outline" size={18} color="black" />
        </TouchableOpacity>
      </View>

      <DatePickerWeek
        onDateChange={handleDateChange}
        initialDate={selectedDate}
      />

      <MealTimeline meals={meals} onEditMeal={handleEditMeal} />
    </SafeAreaView>
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
