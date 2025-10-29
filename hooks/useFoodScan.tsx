import { PredictionType } from "@/app/(root)/main-camera";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export function useFoodScan() {
  const [foodScanData, setFoodScanData] = useState<PredictionType[] | null>(
    null
  );

  const foodScan = useCallback(
    async (takedPhoto: string, handleRetakePhoto: () => void) => {
      setFoodScanData(null);
      try {
        const res = await fetch(
          "https://nutrisight-backend-dd22d1bd9780.herokuapp.com/camera/predict-food",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-APP-KEY": process.env.EXPO_PUBLIC_SUSHI_SECRET || "",
            },
            credentials: "include",
            body: JSON.stringify({ image: takedPhoto }),
          }
        );
        if (!res.ok) {
          console.error("Failed to scan food:", res.statusText);
          Alert.alert(
            "Failed to scan food. Please try again.",
            "Server might be down."
          );
          handleRetakePhoto();
          return;
        }

        const data = await res.json();
        console.log("Predictions:", data);

        if (data.error === "not food") {
          console.log(
            "The image does not contain food or is outside of our datasets."
          );
          Alert.alert(
            "Detection Error.",
            "The image does not contain food or is outside of our datasets. Please try again."
          );
          handleRetakePhoto();
          return;
        }

        if (!data || !data.data) {
          Alert.alert(
            "Scan Error",
            "No data found in the scan result. Please try again."
          );
          handleRetakePhoto();
          return;
        }

        setFoodScanData(data.data as PredictionType[]);
      } catch (error: any) {
        console.log("Error scanning food:", error);
        Alert.alert(
          "Scan Error",
          error.message || "Unknown error occurred while scanning food."
        );
        handleRetakePhoto();
      }
    },
    []
  );

  return { foodScan, foodScanData };
}
