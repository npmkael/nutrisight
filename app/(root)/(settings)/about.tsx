import { colors } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar: any;
};

type Feature = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Founder & CEO",
    avatar: require("@/assets/images/default-profile.jpg"),
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    role: "Chief Nutritionist",
    avatar: require("@/assets/images/default-profile.jpg"),
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Lead Developer",
    avatar: require("@/assets/images/default-profile.jpg"),
  },
  {
    id: "4",
    name: "David Kim",
    role: "AI Engineer",
    avatar: require("@/assets/images/default-profile.jpg"),
  },
];

const FEATURES: Feature[] = [
  {
    id: "1",
    icon: "camera",
    title: "AI Food Recognition",
    description: "Scan meals instantly with advanced computer vision",
  },
  {
    id: "2",
    icon: "analytics",
    title: "Smart Analytics",
    description: "Track macros, calories, and nutritional patterns",
  },
  {
    id: "3",
    icon: "fitness",
    title: "Goal Tracking",
    description: "Set and achieve personalized health objectives",
  },
  {
    id: "4",
    icon: "shield-checkmark",
    title: "Privacy First",
    description: "Your data is encrypted and fully protected",
  },
];

function About() {
  const router = useRouter();

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(() => {
      console.error("Failed to open URL:", url);
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient
        colors={["rgba(236, 190, 88, 0.08)", "rgba(54, 102, 157, 0.08)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>About NutriSight</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Logo & Brand Section */}
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/full-icon.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandName}>NutriSight</Text>
            <Text style={styles.tagline}>
              Your Personalized Nutrition Companion
            </Text>
            <View style={styles.versionContainer}>
              <Ionicons name="code-slash-outline" size={16} color="#6B7280" />
              <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
          </View>

          {/* Mission Statement */}
          <View style={styles.missionSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="heart" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Our Mission</Text>
            </View>
            <Text style={styles.missionText}>
              At NutriSight, we believe that everyone deserves access to simple,
              effective nutrition tracking. Our mission is to empower
              individuals to make informed dietary choices through innovative AI
              technology, personalized insights, and a user-friendly experience.
            </Text>
            <Text style={styles.missionText}>
              We're committed to helping you achieve balanced nutrition, reach
              your health goals, and live a healthier, more vibrant life—one
              meal at a time.
            </Text>
          </View>

          {/* Key Features */}
          <View style={styles.featuresSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="star" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>What We Offer</Text>
            </View>
            <View style={styles.featuresGrid}>
              {FEATURES.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </View>
          </View>

          {/* Team Section */}
          <View style={styles.teamSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Meet the Team</Text>
            </View>
            <Text style={styles.teamIntro}>
              NutriSight is built by a passionate team of nutritionists,
              developers, and designers dedicated to revolutionizing how people
              track their health.
            </Text>
            <View style={styles.teamGrid}>
              {TEAM_MEMBERS.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </View>
          </View>

          {/* Values Section */}
          <View style={styles.valuesSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bulb" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Our Values</Text>
            </View>
            <View style={styles.valuesList}>
              <ValueItem
                icon="shield-checkmark"
                title="Privacy & Security"
                description="Your health data is yours. We never sell or share it without consent."
              />
              <ValueItem
                icon="flash"
                title="Innovation"
                description="Constantly improving our AI to deliver the most accurate nutrition insights."
              />
              <ValueItem
                icon="people"
                title="Community"
                description="Building a supportive ecosystem for health-conscious individuals worldwide."
              />
              <ValueItem
                icon="leaf"
                title="Sustainability"
                description="Promoting sustainable eating habits for a healthier planet."
              />
            </View>
          </View>

          {/* Contact & Social Section */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Get in Touch</Text>
            <Text style={styles.contactSubtext}>
              We'd love to hear from you! Connect with us on social media or
              reach out via email.
            </Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() =>
                  handleLinkPress("https://twitter.com/nutrisight")
                }
              >
                <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() =>
                  handleLinkPress("https://facebook.com/nutrisight")
                }
              >
                <Ionicons name="logo-facebook" size={24} color="#4267B2" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() =>
                  handleLinkPress("https://instagram.com/nutrisight")
                }
              >
                <Ionicons name="logo-instagram" size={24} color="#E4405F" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleLinkPress("mailto:hello@nutrisight.com")}
              >
                <Ionicons name="mail" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Made with ❤️ for better health
            </Text>
            <Text style={styles.footerCopyright}>
              © 2025 NutriSight. All rights reserved.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

export default memo(About);

// Feature Card Component
const FeatureCard = ({ feature }: { feature: Feature }) => {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureIconContainer}>
        <Ionicons name={feature.icon} size={28} color={colors.primary} />
      </View>
      <Text style={styles.featureTitle}>{feature.title}</Text>
      <Text style={styles.featureDescription}>{feature.description}</Text>
    </View>
  );
};

// Team Card Component
const TeamCard = ({ member }: { member: TeamMember }) => {
  return (
    <View style={styles.teamCard}>
      <Image source={member.avatar} style={styles.avatar} />
      <Text style={styles.memberName}>{member.name}</Text>
      <Text style={styles.memberRole}>{member.role}</Text>
    </View>
  );
};

// Value Item Component
const ValueItem = ({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) => {
  return (
    <View style={styles.valueItem}>
      <View style={styles.valueIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.valueContent}>
        <Text style={styles.valueTitle}>{title}</Text>
        <Text style={styles.valueDescription}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F4F4",
    zIndex: 1,
  },
  headerSpacer: {
    width: 40,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  brandSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 32,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(45, 54, 68, 0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  logo: {
    width: 80,
    height: 80,
  },
  brandName: {
    fontSize: 28,
    fontFamily: "PoppinsSemiBold",
    color: colors.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    fontFamily: "Poppins",
    color: "#6B7280",
    marginBottom: 16,
    textAlign: "center",
  },
  versionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  versionText: {
    fontSize: 13,
    fontFamily: "PoppinsMedium",
    color: "#6B7280",
  },
  missionSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "PoppinsSemiBold",
    color: colors.primary,
  },
  missionText: {
    fontSize: 15,
    fontFamily: "Poppins",
    color: "#374151",
    lineHeight: 24,
    marginBottom: 12,
  },
  featuresSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },
  featureCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(45, 54, 68, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
    color: colors.primary,
    marginBottom: 6,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 12,
    fontFamily: "Poppins",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
  },
  teamSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  teamIntro: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#6B7280",
    lineHeight: 22,
    marginBottom: 20,
  },
  teamGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  teamCard: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  memberName: {
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 12,
    fontFamily: "Poppins",
    color: "#6B7280",
    textAlign: "center",
  },
  valuesSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  valuesList: {
    marginTop: 8,
  },
  valueItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  valueIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(45, 54, 68, 0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  valueContent: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 15,
    fontFamily: "PoppinsSemiBold",
    color: colors.primary,
    marginBottom: 4,
  },
  valueDescription: {
    fontSize: 13,
    fontFamily: "Poppins",
    color: "#6B7280",
    lineHeight: 20,
  },
  contactSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactTitle: {
    fontSize: 20,
    fontFamily: "PoppinsSemiBold",
    color: colors.primary,
    marginBottom: 8,
  },
  contactSubtext: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#6B7280",
    marginBottom: 6,
  },
  footerCopyright: {
    fontSize: 12,
    fontFamily: "Poppins",
    color: "#9CA3AF",
  },
});
