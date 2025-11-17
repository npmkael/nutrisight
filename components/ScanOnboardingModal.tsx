import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const STORAGE_KEY = "dontShowScanOnboarding";

interface ScanOnboardingModalProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  onClose: () => void;
  onComplete: () => void;
}

export function ScanOnboardingModal({
  bottomSheetRef,
  onClose,
  onComplete,
}: ScanOnboardingModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const snapPoints = useMemo(() => ["75%"], []);

  const handleViewFoodCoverage = useCallback(() => {
    bottomSheetRef.current?.close();
    setTimeout(() => {
      router.push("/(root)/(settings)/food-coverage");
    }, 300);
  }, [bottomSheetRef, router]);

  const steps = [
    {
      title: "Food Scan Mode",
      icon: "restaurant" as const,
      iconColor: "#10b981",
      content: (
        <View>
          <Text className="text-gray-700 font-Poppins text-sm mb-4">
            Use this mode to scan prepared foods and get instant nutrition
            information.
          </Text>

          <View className="mb-4">
            <View className="flex-row items-center mb-3">
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text className="text-gray-900 font-PoppinsSemiBold ml-2 text-sm">
                What We Can Recognize
              </Text>
            </View>

            {/* Food Coverage Link */}
            <TouchableOpacity
              onPress={handleViewFoodCoverage}
              className="bg-blue-50 rounded-xl p-4 border border-blue-100"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="bg-blue-100 rounded-full p-2 mr-3">
                    <Ionicons name="restaurant" size={20} color="#3b82f6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-blue-900 font-PoppinsSemiBold mb-0.5 text-sm">
                      View Food Coverage
                    </Text>
                    <Text className="text-blue-700 font-Poppins text-xs">
                      See the full list of foods we can recognize
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#3b82f6" />
              </View>
            </TouchableOpacity>
          </View>

          <View>
            <View className="flex-row items-center mb-2">
              <Ionicons name="close-circle" size={20} color="#ef4444" />
              <Text className="text-gray-900 font-PoppinsSemiBold ml-2 text-sm">
                Cannot Recognize
              </Text>
            </View>
            <Text className="text-gray-600 font-Poppins text-sm ml-7">
              • Packaged foods (use Barcode mode){"\n"}• Multiple mixed items
              {"\n"}• Very small or unclear items
            </Text>
          </View>
        </View>
      ),
    },
    {
      title: "Food Scan Tips",
      icon: "images" as const,
      iconColor: "#8b5cf6",
      content: (
        <View>
          <Text className="text-gray-700 font-Poppins text-sm mb-4">
            For best results with{" "}
            <Text className="font-PoppinsSemiBold">Food Scan mode</Text>, scan
            one item at a time.
          </Text>

          {/* Side by Side Examples */}
          <View className="flex-row gap-2">
            {/* Correct Example */}
            <View className="flex-1">
              <View className="relative">
                <Image
                  source={require("@/assets/images/correct-food.jpg")}
                  style={{
                    width: "100%",
                    height: 160,
                    borderRadius: 12,
                  }}
                  resizeMode="cover"
                />
                <View className="absolute top-2 right-2 bg-green-500 rounded-full p-1.5">
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
              </View>
              <View className="bg-green-50 rounded-xl p-2 mt-2 border border-green-100">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text className="text-green-900 font-PoppinsSemiBold ml-1.5 text-xs flex-1">
                    Single Food
                  </Text>
                </View>
                <Text className="text-green-800 font-Poppins text-xs leading-4">
                  Scan one item at a time
                </Text>
              </View>
            </View>

            {/* Incorrect Example */}
            <View className="flex-1">
              <View className="relative">
                <Image
                  source={require("@/assets/images/not-correct-food.jpg")}
                  style={{
                    width: "100%",
                    height: 160,
                    borderRadius: 12,
                  }}
                  resizeMode="cover"
                />
                <View className="absolute top-2 right-2 bg-red-500 rounded-full p-1.5">
                  <Ionicons name="close" size={16} color="white" />
                </View>
              </View>
              <View className="bg-red-50 rounded-xl p-2 mt-2 border border-red-100">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="close-circle" size={16} color="#ef4444" />
                  <Text className="text-red-900 font-PoppinsSemiBold ml-1.5 text-xs flex-1">
                    Multiple Foods
                  </Text>
                </View>
                <Text className="text-red-800 font-Poppins text-xs leading-4">
                  Not recommended
                </Text>
              </View>
            </View>
          </View>
        </View>
      ),
    },
    {
      title: "Food Scan Best Practices",
      icon: "camera" as const,
      iconColor: "#8b5cf6",
      content: (
        <View>
          <Text className="text-gray-700 font-Poppins text-sm mb-4">
            Follow these tips when using{" "}
            <Text className="font-PoppinsSemiBold">Food Scan mode</Text>:
          </Text>

          <ScanExampleCard
            icon="sunny-outline"
            iconColor="#10b981"
            iconBg="#dcfce7"
            title="Good Lighting"
            description="Use natural light or bright indoor lighting for best results"
            isGood
          />

          <View style={{ marginTop: 12 }}>
            <ScanExampleCard
              icon="scan-outline"
              iconColor="#10b981"
              iconBg="#dcfce7"
              title="Center the Food"
              description="Keep the food item centered in the camera frame"
              isGood
            />
          </View>

          <View style={{ marginTop: 12 }}>
            <ScanExampleCard
              icon="hand-left-outline"
              iconColor="#10b981"
              iconBg="#dcfce7"
              title="Hold Steady"
              description="Keep your phone still for 1-2 seconds"
              isGood
            />
          </View>
        </View>
      ),
    },
    {
      title: "Barcode Scan Mode",
      icon: "barcode" as const,
      iconColor: "#3b82f6",
      content: (
        <View>
          <Text className="text-gray-700 font-Poppins text-sm mb-4">
            Use this mode for packaged foods with barcodes to get accurate
            product nutrition data.
          </Text>

          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text className="text-gray-900 font-PoppinsSemiBold ml-2 text-sm">
                What We Can Scan
              </Text>
            </View>
            <Text className="text-gray-600 font-Poppins text-sm ml-7">
              • Packaged foods with UPC barcodes
            </Text>
          </View>

          <View>
            <View className="flex-row items-center mb-2">
              <Ionicons name="information-circle" size={20} color="#3b82f6" />
              <Text className="text-gray-900 font-PoppinsSemiBold ml-2 text-sm">
                How It Works
              </Text>
            </View>
            <Text className="text-gray-600 font-Poppins text-sm ml-7">
              Point your camera at the barcode and wait for automatic detection.
              The app will fetch nutrition data from our database or other
              nutrition databases APIs.
            </Text>
          </View>
        </View>
      ),
    },
    {
      title: "Barcode Scan Tips",
      icon: "scan" as const,
      iconColor: "#3b82f6",
      content: (
        <View>
          <Text className="text-gray-700 font-Poppins text-sm mb-4">
            Follow these tips when using{" "}
            <Text className="font-PoppinsSemiBold">Barcode Scan mode</Text>:
          </Text>

          <ScanExampleCard
            icon="barcode-outline"
            iconColor="#10b981"
            iconBg="#dcfce7"
            title="Center the Barcode"
            description="Position the barcode in the center and wait for automatic detection"
            isGood
          />

          <View style={{ marginTop: 12 }}>
            <ScanExampleCard
              icon="hand-left-outline"
              iconColor="#10b981"
              iconBg="#dcfce7"
              title="Hold Steady"
              description="Keep your phone still for 1-2 seconds"
              isGood
            />
          </View>

          <View style={{ marginTop: 12 }}>
            <ScanExampleCard
              icon="resize-outline"
              iconColor="#10b981"
              iconBg="#dcfce7"
              title="Proper Distance"
              description="Not too close, not too far - about 6-8 inches away"
              isGood
            />
          </View>
        </View>
      ),
    },
    {
      title: "General Tips",
      icon: "bulb" as const,
      iconColor: "#f59e0b",
      content: (
        <View>
          <Text className="text-gray-700 font-Poppins text-sm mb-4">
            Follow these tips for the best scanning experience:
          </Text>

          <View className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 mb-4">
            {[
              {
                text: "Ensure good lighting",
                subtitle: "Natural light works best",
              },
              {
                text: "Hold phone steady",
                subtitle: "Wait 1-2 seconds for barcode detection",
              },
              {
                text: "Center your item",
                subtitle: "Keep it in the middle of the frame",
              },
              {
                text: "Use the right mode",
                subtitle: "Food Scan for dishes, Barcode for packages",
              },
            ].map((tip, index) => (
              <View
                key={index}
                className="flex-row items-start mb-3"
                style={{ marginBottom: index === 3 ? 0 : 12 }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#10b981"
                  style={{ marginTop: 1 }}
                />
                <View className="ml-3 flex-1">
                  <Text className="text-gray-900 font-PoppinsSemiBold text-sm">
                    {tip.text}
                  </Text>
                  <Text className="text-gray-600 font-Poppins text-xs mt-0.5">
                    {tip.subtitle}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ),
    },
  ];

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.6}
      />
    ),
    []
  );

  const handleDismiss = useCallback(async () => {
    try {
      // Always save to storage when dismissing (whether via "Got It!", "Skip", or close button)
      await AsyncStorage.setItem(STORAGE_KEY, "true");
      bottomSheetRef.current?.close();
      onComplete();
      onClose();
    } catch (error) {
      console.warn("Error saving onboarding preference:", error);
      bottomSheetRef.current?.close();
      onComplete();
      onClose();
    }
  }, [bottomSheetRef, onComplete, onClose]);

  const handleSheetClose = useCallback(() => {
    setCurrentStep(0);
    onClose();
  }, [onClose]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={-1}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      onClose={handleSheetClose}
    >
      <BottomSheetView style={{ flex: 1 }}>
        {/* Header with Close Button */}
        <View className="flex-row items-start justify-between px-5 py-4 border-b border-gray-100">
          <View className="flex-1 pr-2">
            <Text className="text-xl font-PoppinsBold text-gray-900">
              {steps[currentStep].title}
            </Text>
            <Text className="text-xs font-Poppins text-gray-600 mt-1">
              Step {currentStep + 1} of {steps.length}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleDismiss}
            className="w-9 h-9 items-center justify-center rounded-full bg-gray-100"
            accessibilityLabel="Close onboarding"
          >
            <Ionicons name="close" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1 px-5 py-5">{steps[currentStep].content}</View>

        {/* Footer with Navigation */}
        <View className="px-5 pb-5 pt-3 border-t border-gray-100">
          {/* Progress Dots */}
          <View className="flex-row justify-center mb-4">
            {steps.map((_, index) => (
              <View
                key={index}
                className="rounded-full mx-1"
                style={{
                  width: currentStep === index ? 24 : 8,
                  height: 8,
                  backgroundColor:
                    currentStep === index ? "#10b981" : "#d1d5db",
                }}
              />
            ))}
          </View>

          {/* Don't Show Again Checkbox - Only on last step */}
          {isLastStep && (
            <TouchableOpacity
              onPress={() => setDontShowAgain(!dontShowAgain)}
              className="flex-row items-center mb-3"
              accessibilityLabel="Don't show this again"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: dontShowAgain }}
            >
              <View
                className="w-5 h-5 rounded border-2 items-center justify-center mr-2.5"
                style={{
                  borderColor: dontShowAgain ? "#10b981" : "#d1d5db",
                  backgroundColor: dontShowAgain ? "#10b981" : "transparent",
                }}
              >
                {dontShowAgain && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
              <Text className="text-gray-700 font-Poppins text-sm flex-1">
                Don't show this again
              </Text>
            </TouchableOpacity>
          )}

          {/* Navigation Buttons */}
          <View className="flex-row gap-3">
            {!isFirstStep && (
              <TouchableOpacity
                onPress={handlePrevious}
                className="flex-1 bg-gray-100 rounded-xl py-3.5 items-center"
              >
                <View className="flex-row items-center">
                  <Ionicons name="arrow-back" size={20} color="#374151" />
                  <Text className="font-PoppinsSemiBold text-gray-700 ml-2">
                    Back
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={isLastStep ? handleDismiss : handleNext}
              className="flex-1 bg-emerald-600 rounded-xl py-3.5 items-center"
              style={{
                shadowColor: "#10b981",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <View className="flex-row items-center">
                <Text className="font-PoppinsBold text-white text-base mr-2">
                  {isLastStep ? "Got It!" : "Next"}
                </Text>
                <Ionicons
                  name={isLastStep ? "checkmark" : "arrow-forward"}
                  size={20}
                  color="white"
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Skip Button */}
          {!isLastStep && (
            <TouchableOpacity
              onPress={handleDismiss}
              className="items-center mt-3"
              accessibilityLabel="Skip tutorial"
            >
              <Text className="font-PoppinsMedium text-gray-500 text-sm">
                Skip Tutorial
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

// Helper Components

interface ScanExampleCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  isGood: boolean;
}

function ScanExampleCard({
  icon,
  iconColor,
  iconBg,
  title,
  description,
  isGood,
}: ScanExampleCardProps) {
  return (
    <View className="bg-white rounded-xl p-3 border border-gray-200">
      <View className="flex-row items-center">
        <View
          className="rounded-xl items-center justify-center"
          style={{
            backgroundColor: iconBg,
            width: 70,
            height: 60,
          }}
        >
          <Ionicons name={icon} size={28} color={iconColor} />
        </View>

        <View className="flex-1 ml-3">
          <View className="flex-row items-center mb-0.5">
            <Text className="text-gray-900 font-PoppinsSemiBold flex-1 text-sm">
              {title}
            </Text>
            {isGood ? (
              <Ionicons name="checkmark-circle" size={18} color="#10b981" />
            ) : (
              <Ionicons name="close-circle" size={18} color="#ef4444" />
            )}
          </View>
          <Text className="text-gray-600 font-Poppins text-xs leading-4">
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
}

// Export helper function to reset onboarding preference (useful for testing/settings)
export async function resetScanOnboardingPreference() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.warn("Error resetting onboarding preference:", error);
    return false;
  }
}

// Export helper function to check if user has disabled onboarding
export async function shouldShowOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value !== "true"; // Show if not disabled
  } catch (error) {
    console.warn("Error checking onboarding preference:", error);
    return true; // Default to showing
  }
}
