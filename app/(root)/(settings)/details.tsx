import { useAuth } from "@/context/AuthContext";
import { colors } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo, useCallback, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <View className={`bg-white rounded-xl shadow-sm ${className}`}>
      {children}
    </View>
  );
};

function Details() {
  const router = useRouter();
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.name || "Uncle Bob");
  const [email, setEmail] = useState(user?.email || "uncle.bob@yourdomain.com");
  const [gender, setGender] = useState(user?.gender || "Male");
  const [dateOfBirth, setDateOfBirth] = useState("12-25-1995");

  const back = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f8f9fa" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={back}>
            <Ionicons name="arrow-back" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Personal Info</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Profile Photo Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require("@/assets/images/sample-profile.jpg")}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editPhotoButton}>
              <View style={styles.editIcon}>
                <Ionicons name="pencil" size={12} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Full Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
            />
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.textInput, styles.textInputWithIcon]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Gender */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Gender</Text>
            <TouchableOpacity style={styles.dropdownContainer}>
              <Text style={styles.dropdownText}>
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Date of Birth */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Date of Birth</Text>
            <TouchableOpacity style={styles.dateInputContainer}>
              <Text style={styles.dateText}>{dateOfBirth}</Text>
              <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default memo(Details);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: "PoppinsSemiBold",
    color: colors.primary,
    textAlign: "center",
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editPhotoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  editIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    flex: 1,
  },
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
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "white",
    fontFamily: "Poppins",
  },
  inputWithIcon: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    top: 18,
    zIndex: 1,
  },
  textInputWithIcon: {
    paddingLeft: 48,
  },
  phoneInputContainer: {
    flexDirection: "row",
    gap: 12,
  },
  countryFlag: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "white",
    gap: 8,
  },
  flagEmoji: {
    fontSize: 18,
  },
  phoneInput: {
    flex: 1,
  },
  dropdownContainer: {
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
  dropdownText: {
    fontSize: 16,
    color: "#111827",
    fontFamily: "Poppins",
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
