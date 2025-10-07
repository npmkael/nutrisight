import { formatDateToMMDDYYYY, getAgeFromDOB } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { memo, useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useOnboarding } from "./_layout";

function GenderAndAge() {
  const { gender, setGender, birthDate, setBirthDate } = useOnboarding();
  const [showPicker, setShowPicker] = useState(false);
  const [age, setAge] = useState<number | null>(null);
  const [ageError, setAgeError] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate age whenever birthDate changes
  useEffect(() => {
    if (birthDate) {
      const calculatedAge = getAgeFromDOB(birthDate);
      setAge(calculatedAge);

      // Validate age range
      if (calculatedAge < 15) {
        setAgeError("You must be at least 15 years old to use this app.");
        setShowSuccess(false);
      } else if (calculatedAge > 65) {
        setAgeError("You must be 65 years old or younger to use this app.");
        setShowSuccess(false);
      } else {
        setAgeError("");
        setShowSuccess(true);
        
        // // Show success alert
        // Alert.alert(
        //   "Valid Birth Date",
        //   `Age ${calculatedAge} confirmed. You're all set!`,
        //   [{ text: "OK", style: "default" }]
        // );

        // // Hide success message after 3 seconds
        // setTimeout(() => {
        //   setShowSuccess(false);
        // }, 3000);
      }
    }
  }, [birthDate]);

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
            style={[
              styles.dateInputContainer,
              ageError && styles.dateInputError,
              showSuccess && styles.dateInputSuccess,
            ]}
            onPress={() => setShowPicker(true)}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={styles.dateText}>
                {formatDateToMMDDYYYY(birthDate)}
              </Text>
              {age !== null && (
                <Text style={styles.ageText}>({age} years old)</Text>
              )}
            </View>
            <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          {/* Error Message */}
          {ageError && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#EF4444" />
              <Text style={styles.errorText}>{ageError}</Text>
            </View>
          )}

          {/* Success Message */}
          {showSuccess && !ageError && (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.successText}>
                Valid age! You can proceed.
              </Text>
            </View>
          )}

          {showPicker && (
            <DateTimePicker
              value={birthDate ? new Date(birthDate) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date(new Date().getFullYear() - 65, 0, 1)}
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
  dateInputError: {
    borderColor: "#EF4444",
    borderWidth: 2,
  },
  dateInputSuccess: {
    borderColor: "#10B981",
    borderWidth: 2,
  },
  dateText: {
    fontSize: 16,
    color: "#111827",
    fontFamily: "Poppins",
  },
  ageText: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Poppins",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    fontFamily: "Poppins",
    flex: 1,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  successText: {
    fontSize: 14,
    color: "#10B981",
    fontFamily: "Poppins",
    flex: 1,
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
    backgroundColor: "#2D3644",
    borderColor: "#2D3644",
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
