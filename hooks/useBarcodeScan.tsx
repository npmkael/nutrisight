import { ScanResultType } from "@/app/(root)/(tabs)/camera";
import { useCallback, useState } from "react";

export function useBarcodeScan() {
  const [barcodeData, setBarcodeData] = useState<ScanResultType | null>(null);

  const scanBarcode = useCallback(
    async (barcodeData: string, handleRetakePhoto: () => void) => {
      setBarcodeData(null);
      try {
        const res = await fetch(
          "https://nutrisight-microservice-89ab7ccf2966.herokuapp.com/barcode",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-APP-KEY": process.env.EXPO_PUBLIC_SUSHI_SECRET || "",
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
