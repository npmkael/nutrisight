import { LoggedWeight, useAuth } from "@/context/AuthContext";
import { cmToFeetAndInches, getAgeFromDOB, lbsToKg } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, Slot } from "expo-router";
import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  SharedValue,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const totalSteps = 7;

type OnboardingContextType = {
  name: string;
  setName: (v: string) => void;
  gender: string;
  setGender: (v: string) => void;
  birthDate: Date;
  setBirthDate: (d: Date) => void;
  heightUnit: string;
  setHeightUnit: (u: string) => void;
  heightFeet: string;
  setHeightFeet: (v: string) => void;
  heightInches: string;
  setHeightInches: (v: string) => void;
  weightUnit: string;
  setWeightUnit: (u: string) => void;
  weight: string;
  setWeight: (v: string) => void;
  selectedAllergens: string[];
  setSelectedAllergens: React.Dispatch<React.SetStateAction<string[]>>;
  weightGoal: string;
  setWeightGoal: (g: string) => void;
  targetWeight: string;
  setTargetWeight: (w: string) => void;
  activityLevel: string;
  setActivityLevel: (a: string) => void;
  isStepValid: () => boolean;
  setUnit: React.Dispatch<React.SetStateAction<"ft/kg" | "cm/lb">>;
  unit: "ft/kg" | "cm/lb";
  isOn: SharedValue<boolean>;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within provider");
  return ctx;
}

