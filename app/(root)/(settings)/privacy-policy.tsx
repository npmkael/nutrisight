import { colors } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PrivacySection = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  content: string;
  details?: string[];
};

const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: "1",
    title: "Information We Collect",
    icon: "folder-outline",
    content:
      "We collect information that you provide directly to us and information that is automatically collected when you use NutriSight.",
    details: [
      "Account Information: Name, email address, date of birth, gender, and profile photo",
      "Health Data: Weight, height, dietary preferences, fitness goals, and allergen information",
      "Meal Data: Food photos, nutritional logs, meal timestamps, and manual entries",
      "Usage Data: App interactions, features used, and session duration",
      "Device Information: Device type, operating system, unique device identifiers, and mobile network information",
      "Location Data: Approximate location based on IP address (if permitted)",
    ],
  },
  {
    id: "2",
    title: "How We Use Your Data",
    icon: "settings-outline",
    content:
      "We use the information we collect to provide, maintain, and improve NutriSight's services and your user experience.",
    details: [
      "Provide personalized nutrition tracking and recommendations",
      "Analyze food images using AI to identify nutritional content",
      "Generate health insights and progress reports",
      "Send important notifications about your goals and achievements",
      "Improve our AI models and app functionality",
      "Respond to your support requests and communications",
      "Detect and prevent fraud, abuse, and security incidents",
      "Comply with legal obligations and enforce our terms",
    ],
  },
  {
    id: "3",
    title: "Data Sharing & Disclosure",
    icon: "share-social-outline",
    content:
      "We respect your privacy and do not sell your personal data. We may share your information only in the following circumstances:",
    details: [
      "With Your Consent: When you explicitly authorize us to share specific information",
      "Service Providers: Third-party vendors who perform services on our behalf (e.g., cloud hosting, analytics, customer support)",
      "Healthcare Providers: If you choose to export and share your nutrition reports with your doctor or dietitian",
      "Legal Requirements: When required by law, court order, or government request",
      "Business Transfers: In connection with a merger, acquisition, or sale of assets",
      "Aggregated Data: Anonymized, aggregated data that cannot identify you individually may be used for research and analytics",
    ],
  },
  {
    id: "4",
    title: "Data Security",
    icon: "shield-checkmark-outline",
    content:
      "We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.",
    details: [
      "Encryption: All data transmitted between your device and our servers is encrypted using SSL/TLS",
      "Secure Storage: Your data is stored on secure, encrypted servers with restricted access",
      "Authentication: Multi-factor authentication options to protect your account",
      "Regular Audits: Periodic security assessments and vulnerability testing",
      "Access Controls: Strict employee access policies and confidentiality agreements",
      "Data Backup: Regular backups to prevent data loss",
    ],
  },
  {
    id: "5",
    title: "Your Privacy Rights",
    icon: "hand-right-outline",
    content:
      "You have certain rights regarding your personal data. Depending on your location, these may include:",
    details: [
      "Access: Request a copy of the personal data we hold about you",
      "Correction: Update or correct inaccurate information",
      "Deletion: Request deletion of your account and associated data",
      "Portability: Receive your data in a portable, machine-readable format",
      "Opt-Out: Unsubscribe from marketing communications at any time",
      "Restrict Processing: Limit how we use your data in certain circumstances",
      "Object: Object to processing of your data for specific purposes",
    ],
  },
  {
    id: "6",
    title: "Data Retention",
    icon: "time-outline",
    content:
      "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.",
    details: [
      "Active Accounts: Data is retained while your account is active",
      "Inactive Accounts: After 24 months of inactivity, we may delete your account and data",
      "Deleted Accounts: Most data is deleted within 30 days of account deletion",
      "Legal Requirements: Some data may be retained longer to comply with legal obligations",
      "Backup Systems: Data in backup systems may persist for up to 90 days after deletion",
    ],
  },
  {
    id: "7",
    title: "Cookies & Tracking",
    icon: "analytics-outline",
    content:
      "We use cookies and similar tracking technologies to enhance your experience and understand how you use NutriSight.",
    details: [
      "Essential Cookies: Required for basic app functionality and security",
      "Analytics: To understand usage patterns and improve our services",
      "Preferences: To remember your settings and preferences",
      "You can control cookies through your device settings, but disabling them may affect app functionality",
    ],
  },
  {
    id: "8",
    title: "Third-Party Services",
    icon: "link-outline",
    content:
      "NutriSight may integrate with third-party services for enhanced functionality. These services have their own privacy policies.",
    details: [
      "Cloud Storage: Amazon Web Services (AWS) or Google Cloud Platform",
      "Analytics: Google Analytics or similar platforms",
      "Authentication: Google Sign-In, Apple Sign-In",
      "We recommend reviewing the privacy policies of these third-party services",
    ],
  },
  {
    id: "9",
    title: "Children's Privacy",
    icon: "shield-outline",
    content:
      "NutriSight is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.",
    details: [
      "If we learn that we have collected information from a child under 13, we will delete it immediately",
      "Parents or guardians who believe their child has provided information should contact us",
      "Users between 13-18 should use the app with parental consent",
    ],
  },
  {
    id: "10",
    title: "International Data Transfers",
    icon: "globe-outline",
    content:
      "Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.",
  },
  {
    id: "11",
    title: "Changes to This Policy",
    icon: "refresh-outline",
    content:
      "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or in-app notification. Your continued use after changes constitutes acceptance.",
  },
  {
    id: "12",
    title: "Contact Us",
    icon: "mail-outline",
    content:
      "If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:",
    details: [
      "Email: privacy@nutrisight.com",
      "Support: support@nutrisight.com",
      "Address: NutriSight Inc., 123 Health Street, Wellness City, CA 90210",
    ],
  },
];

