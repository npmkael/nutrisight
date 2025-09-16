import { useAuth } from "@/context/AuthContext";
import { useAccountUpdate } from "@/hooks/useAccountUpdate";
import { colors } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useState } from "react";
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
  const { updateAccount, isLoading, error, response } = useAccountUpdate();
  const { user, setUser, uploadProfilePicture } = useAuth();

  const [username, setUsername] = useState(user?.name || "Uncle Bob");
  const [email, setEmail] = useState(user?.email || "uncle.bob@yourdomain.com");
  const [birthDate, setBirthDate] = useState<Date | null>(
    user?.birthDate ? new Date(user.birthDate as any) : null
  );
  const [showPicker, setShowPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    user?.profileLink || null
  );
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.name || "Uncle Bob");
      setBirthDate(user.birthDate ? new Date(user.birthDate as any) : null);
    }
  }, [user]);

  useEffect(() => {
    if (response) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: response.data.name,
              birthDate: response.data.birthDate,
              profileLink: response.data.profileLink,
            }
          : prev
      );
    }
  }, [response]);

  const pickImage = useCallback(async () => {
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
      // just preview the picked image — actual upload is a separate action
      setSelectedImage(uri);
    }
  }, [uploadProfilePicture]);

  const uploadProfileImage = useCallback(async () => {
    if (!selectedImage) return alert("No image selected");
    try {
      setUploadingImage(true);
      // reuse uploadProfilePicture from useAuth (it posts form field "profilePicture")
      await uploadProfilePicture(selectedImage);
      alert("Profile picture updated successfully!");
      router.back();
    } catch (err) {
      console.error("Upload profile picture error:", err);
      alert("Failed to upload profile picture.");
    } finally {
      setUploadingImage(false);
    }
  }, [selectedImage, uploadProfilePicture]);

  const back = useCallback(() => {
    router.back();
  }, [router]);

  const formatDate = useCallback((d: any) => {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "";
    return dt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const payload: any = {
      name: username,
      birthDate: birthDate || user?.birthDate,
    };

    await updateAccount(payload);
    if (!error) {
      alert("Profile updated successfully!");
      router.back();
    }
  }, [username, birthDate, updateAccount, error, router]);

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
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={pickImage}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Image
                source={
                  selectedImage
                    ? { uri: selectedImage }
                    : require("@/assets/images/sample-profile.jpg")
                }
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editPhotoButton}
              onPress={pickImage}
              accessibilityLabel="Change profile photo"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View style={styles.editIcon}>
                <Ionicons name="pencil" size={12} color="white" />
              </View>
            </TouchableOpacity>
            {/* Save profile picture button (separate from save changes) */}
            <View style={{ marginTop: 12, flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                onPress={uploadProfileImage}
                disabled={!selectedImage || uploadingImage}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  backgroundColor: selectedImage ? colors.primary : "#E5E7EB",
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white", fontFamily: "PoppinsSemiBold" }}>
                  {uploadingImage ? "Uploading..." : "Save Photo"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Username */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Username</Text>
            <TextInput
              style={styles.textInput}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
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
                accessibilityState={{ disabled: true }}
                editable={false}
              />
            </View>
          </View>

          {/* Gender */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Gender</Text>
            <TouchableOpacity style={styles.dropdownContainer}>
              <Text style={styles.dropdownText}>
                {user?.gender
                  ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                  : ""}
              </Text>
              {/* <Ionicons name="chevron-down" size={20} color="#9CA3AF" /> */}
            </TouchableOpacity>
          </View>

          {/* Date of Birth */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Date of Birth</Text>
            <TouchableOpacity
              style={styles.dateInputContainer}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(birthDate)}</Text>
              <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={birthDate ?? new Date()}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={(_e, selectedDate) => {
                  setShowPicker(false);
                  if (selectedDate) setBirthDate(selectedDate);
                }}
              />
            )}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
              marginTop: 10,
              marginBottom: 30,
            }}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontFamily: "PoppinsSemiBold",
              }}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
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
