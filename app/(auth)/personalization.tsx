import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import AllergensSelection from "@/components/onboarding/AllergensSelection";
import GenderAndAge from "@/components/onboarding/GenderAndAge";
import HeightAndWeight from "@/components/onboarding/HeightAndWeight";
import InputName from "@/components/onboarding/InputName";
import { LoadingScreen } from "@/components/onboarding/LoadingScreen";
import SuccessAccount from "@/components/onboarding/SuccessAccount";
import TargetWeightSelection from "@/components/onboarding/TargetWeightSelection";
import WeightGoalSelection from "@/components/onboarding/WeightGoalSelection";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams /*useRouter*/ } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const totalSteps = 7;

const Onboarding = () => {
  const { onboardingSubmission, loading, registered, agreement } = useAuth();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  // const router = useRouter();

  // Input states for each step
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [weight, setWeight] = useState("");
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [weightGoal, setWeightGoal] = useState("");
  const [targetWeight, setTargetWeight] = useState("");

  const progress = useMemo(
    () => (currentStep / totalSteps) * 100,
    [currentStep]
  );

  useEffect(() => {
    if (currentStep === 7 && !registered) {
      onboardingSubmission(
        name,
        selectedAllergens,
        gender,
        parseInt(age),
        parseFloat(`${heightFeet}.${heightInches === "" ? "0" : heightInches}`),
        parseFloat(weight),
        email,
        weightGoal,
        parseFloat(targetWeight)
      )
        .then(() => {
          console.log("Onboarding submission successful.");
        })
        .catch((error) => {
          console.error("Error during onboarding submission:", error);
        });
    }
  }, [
    currentStep,
    email,
    name,
    selectedAllergens,
    gender,
    age,
    heightFeet,
    heightInches,
    weight,
    weightGoal,
    targetWeight,
    onboardingSubmission,
    registered,
  ]);

  // Validation functions for each step
  const isStep1Valid = useCallback(() => {
    return name.trim().length > 0 && name.trim().length <= 20;
  }, [name]);

  const isStep2Valid = useCallback(() => {
    const ageNum = parseInt(age);
    return gender.length > 0 && age.length > 0 && ageNum >= 1 && ageNum <= 120;
  }, [gender, age]);

  const isStep3Valid = useCallback(() => {
    const weightNum = parseFloat(weight);
    const heightFeetNum = parseInt(heightFeet);
    const heightInchesNum = parseInt(heightInches);

    return (
      weight.length > 0 &&
      weightNum > 0 &&
      weightNum <= 1000 &&
      heightFeet.length > 0 &&
      heightFeetNum >= 1 &&
      heightFeetNum <= 10 &&
      heightInchesNum >= 0 &&
      heightInchesNum <= 11
    );
  }, [weight, heightFeet, heightInches]);

  const isStep4Valid = useCallback(() => {
    return selectedAllergens.length > 0;
  }, [selectedAllergens]);

  const isStep5Valid = useCallback(() => {
    return weightGoal.length > 0;
  }, [weightGoal]);

  const isStep6Valid = useCallback(() => {
    const targetWeightNum = parseFloat(targetWeight);
    const currentWeightNum = parseFloat(weight);

    if (!targetWeight || isNaN(targetWeightNum) || targetWeightNum <= 0) {
      return false;
    }

    // Additional validation based on weight goal
    if (weightGoal === "lose" && targetWeightNum >= currentWeightNum) {
      return false;
    }
    if (weightGoal === "gain" && targetWeightNum <= currentWeightNum) {
      return false;
    }

    return true;
  }, [targetWeight, weight, weightGoal]);

  const isCurrentStepValid = useCallback(() => {
    if (registered) return true;
    switch (currentStep) {
      case 1:
        return isStep1Valid();
      case 2:
        return isStep2Valid();
      case 3:
        return isStep3Valid();
      case 4:
        return isStep4Valid();
      case 5:
        return isStep5Valid();
      case 6:
        return isStep6Valid();
      default:
        return true;
    }
  }, [
    registered,
    currentStep,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    isStep4Valid,
    isStep5Valid,
    isStep6Valid,
  ]);

  const renderContent = useCallback(() => {
    if (loading || currentStep === 7) return <LoadingScreen />;

    if (registered) return <SuccessAccount />;

    if (currentStep === 1)
      return <InputName value={name} onChangeText={setName} />;

    if (currentStep === 2)
      return (
        <GenderAndAge
          selectedGender={gender}
          setSelectedGender={setGender}
          age={age}
          setAge={setAge}
        />
      );

    if (currentStep === 3)
      return (
        <HeightAndWeight
          heightFeet={heightFeet}
          setHeightFeet={setHeightFeet}
          heightInches={heightInches}
          setHeightInches={setHeightInches}
          weight={weight}
          setWeight={setWeight}
        />
      );

    if (currentStep === 4)
      return (
        <AllergensSelection
          selectedAllergens={selectedAllergens}
          setSelectedAllergens={setSelectedAllergens}
        />
      );

    if (currentStep === 5)
      return (
        <WeightGoalSelection
          selectedGoal={weightGoal}
          setSelectedGoal={setWeightGoal}
        />
      );

    if (currentStep === 6)
      return (
        <TargetWeightSelection
          targetWeight={targetWeight}
          setTargetWeight={setTargetWeight}
          currentWeight={weight}
          weightGoal={weightGoal}
        />
      );
  }, [
    currentStep,
    registered,
    name,
    gender,
    age,
    heightFeet,
    heightInches,
    weight,
    selectedAllergens,
    weightGoal,
    targetWeight,
  ]);

  console.log("Current step:", currentStep);
  console.log("Registered:", registered);

  const handleContinue = useCallback(async () => {
    if (registered) return;
    if (!isCurrentStepValid()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentStep(currentStep + 1);
  }, [registered, isCurrentStepValid, currentStep]);

  const handleBack = useCallback(() => {
    if (registered) return;
    Haptics.selectionAsync();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [registered, currentStep]);

  const shouldShowProgress = useMemo(
    () => currentStep > 0 && currentStep < totalSteps,
    [currentStep, totalSteps]
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      {shouldShowProgress && !registered && (
        <View className="flex-row items-center p-4 gap-4">
          <TouchableOpacity
            onPress={handleBack}
            className="p-2 rounded-full bg-[#F4F4F4]"
          >
            <Ionicons name="arrow-back" size={20} color="black" />
          </TouchableOpacity>
          <View className="flex-1 h-1 bg-[#E0E0E0] rounded-lg overflow-hidden">
            <View
              className="h-full bg-[#000]"
              style={{ width: `${progress}%` }}
            />
          </View>
          <Text className="text-black font-PoppinsMedium">
            {currentStep} / {totalSteps}
          </Text>
        </View>
      )}

      {/* Content */}
      {renderContent()}

      {/* Footer */}
      {currentStep <= totalSteps + 2 && currentStep !== 7 && (
        <Animated.View
          className="mt-auto px-4 py-8 border-t border-t-gray-100"
          entering={FadeIn.duration(600)}
        >
          <TouchableOpacity
            onPress={registered ? () => agreement(email) : handleContinue}
            disabled={!isCurrentStepValid()}
            className={`p-4 rounded-lg items-center ${
              isCurrentStepValid() ? "bg-black" : "bg-gray-300"
            }`}
          >
            <Text
              className={`text-lg font-PoppinsSemiBold ${
                isCurrentStepValid() ? "text-white" : "text-gray-500"
              }`}
            >
              {registered ? "Finish" : "Next"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default memo(Onboarding);
