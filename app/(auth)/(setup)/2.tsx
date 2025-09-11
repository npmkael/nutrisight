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
        <View style={{ marginBottom: 24 }}>
          <Text style={[styles.fieldLabel, { marginBottom: 8 }]}>Gender</Text>

          <View style={{ flexDirection: "column", rowGap: 12 }}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "male"
                  ? styles.genderButtonActive
                  : styles.genderButtonInactive,
              ]}
              onPress={() => setGender("male")}
              accessibilityLabel="Select male"
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "male" ? styles.genderTextActive : null,
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "female"
                  ? styles.genderButtonActive
                  : styles.genderButtonInactive,
              ]}
              onPress={() => setGender("female")}
              accessibilityLabel="Select female"
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "female" ? styles.genderTextActive : null,
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "other"
                  ? styles.genderButtonActive
                  : styles.genderButtonInactive,
              ]}
              onPress={() => setGender("other")}
              accessibilityLabel="Prefer not to say"
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "other" ? styles.genderTextActive : null,
                ]}
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

  /* added styles */
  genderButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  genderButtonActive: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  genderButtonInactive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
  },
  genderText: {
    fontSize: 16,
    color: "#111827",
    fontFamily: "Poppins",
  },
  genderTextActive: {
    color: "#FFFFFF",
    fontFamily: "PoppinsMedium",
  },
});
