import { ScanResultType } from "@/app/(root)/main-camera";
import Constants from "expo-constants";
import { useCallback, useState } from "react";
const { EXPO_PUBLIC_SUSHI_SECRET } = Constants.expoConfig?.extra || {};

export function useBarcodeScan() {
  const [barcodeData, setBarcodeData] = useState<ScanResultType | null>(null);

  const scanBarcode = useCallback(
    async (barcodeData: string, handleRetakePhoto: () => void) => {
      setBarcodeData(null);
      try {
        const res = await fetch(
          "https://nutrisight-backend-dd22d1bd9780.herokuapp.com/camera/barcode",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-APP-KEY": EXPO_PUBLIC_SUSHI_SECRET || "",
            },
            credentials: "include",
            body: JSON.stringify({ barcodeData }),
          }
        );

        if (!res.ok) {
          console.error("Error scanning food:", res.statusText);
          handleRetakePhoto();
          return;
        }

        const result = await res.json();

        if (!result || !result.data) {
          alert("No data found in the scan result. Please try again.");
          handleRetakePhoto();
          return;
        }

        setBarcodeData({
          ...result.data,
          nutrition: JSON.stringify(result.data.nutrition),
        });
      } catch (error: any) {
        console.error("Error scanning food:", error);
        alert(error.message || "Unknown error");
        handleRetakePhoto();
      }
    },
    []
  );

  return { scanBarcode, barcodeData };
}