function SetupLayout() {
  const { onboardingSubmission, onboardingEmail } = useAuth();

  // shared onboarding state
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [heightUnit, setHeightUnit] = useState("ft/in");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [weight, setWeight] = useState("");
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [weightGoal, setWeightGoal] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const [unit, setUnit] = useState<"ft/kg" | "cm/lb">("ft/kg");

  const isOn = useSharedValue(false);

  // Validation function for each step
  const isStepValid = useCallback(() => {
    switch (currentStep) {
      case 1:
        // Step 1: Name input
        return name.trim().length > 0;
      case 2:
        // Step 2: Gender and birth date with age validation (15-65 years)
        if (gender.length === 0) return false;
        const age = getAgeFromDOB(birthDate);
        return age >= 15 && age <= 65;
      case 3:
        // Step 3: Height and weight with min/max validation
        if (heightUnit === "ft/in") {
          const ft = Number(heightFeet);
          const inch = Number(heightInches) || 0;
          const wt = Number(weight);

          if (
            !heightFeet.trim() ||
            !weight.trim() ||
            isNaN(ft) ||
            isNaN(inch) ||
            isNaN(wt)
          ) {
            return false;
          }

          // Height validation: 4'0" to 7'5"
          const totalInches = ft * 12 + inch;
          const minInches = 4 * 12 + 0; // 4'0"
          const maxInches = 7 * 12 + 5; // 7'5"

          if (totalInches < minInches || totalInches > maxInches) {
            return false;
          }

          // Weight validation: 30-200 kg
          if (wt < 30 || wt > 200) {
            return false;
          }

          return true;
        } else {
          const cm = Number(heightFeet);
          const lb = Number(weight);

          if (!heightFeet.trim() || !weight.trim() || isNaN(cm) || isNaN(lb)) {
            return false;
          }

          // Height validation: 122-226 cm (4'0" to 7'5")
          if (cm < 122 || cm > 226) {
            return false;
          }

          // Weight validation: 66-440 lb (30-200 kg)
          if (lb < 66 || lb > 440) {
            return false;
          }

          return true;
        }
      case 4:
        // Step 4: Allergens (at least one selection required, "none" is valid)
        return selectedAllergens.length > 0;
      case 5:
        // Step 5: Weight goal

        return activityLevel.length > 0;
      case 6:
        // Step 6: Activity level selection
        return weightGoal.length > 0;
      case 7:
        // Step 7: Target weight with validation based on goal and min/max constraints
        if (
          !targetWeight.trim() ||
          isNaN(Number(targetWeight)) ||
          Number(targetWeight) <= 0
        ) {
          return false;
        }
        const currentWeightNum = Number(weight);
        const targetWeightNum = Number(targetWeight);

        // Min/max weight validation: 30-200 kg or 66-440 lb
        if (weightUnit === "kg") {
          if (targetWeightNum < 30 || targetWeightNum > 200) {
            return false;
          }
        } else {
          if (targetWeightNum < 66 || targetWeightNum > 440) {
            return false;
          }
        }

        // Goal-based validation
        if (weightGoal === "lose") {
          return targetWeightNum < currentWeightNum;
        } else if (weightGoal === "gain") {
          return targetWeightNum > currentWeightNum;
        } else if (weightGoal === "maintain") {
          return true; // Any valid weight is acceptable for maintain
        }
        return true;
      default:
        return false;
    }
  }, [
    currentStep,
    name,
    gender,
    birthDate,
    heightUnit,
    heightFeet,
    heightInches,
    weight,
    weightUnit,
    selectedAllergens,
    weightGoal,
    targetWeight,
    activityLevel,
    unit,
  ]);

  const value = useMemo(
    () => ({
      name,
      setName,
      gender,
      setGender,
      birthDate,
      setBirthDate,
      heightUnit,
      setHeightUnit,
      heightFeet,
      setHeightFeet,
      heightInches,
      setHeightInches,
      weightUnit,
      setWeightUnit,
      weight,
      setWeight,
      selectedAllergens,
      setSelectedAllergens,
      weightGoal,
      setWeightGoal,
      targetWeight,
      setTargetWeight,
      activityLevel,
      setActivityLevel,
      isStepValid,
      unit,
      setUnit,
      isOn,
    }),
    [
      name,
      gender,
      birthDate,
      heightUnit,
      heightFeet,
      heightInches,
      weightUnit,
      weight,
      selectedAllergens,
      weightGoal,
      targetWeight,
      activityLevel,
      isStepValid,
      unit,
      setUnit,
      isOn,
    ]
  );

  const progress = useMemo(
    () => (currentStep / totalSteps) * 100,
    [currentStep]
  );

  const handleContinue = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (currentStep < totalSteps) {
      setCurrentStep((s) => s + 1);

      const strStep = (currentStep + 1).toString() as
        | "1"
        | "2"
        | "3"
        | "4"
        | "5"
        | "6"
        | "7";

      console.log(currentStep);

      router.push(`/(auth)/(setup)/${strStep}`);
    }
  }, [currentStep, onboardingEmail, router]);

  const handleBack = useCallback(() => {
    Haptics.selectionAsync();
    if (currentStep > 1) {
      setCurrentStep((s) => Math.max(1, s - 1));

      router.back();
      return;
    }
  }, [currentStep, onboardingEmail, router]);

  const handleOnboardSubmission = useCallback(async () => {
    if (currentStep === totalSteps && !onboardingComplete) {
      if (onboardingEmail!.length < 5) {
        alert("Please enter a valid email address.");
        return;
      }
      try {
        setLoading(true);
        // Height conversion
        let finalFeet = Number(heightFeet);
        let finalInch = Number(heightInches);

        if (heightUnit !== "ft/in") {
          const { feet, inches } = cmToFeetAndInches(Number(heightFeet));
          finalFeet = feet;
          finalInch = inches || 0;
        }

        // Weight conversion
        let finalWeight = Number(parseFloat(weight).toFixed(2));
        if (weightUnit !== "kg") {
          finalWeight = Number(lbsToKg(Number(weight)));
        }

        // Target weight conversion
        let finalTarget = Number(targetWeight);
        if (weightUnit !== "kg") {
          finalTarget = Number(lbsToKg(Number(targetWeight)));
        }

        const currentDate = new Date();
        let loggedWeightPayload: LoggedWeight[] = [
          {
            date: currentDate.toISOString().slice(0, 10), // YYYY-MM-DD
            value: finalWeight,
          },
        ];

        console.log("Submitting onboarding:", {
          name,
          selectedAllergens,
          gender,
          birthDate,
          finalFeet,
          finalInch,
          finalWeight,
          onboardingEmail,
          weightGoal,
          finalTarget,
          activityLevel,
          loggedWeightPayload,
        });

        const result: any = await onboardingSubmission(
          name,
          selectedAllergens,
          gender,
          birthDate,
          finalFeet,
          finalInch,
          finalWeight,
          onboardingEmail!,
          weightGoal,
          finalTarget,
          activityLevel,
          loggedWeightPayload
        );

        console.log("Onboarding submission result:", result);
        if (!result) {
          alert("Onboarding submission failed, please try again.");
          return;
        }
        router.replace({
          pathname: "/(auth)/success-account",
          params: {
            onboardingEmail: result.email,
            dailyRecommendation: JSON.stringify(result.dailyRecommendation),
          },
        });
      } catch (err) {
        console.error("Onboarding final submit error:", err);
      } finally {
        setLoading(false);
      }
      return;
    }
  }, [
    name,
    selectedAllergens,
    gender,
    birthDate,
    heightUnit,
    heightFeet,
    heightInches,
    weightUnit,
    weight,
    targetWeight,
    weightGoal,
    onboardingComplete,
    router,
  ]);

  return (
    <OnboardingContext.Provider value={value}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* header */}
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            padding: 16,
          }}
        >
          <View className="justify-between items-center gap-4 flex-row">
            <TouchableOpacity
              onPress={handleBack}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: "#F4F4F4",
              }}
            >
              <Ionicons name="arrow-back" size={20} color="black" />
            </TouchableOpacity>

            <View
              style={{
                marginTop: 4,
                backgroundColor: "#e1e1e1",
                borderRadius: 100,
                height: 8,
                overflow: "hidden",
                flex: 1,
              }}
            >
              <View
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </View>

            <Text
              className="text-sm text-foreground"
              style={{ fontFamily: "GeistSemiBold" }}
            >
              {currentStep} / {totalSteps}
            </Text>
          </View>
        </View>

        {/* child page renders here */}
        <View style={{ flex: 1 }}>
          <Slot />
        </View>

        {/* footer */}
        <Animated.View
          entering={FadeIn.duration(600)}
          style={{
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
            backgroundColor: "#fff",
          }}
        >
          <TouchableOpacity
            onPress={
              currentStep < totalSteps
                ? handleContinue
                : handleOnboardSubmission
            }
            style={{
              backgroundColor:
                isStepValid() && !loading ? "#2D3644" : "#D1D5DB",
              padding: 14,
              borderRadius: 12,
              alignItems: "center",
              opacity: loading ? 0.6 : 1,
            }}
            disabled={loading || !isStepValid()}
          >
            <Text
              style={{
                color: isStepValid() && !loading ? "#fff" : "#9CA3AF",
                fontSize: 16,
                fontFamily: "PoppinsMedium",
              }}
            >
              {loading
                ? "Loading..."
                : currentStep < totalSteps
                  ? "Next"
                  : "Finish"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </OnboardingContext.Provider>
  );
}

export default memo(SetupLayout);
