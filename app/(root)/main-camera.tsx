import Loading from "@/components/Loading";
import PhotoPreviewSection from "@/components/PhotoPreviewSection";
import { useAuth } from "@/context/AuthContext";
import { useBarcodeScan } from "@/hooks/useBarcodeScan";
import { useFoodScan } from "@/hooks/useFoodScan";
import { Ionicons } from "@expo/vector-icons";
import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { router } from "expo-router";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type ScanResultType = {
  name: string;
  brand?: string;
  servingSize: string;
  ingredients: string;
  nutrition: any[][][];
};

function App() {
  const { user } = useAuth();
  const { scanBarcode, barcodeData } = useBarcodeScan();
  const { foodScan, foodScanData } = useFoodScan();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [scanMode, setScanMode] = useState<"food" | "barcode" | "nutrition">(
    "food"
  );
  const cameraRef = useRef<CameraView | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResultType | null>(null); // State to hold scan result
  const [barcodeScanned, setBarcodeScanned] = useState(false);

  useEffect(() => {
    if (barcodeData) setScanResult(barcodeData);
  }, [barcodeData]); // The effect runs only when barcodeData changes

  useEffect(() => {
    if (foodScanData) setScanResult(foodScanData);
  }, [foodScanData]); // The effect runs only when foodScanData changes

  const handleRetakePhoto = useCallback(() => {
    setPhoto(null);
    setLoading(false);
    setScanResult(null);
    setBarcodeScanned(false);
    if (cameraRef.current) {
      cameraRef.current.resumePreview();
    }
  }, []);

  const handleBarcodeScanned = useCallback(
    async ({ data }: { data: string }) => {
      if (scanMode !== "barcode" || barcodeScanned) return;
      setBarcodeScanned(true);
      // Take the picture and set the photo state
      if (cameraRef.current) {
        cameraRef.current
          .takePictureAsync({ quality: 1, base64: true })
          .then((takedPhoto) => {
            cameraRef.current?.pausePreview();
            setPhoto(takedPhoto);
          });
      }
      await scanBarcode(data, handleRetakePhoto);
    },
    [scanMode, barcodeScanned, scanBarcode, handleRetakePhoto]
  );

  const handleTakePhoto = useCallback(async () => {
    if (cameraRef.current) {
      const options = {
        quality: 0.6, // reduce quality to speed up processing
        base64: true,
        exif: false,
      };
      const takedPhoto = await cameraRef.current.takePictureAsync(options);

      if (!takedPhoto) {
        alert("Failed to take photo. Please try again.");
        handleRetakePhoto();
        return;
      }

      await cameraRef.current?.pausePreview(); // Pause the camera preview
      setLoading(true);
      setPhoto(takedPhoto);

      if (scanMode === "food") {
        await foodScan(takedPhoto, handleRetakePhoto);
      }
    }
    setLoading(false);
  }, [foodScan, handleRetakePhoto]);

  // Camera permissions are still loading.
  if (!permission) return <View />;

  // Camera permissions are not granted yet.
  if (!permission.granted) {
    Alert.alert(
      "Camera Permission Required",
      "We need your permission to access the camera to scan food items and barcodes.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Grant Permission",
          onPress: requestPermission,
        },
      ]
    );
    return <View style={styles.container} />;
  }

  if (photo && scanResult)
    return (
      <PhotoPreviewSection
        userAllergens={user?.allergens || []}
        photo={photo}
        scanResult={scanResult}
        handleRetakePhoto={handleRetakePhoto}
      />
    );

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
        }}
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      />
      {/* Camera Scan Indicator */}
      <View style={styles.scanOverlay}>
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        {/* Scanning Mode Selector */}
        <View style={styles.modeSelector}>
          <View style={styles.modeButtons}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                scanMode === "food" && styles.modeButtonActive,
              ]}
              onPress={() => setScanMode("food")}
            >
              <View style={styles.modeIcon}>
                <Ionicons
                  name="fast-food-sharp"
                  size={24}
                  color={scanMode === "food" ? "black" : "white"}
                />
              </View>
              <Text
                style={[
                  styles.modeText,
                  scanMode === "food" && styles.modeTextActive,
                ]}
              >
                Scan Food
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeButton,
                scanMode === "barcode" && styles.modeButtonActive,
              ]}
              onPress={() => setScanMode("barcode")}
              className="font-Poppins"
            >
              <View style={styles.modeIcon}>
                <Ionicons
                  name="barcode-outline"
                  size={24}
                  color={scanMode === "barcode" ? "black" : "white"}
                />
              </View>
              <Text
                style={[
                  styles.modeText,
                  scanMode === "barcode" && styles.modeTextActive,
                ]}
              >
                Barcode
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Circular Camera Button */}
      <View style={styles.cameraButtonContainer} className="flex-row">
        <TouchableOpacity style={styles.flashButton} onPress={() => {}}>
          <Ionicons name="flash-outline" size={24} color="white" />
        </TouchableOpacity>
        {!loading && scanMode !== "barcode" && (
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleTakePhoto}
          >
            <View style={styles.cameraButtonInner} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="close-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Add loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <Loading />
        </View>
      )}
    </View>
  );
}

export default memo(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },
  camera: {
    ...StyleSheet.absoluteFillObject, // Make camera fill the container
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject, // Make overlay fill the screen
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 50,
    height: 50,
    borderColor: "#fff",
    borderWidth: 5,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  modeSelector: {
    marginTop: 40,
    alignItems: "center",
  },
  modeTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  modeButtons: {
    flexDirection: "row",
    gap: 15,
  },
  modeButton: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  modeButtonActive: {
    borderColor: "#fff",
    borderWidth: 3,
    backgroundColor: "#fff",
  },
  modeIcon: {
    width: 30,
    height: 30,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  foodIcon: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 4,
  },
  barcodeIcon: {
    width: 24,
    height: 16,
    backgroundColor: "white",
    borderRadius: 2,
  },
  nutritionIcon: {
    width: 20,
    height: 24,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 2,
  },
  modeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  modeTextActive: {
    color: "black",
    fontWeight: "600",
  },
  cameraButtonContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  cameraButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "transparent",
    borderWidth: 4,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cameraButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  flashButton: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
});