function PrivacyPolicy() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={32} color={colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Your Privacy Matters</Text>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.dateText}>Effective Date: January 1, 2025</Text>
          </View>
          <Text style={styles.headerSubtext}>
            At NutriSight, we are committed to protecting your privacy and
            ensuring your personal data is handled securely and transparently.
            This policy explains how we collect, use, and safeguard your
            information.
          </Text>
        </View>

        {/* Trust Badges */}
        <View style={styles.trustBadges}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            <Text style={styles.badgeText}>Encrypted</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="lock-closed" size={20} color="#3B82F6" />
            <Text style={styles.badgeText}>Secure</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="eye-off" size={20} color="#8B5CF6" />
            <Text style={styles.badgeText}>Private</Text>
          </View>
        </View>

        {/* Privacy Sections */}
        <View style={styles.sectionsContainer}>
          {PRIVACY_SECTIONS.map((section) => (
            <PrivacySection
              key={section.id}
              section={section}
              isExpanded={expandedId === section.id}
              onToggle={() => handleToggle(section.id)}
            />
          ))}
        </View>

        {/* Footer Info */}
        <View style={styles.footerCard}>
          <View style={styles.footerHeader}>
            <View style={styles.footerIconCircle}>
              <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            </View>
            <Text style={styles.footerTitle}>Your Data, Your Rights</Text>
          </View>
          <Text style={styles.footerDescription}>
            We are committed to protecting your privacy and ensuring
            transparency in how we handle your personal information.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default memo(PrivacyPolicy);

// Privacy Section Component
const PrivacySection = ({
  section,
  isExpanded,
  onToggle,
}: {
  section: PrivacySection;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  return (
    <View style={styles.privacyItem}>
      <TouchableOpacity
        style={styles.privacyHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.privacyHeaderLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name={section.icon} size={22} color={colors.primary} />
          </View>
          <Text style={styles.privacyTitle}>{section.title}</Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#9CA3AF"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.privacyContent}>
          <Text style={styles.privacyText}>{section.content}</Text>
          {section.details && section.details.length > 0 && (
            <View style={styles.detailsContainer}>
              {section.details.map((detail, index) => (
                <View key={index} style={styles.detailItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.detailText}>{detail}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  headerCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(45, 54, 68, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "PoppinsSemiBold",
    color: colors.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  dateText: {
    fontSize: 13,
    fontFamily: "PoppinsMedium",
    color: "#6B7280",
  },
  headerSubtext: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  trustBadges: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  badge: {
    alignItems: "center",
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "PoppinsSemiBold",
    color: "#6B7280",
  },
  sectionsContainer: {
    marginBottom: 20,
  },
  privacyItem: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  privacyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  privacyHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(45, 54, 68, 0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  privacyTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
    color: colors.primary,
  },
  privacyContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  privacyText: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#374151",
    lineHeight: 24,
    marginBottom: 12,
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: 12,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#6B7280",
    lineHeight: 22,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
    color: "white",
  },
  footerCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  footerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  footerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  footerTitle: {
    fontSize: 18,
    fontFamily: "PoppinsSemiBold",
    color: "#166534",
  },
  footerDescription: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#15803D",
    lineHeight: 22,
  },
  footerDivider: {
    height: 1,
    backgroundColor: "#BBF7D0",
    marginBottom: 16,
  },
  footerPoints: {
    gap: 12,
  },
  footerPoint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  footerPointText: {
    fontSize: 13,
    fontFamily: "Poppins",
    color: "#15803D",
    lineHeight: 20,
    textAlign: "center",
  },
});
