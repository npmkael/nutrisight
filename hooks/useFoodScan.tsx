import { ScanResultType } from "@/app/(root)/(tabs)/camera";
import { CameraCapturedPicture } from "expo-camera";
import { useCallback, useState } from "react";

export function useFoodScan() {
  const [foodScanData, setFoodScanData] = useState<ScanResultType | null>(null);

  const foodScan = useCallback(
    async (
      takedPhoto: CameraCapturedPicture,
      handleRetakePhoto: () => void
    ) => {
      setFoodScanData(null);
      try {
        const res = await fetch(
          "https://nutrisight-backend-dd22d1bd9780.herokuapp.com/camera/food-scan",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-APP-KEY": process.env.EXPO_PUBLIC_SUSHI_SECRET || "",
            },
            credentials: "include",
            body: JSON.stringify({ image: takedPhoto.base64 }),
          }
        );
        if (!res.ok) {
          console.error("Failed to scan food:", res.statusText);
          alert("Failed to scan food. Please try again.");
          handleRetakePhoto();
          return;
        }

        const data = await res.json();
        console.log("Food scan result:", data);

        if (!data || !data.data) {
          alert("No data found in the scan result. Please try again.");
          handleRetakePhoto();
          return;
        }

        setFoodScanData({
          name: data.data.foodName,
          ingredients: data.data.ingredients,
          servingSize: data.data.servingSize,
          nutrition: data.data.nutrition,
        });
      } catch (error: any) {
        console.error("Error scanning food:", error);
        alert(error.message || "Unknown error occurred while scanning food.");
        handleRetakePhoto();
      }
    },
    []
  );

  return { foodScan, foodScanData };
}
