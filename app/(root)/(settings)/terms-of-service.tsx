import { colors } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

type TermSection = {
  id: string;
  title: string;
  content: string;
  subsections?: { subtitle: string; text: string }[];
};

const TERMS_SECTIONS: TermSection[] = [
  {
    id: "1",
    title: "1. Acceptance of Terms",
    content:
      "By downloading, accessing, or using NutriSight ('the App'), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the App. We reserve the right to modify these terms at any time, and your continued use of the App constitutes acceptance of any changes.",
  },
  {
    id: "2",
    title: "2. Use of Service",
    content:
      "NutriSight provides nutrition tracking and health monitoring services. You agree to use the App only for lawful purposes and in accordance with these Terms.",
    subsections: [
      {
        subtitle: "Account Responsibility",
        text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.",
      },
      {
        subtitle: "Accurate Information",
        text: "You agree to provide accurate, current, and complete information when using the App and to update such information as necessary.",
      },
      {
        subtitle: "Prohibited Uses",
        text: "You may not use the App for any illegal purpose, to violate any laws, or to infringe upon the rights of others.",
      },
    ],
  },
  {
    id: "3",
    title: "3. Health Disclaimer",
    content:
      "NutriSight is designed for informational and tracking purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment.",
    subsections: [
      {
        subtitle: "Not Medical Advice",
        text: "The nutritional information and recommendations provided by the App should not be considered medical advice. Always consult with a qualified healthcare provider before making dietary changes.",
      },
      {
        subtitle: "Accuracy Limitations",
        text: "While we strive for accuracy, nutritional data may not be 100% precise. AI-powered food recognition may contain errors. Users should verify nutritional information when necessary.",
      },
      {
        subtitle: "Individual Results",
        text: "Results may vary. Your health outcomes depend on many factors beyond the App's control, including genetics, lifestyle, and adherence to recommendations.",
      },
    ],
  },
  {
    id: "4",
    title: "4. Intellectual Property",
    content:
      "All content, features, and functionality of NutriSight, including but not limited to text, graphics, logos, images, and software, are the exclusive property of NutriSight and are protected by international copyright, trademark, and other intellectual property laws.",
  },
  {
    id: "5",
    title: "5. User Content",
    content:
      "You retain ownership of any content you submit to the App, including food photos and personal data. By uploading content, you grant NutriSight a worldwide, non-exclusive, royalty-free license to use, store, and display such content for the purpose of providing and improving our services.",
  },
  {
    id: "6",
    title: "6. Privacy and Data",
    content:
      "Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand how we collect, use, and protect your data.",
  },
  {
    id: "7",
    title: "7. Limitation of Liability",
    content:
      "To the fullest extent permitted by law, NutriSight and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the App.",
  },
  {
    id: "8",
    title: "8. Termination",
    content:
      "We reserve the right to suspend or terminate your access to the App at any time, with or without notice, for any reason, including violation of these Terms. Upon termination, your right to use the App will immediately cease.",
  },
  {
    id: "9",
    title: "9. Changes to Terms",
    content:
      "We may update these Terms of Service from time to time. We will notify you of any material changes by posting the new terms in the App or via email. Your continued use after changes are posted constitutes acceptance of the modified terms.",
  },
  {
    id: "10",
    title: "10. Contact Information",
    content:
      "If you have any questions about these Terms of Service, please contact us at: support@nutrisight.com",
  },
];

function TermsOfService() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
          <Text style={styles.title}>Terms of Service</Text>
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
              <Ionicons name="document-text" size={32} color={colors.primary} />
            </View>
            <Text style={styles.headerTitle}>NutriSight Terms of Service</Text>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={16} color="#6B7280" />
              <Text style={styles.dateText}>Last Updated: October 5, 2025</Text>
            </View>
            <Text style={styles.headerSubtext}>
              Please read these terms carefully before using NutriSight. By
              using our app, you agree to these terms and conditions.
            </Text>
          </View>

          {/* Terms Sections */}
          <View style={styles.sectionsContainer}>
            {TERMS_SECTIONS.map((section) => (
              <TermsSection
                key={section.id}
                section={section}
                isExpanded={expandedId === section.id}
                onToggle={() => handleToggle(section.id)}
              />
            ))}
          </View>

          {/* Acknowledgment Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.acknowledgeButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.acknowledgeButtonText}>I Understand</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Info */}
          <View style={styles.footerInfo}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#9CA3AF"
            />
            <Text style={styles.footerText}>
              These terms govern your use of NutriSight and constitute a legal
              agreement between you and NutriSight.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

export default memo(TermsOfService);

// Terms Section Component
const TermsSection = ({
  section,
  isExpanded,
  onToggle,
}: {
  section: TermSection;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  return (
    <View style={styles.termsItem}>
      <TouchableOpacity
        style={styles.termsHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.termsTitle}>{section.title}</Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#9CA3AF"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.termsContent}>
          <Text style={styles.termsText}>{section.content}</Text>
          {section.subsections && section.subsections.length > 0 && (
            <View style={styles.subsectionsContainer}>
              {section.subsections.map((subsection, index) => (
                <View key={index} style={styles.subsectionItem}>
                  <Text style={styles.subsectionTitle}>
                    {subsection.subtitle}
                  </Text>
                  <Text style={styles.subsectionText}>{subsection.text}</Text>
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
  headerCard: {
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
  sectionsContainer: {
    marginBottom: 20,
  },
  termsItem: {
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
  termsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  termsTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
    color: colors.primary,
    marginRight: 12,
  },
  termsContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  termsText: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#374151",
    lineHeight: 24,
    marginBottom: 12,
  },
  subsectionsContainer: {
    marginTop: 12,
  },
  subsectionItem: {
    marginBottom: 16,
    paddingLeft: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  subsectionTitle: {
    fontSize: 15,
    fontFamily: "PoppinsSemiBold",
    color: colors.primary,
    marginBottom: 6,
  },
  subsectionText: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#6B7280",
    lineHeight: 22,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  acknowledgeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  acknowledgeButtonText: {
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
    color: "white",
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Poppins",
    color: "#6B7280",
    lineHeight: 20,
  },
});
