import { formatDateToMMDDYYYY } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { memo, useCallback, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
                gender === "male"
                  ? "bg-black border-black"
                  : "bg-white border-gray-300"
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
                  : "bg-white border-gray-300"
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
                  : "bg-white border-gray-300"
              }`}
              onPress={() => setGender("other")}
            >
              <Text
                className={`text-center font-PoppinsMedium text-base ${
                  gender === "other" ? "text-white" : "text-black"
                }`}
              >
                Other
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Age Section */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Date of Birth</Text>
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
    </SafeAreaView>
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
