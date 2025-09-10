import { formatDateToMMDDYYYY } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { memo, useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useOnboarding } from "./_layout";

function GenderAndAge() {
  const { gender, setGender, birthDate, setBirthDate } = useOnboarding();
  const [showPicker, setShowPicker] = useState(false);

  // Helper to handle date selection
  const handleDateChange = useCallback((_event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  }, []);

  return (
    <Animated.View className="flex-1 bg-white" entering={FadeIn.duration(600)}>
      <View className="flex-1 px-4">
        <Text className="text-3xl font-PoppinsSemiBold text-black mb-8">
          Personal details
        </Text>

        {/* Gender Section */}
        <View className="mb-6">
          <Text className="font-Poppins text-md text-foreground mb-1">
            Gender
          </Text>
          <View className="flex-col gap-3">
            <TouchableOpacity
              className={`flex-1 py-4 px-6 rounded-lg border ${
                gender === "male"
                  ? "bg-black border-black"
                  : "bg-white border-border"
              }`}
              onPress={() => setGender("male")}
            >
              <Text
                className={`text-center font-PoppinsMedium text-base ${
                  gender === "male" ? "text-white" : "text-black"
                }`}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-4 px-6 rounded-lg border ${
                gender === "female"
                  ? "bg-black border-black"
                  : "bg-white border-border"
              }`}
              onPress={() => setGender("female")}
            >
              <Text
                className={`text-center font-PoppinsMedium text-base ${
                  gender === "female" ? "text-white" : "text-black"
                }`}
              >
                Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-4 px-6 rounded-lg border ${
                gender === "other"
                  ? "bg-black border-black"
                  : "bg-white border-border"
              }`}
              onPress={() => setGender("other")}
            >
              <Text
                className={`text-center font-PoppinsMedium text-base ${
                  gender === "other" ? "text-white" : "text-black"
                }`}
              >
                Prefer not to say
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Age Section */}
        <View style={styles.fieldContainer}>
          <Text className="font-Poppins text-md text-foreground mb-1">
            Date of Birth
          </Text>
          <TouchableOpacity
            style={styles.dateInputContainer}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.dateText}>
              {formatDateToMMDDYYYY(birthDate)}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={birthDate ? new Date(birthDate) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>
      </View>
    </Animated.View>
  );
}

export default memo(GenderAndAge);

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
    fontFamily: "PoppinsMedium",
  },
  dateInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "white",
  },
  dateText: {
    fontSize: 16,
    color: "#111827",
    fontFamily: "Poppins",
  },
});
