import Typo from "@/components/Typo";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { memo } from "react";
import Loading from "../../../components/Loading";

function Settings() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Handler functions for various settings actions
  const handleChangePassword = () => {
    router.push("/(root)/(settings)/change-password");
  };

  const handleNotificationSettings = () => {
    Alert.alert(
      "Notification Settings",
      "Notification preferences coming soon!",
      [{ text: "OK" }]
    );
  };

  const handlePrivacySettings = () => {
    Alert.alert("Privacy Settings", "Privacy controls coming soon!", [
      { text: "OK" },
    ]);
  };

  const handleLanguageSettings = () => {
    Alert.alert("Language & Region", "Language settings coming soon!", [
      { text: "OK" },
    ]);
  };

  const handleHelpSupport = () => {
    Linking.openURL("mailto:support@nutrisight.com?subject=Help & Support");
  };

  const handleUserGuide = () => {
    Alert.alert("User Guide", "User guide coming soon!", [{ text: "OK" }]);
  };

  const handleSendFeedback = () => {
    Alert.alert("Send Feedback", "Feedback form coming soon!", [
      { text: "OK" },
    ]);

    // Linking.openURL("mailto:feedback@nutrisight.com?subject=App Feedback");
  };

  const handleRateApp = () => {
    Alert.alert("Rate App", "Rate our app coming soon!", [{ text: "OK" }]);

    // Replace with your actual App Store URL
    // const appStoreUrl = "https://apps.apple.com/app/nutrisight";
    // Linking.openURL(appStoreUrl).catch(() => {
    //   Alert.alert("Error", "Unable to open App Store");
    // });
  };

  const handleTermsOfService = () => {
    Alert.alert("Terms of Service", "Terms of Service coming soon!", [
      { text: "OK" },
    ]);

    // Linking.openURL("https://nutrisight.com/terms").catch(() => {
    //   Alert.alert("Terms of Service", "Terms of Service coming soon!");
    // });
  };

  const handlePrivacyPolicy = () => {
    Alert.alert("Privacy Policy", "Privacy Policy coming soon!", [
      { text: "OK" },
    ]);

    // Linking.openURL("https://nutrisight.com/privacy").catch(() => {
    //   Alert.alert("Privacy Policy", "Privacy Policy coming soon!");
    // });
  };

  const handleAbout = () => {
    Alert.alert("About", "About coming soon!", [{ text: "OK" }]);

    // Alert.alert(
    //   "About NutriSight",
    //   "NutriSight v1.0.0\n\nYour personalized nutrition companion. Track your food, analyze nutrition, and achieve your health goals.\n\nDeveloped with ❤️ for better health.",
    //   [{ text: "OK" }]
    // );
  };

  const handleContactUs = () => {
    Alert.alert("Contact Us", "Contact Us coming soon!", [{ text: "OK" }]);

    // Linking.openURL("mailto:contact@nutrisight.com?subject=Contact Us");
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };

  if (loading && !user) return <Loading />;

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={["top"]}>
      {/* Fixed Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-transparent">
        <Typo size={24} className="font-PoppinsSemiBold">
          Settings
        </Typo>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
      >
        <Container className="px-4 py-4 mb-6">
          <TouchableOpacity
            className="flex-row items-center justify-between gap-2"
            onPress={() => router.push("/(root)/(settings)/details")}
          >
            <View className="flex-row items-center gap-4">
              <View>
                <Image
                  source={
                    user?.profileLink
                      ? { uri: user.profileLink }
                      : require("../../../assets/images/sample-profile.jpg")
                  }
                  className="w-16 h-16 rounded-full"
                />
              </View>
              <View className="flex-col gap-1">
                <Text className="text-md font-PoppinsSemiBold">
                  {user.name ? user.name : "N/A"}
                </Text>
                <Text className="text-sm font-Poppins text-gray-500">
                  {user.email ? user.email : "No email"}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={14} color="grey" />
          </TouchableOpacity>
        </Container>

        {/* Account Management Section */}
        <Container className="px-4 py-2 mb-6">
          <Text className="text-xs font-PoppinsSemiBold text-gray-600 uppercase tracking-wide mb-3 px-1">
            Account Management
          </Text>

          <SettingsItem
            icon={<Ionicons name="person-outline" size={20} color="#6B7280" />}
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() => router.push("/(root)/(settings)/details")}
          />

          <SettingsItem
            icon={<Ionicons name="key-outline" size={20} color="#6B7280" />}
            title="Change Password"
            subtitle="Update your account password"
            onPress={() => handleChangePassword()}
          />

          <SettingsItem
            icon={<Ionicons name="shield-outline" size={20} color="#6B7280" />}
            title="Privacy Settings"
            subtitle="Control your privacy options"
            onPress={() => handlePrivacySettings()}
            showDivider={false}
          />
        </Container>

        {/* App Preferences Section */}
        <Container className="px-4 py-2 mb-6">
          <Text className="text-xs font-PoppinsSemiBold text-gray-600 uppercase tracking-wide mb-3 px-1">
            App Preferences
          </Text>

          <SettingsItem
            icon={
              <Ionicons name="restaurant-outline" size={20} color="#6B7280" />
            }
            title="Dietary Goals"
            subtitle="Set your nutrition targets"
            onPress={() => router.push("/(root)/(settings)/dietary-goals")}
          />

          <SettingsItem
            icon={<Ionicons name="scale-outline" size={20} color="#6B7280" />}
            title="Weight Tracking"
            subtitle="Manage weight goals and history"
            onPress={() => router.push("/(root)/log-weight")}
          />

          <SettingsItem
            icon={<Ionicons name="warning-outline" size={20} color="#6B7280" />}
            title="Allergens"
            subtitle="Set your food allergens"
            onPress={() => router.push("/(root)/(settings)/allergens")}
            showDivider={false}
          />
        </Container>

        {/* Support & Help Section */}
        <Container className="px-4 py-2 mb-6">
          <Text className="text-xs font-PoppinsSemiBold text-gray-600 uppercase tracking-wide mb-3 px-1">
            Support & Help
          </Text>

          <SettingsItem
            icon={
              <Ionicons name="help-circle-outline" size={20} color="#6B7280" />
            }
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={() => handleHelpSupport()}
          />

          <SettingsItem
            icon={
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#6B7280"
              />
            }
            title="User Guide"
            subtitle="Learn how to use NutriSight"
            onPress={() => handleUserGuide()}
          />

          <SettingsItem
            icon={
              <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
            }
            title="Send Feedback"
            subtitle="Help us improve the app"
            onPress={() => handleSendFeedback()}
            showDivider={false}
          />
        </Container>

        {/* Legal & About Section */}
        <Container className="px-4 py-2 mb-6">
          <Text className="text-xs font-PoppinsSemiBold text-gray-600 uppercase tracking-wide mb-3 px-1">
            Legal & About
          </Text>

          <SettingsItem
            icon={
              <Ionicons name="document-outline" size={20} color="#6B7280" />
            }
            title="Terms of Service"
            subtitle="Read our terms and conditions"
            onPress={() => handleTermsOfService()}
          />

          <SettingsItem
            icon={
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
            }
            title="Privacy Policy"
            subtitle="Learn about data protection"
            onPress={() => handlePrivacyPolicy()}
          />

          <SettingsItem
            icon={
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#6B7280"
              />
            }
            title="About NutriSight"
            subtitle="App information and credits"
            onPress={() => handleAbout()}
          />

          <SettingsItem
            icon={<Ionicons name="mail-outline" size={20} color="#6B7280" />}
            title="Contact Us"
            subtitle="Get in touch with our team"
            onPress={() => handleContactUs()}
            showDivider={false}
          />
        </Container>

        {/* Logout Section */}
        <Container className="px-4 py-4 mb-6">
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center gap-3"
          >
            <MaterialIcons name="logout" size={20} color="#EF4444" />
            <Text className="text-base font-PoppinsMedium text-red-500">
              Sign Out
            </Text>
          </TouchableOpacity>
        </Container>

        {/* App Version */}
        <View className="items-center mb-4">
          <Text className="text-xs font-Poppins text-gray-400 uppercase tracking-wide">
            NutriSight Version 1.0.0
          </Text>
          <Text className="text-xs font-Poppins text-gray-400 mt-1">
            © 2025 NutriSight. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default memo(Settings);

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <View className={`bg-white rounded-2xl shadow-sm ${className}`}>
      {children}
    </View>
  );
};

const SettingsItem = ({
  icon,
  title,
  subtitle,
  onPress,
  showDivider = true,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showDivider?: boolean;
}) => {
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center py-3 px-1"
        activeOpacity={0.7}
      >
        <View className="mr-3">{icon}</View>
        <View className="flex-1">
          <Text className="text-base font-PoppinsMedium text-gray-900">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm font-Poppins text-gray-500 mt-0.5">
              {subtitle}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
      </TouchableOpacity>
      {showDivider && <View className="h-px bg-gray-100 ml-8" />}
    </>
  );
};
