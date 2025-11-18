import LoadingScreen from "@/components/loading-screen";
import {
  ScanOnboardingModal,
  shouldShowOnboarding,
} from "@/components/ScanOnboardingModal";
import { useAuth } from "@/context/AuthContext";
import { useBarcodeScan } from "@/hooks/useBarcodeScan";
import { useFoodScan } from "@/hooks/useFoodScan";
import { cropCenterTo256Base64 } from "@/utils/cropImage";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type ScanResultType = {
  id?: any;
  name?: string;
  foodName?: string;
  brand?: string;
  servingSize: string;
  ingredients: string[];
  triggeredAllergens: { ingredient: string; allergen: string }[];
  nutritionData: {
    title: string;
    items: {
      name: string;
      value: number;
      unit: string;
    }[];
  }[];
  source?: string; // "usda" | "nutritionix" | "open food facts" | "gemini" | "mynetdiary"
  barcode?: boolean;
};

export type PredictionType = {
  label: string;
  prob: number;
};

function App() {
  const { mealTime } = useLocalSearchParams<{ mealTime?: string }>();
  const { user } = useAuth();
  const { scanBarcode, barcodeData } = useBarcodeScan();
  const { foodScan, foodScanData } = useFoodScan();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [scanMode, setScanMode] = useState<"food" | "barcode">("food");
  const cameraRef = useRef<CameraView | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResultType | null>(null); // State to hold scan result
  const [barcodeScanned, setBarcodeScanned] = useState(false);
  const [flashMode, setFlashMode] = useState<FlashMode>("off");
  const onboardingSheetRef = useRef<BottomSheet>(null);

  const router = useRouter();

  // Check if we should show onboarding on mount
  useEffect(() => {
    checkAndShowOnboarding();
  }, []);

  const checkAndShowOnboarding = async () => {
    const shouldShow = await shouldShowOnboarding();
    console.log("Should show onboarding:", shouldShow);
    if (shouldShow) {
      // Small delay to ensure camera is mounted
      setTimeout(() => {
        console.log("Opening onboarding sheet");
        onboardingSheetRef.current?.snapToIndex(0);
      }, 500);
    }
  };

  const openOnboarding = () => {
    console.log("Manual open onboarding");
    onboardingSheetRef.current?.snapToIndex(0);
  };

  console.log("Meal Time maincamera:", mealTime);

  useEffect(() => {
    if (barcodeData)
      setScanResult({
        ...barcodeData,
        barcode: true,
      });
  }, [barcodeData]); // The effect runs only when barcodeData changes

  useEffect(() => {
    if (scanResult && photo) {
      router.replace({
        pathname: "/results",
        params: {
          scanResult: JSON.stringify(scanResult),
          image: photo.uri,
          userAllergens: JSON.stringify(user?.allergens),
          mealTime,
        },
      });
    }
  }, [scanResult, photo, router]);

  useEffect(() => {
    if (foodScanData && photo) {
      router.replace({
        pathname: "/predictions",
        params: {
          predictions: JSON.stringify(foodScanData),
          image: photo.uri,
          userAllergens: user?.allergens,
          mealTime,
        },
      });
    }
  }, [foodScanData, photo, router]);

  const toggleFlash = useCallback(() => {
    setFlashMode((current) => (current === "off" ? "on" : "off"));
  }, []);

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

      const croppedBase64 = await cropCenterTo256Base64(takedPhoto);
      await foodScan(croppedBase64, handleRetakePhoto);

      // Prefer the base64 returned by the camera; if missing, read the file as base64.
      // let imageBase64 = takedPhoto.base64;
      // if (!imageBase64 && takedPhoto.uri) {
      //   imageBase64 = await FileSystem.readAsStringAsync(takedPhoto.uri, {
      //     encoding: FileSystem.EncodingType.Base64,
      //   });
      // }
      // if (!imageBase64) {
      //   throw new Error("No image data available to send.");
      // }

      // // Strip data URI prefix if present (backend expects raw base64)
      // const cleanedBase64 = imageBase64.startsWith("data:")
      //   ? imageBase64.split(",")[1]
      //   : imageBase64;

      // await foodScan(cleanedBase64, handleRetakePhoto);
    }
    setLoading(false);
  }, [foodScan, handleRetakePhoto]);

  const handlePickFromGallery = useCallback(async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need permission to access your photos to pick an image."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        base64: true,
        quality: 0.7,
      });

      // handle cancel
      if (result.canceled || !result.assets || result.assets.length === 0)
        return;
      const asset = result.assets[0];
      const uri = asset.uri;
      const base64 = asset.base64 ?? null;

      // pause camera preview and set photo
      cameraRef.current?.pausePreview();
      setLoading(true);
      setPhoto({ uri, base64 } as any);

      // Prefer asset.base64 if available, otherwise crop from uri
      const imageBase64 =
        base64 ?? (await cropCenterTo256Base64({ uri } as any));

      await foodScan(imageBase64, handleRetakePhoto);
    } catch (e) {
      console.warn("Gallery pick failed", e);
      Alert.alert("Error", "Failed to pick/process image.");
      handleRetakePhoto();
    } finally {
      setLoading(false);
    }
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
        enableTorch={flashMode === "on"}
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
        {!loading && scanMode !== "barcode" && (
          <>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={handlePickFromGallery}
              accessibilityLabel="Pick image from gallery"
            >
              <Ionicons name="images-outline" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleTakePhoto}
            >
              <View style={styles.cameraButtonInner} />
            </TouchableOpacity>
          </>
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

      {/* Flash Button - Top Left */}
      {!loading && (
        <>
          <TouchableOpacity
            style={styles.searchButtonTop}
            onPress={toggleFlash}
            accessibilityLabel={`Toggle flash ${flashMode === "on" ? "off" : "on"}`}
          >
            <Ionicons
              name={flashMode === "on" ? "flash" : "flash-off"}
              size={28}
              color={flashMode === "on" ? "#FFD700" : "white"}
            />
          </TouchableOpacity>

          {/* Help Button - For testing onboarding */}
          <TouchableOpacity
            style={[styles.searchButtonTop, { top: 120 }]}
            onPress={openOnboarding}
            accessibilityLabel="Show help"
          >
            <Ionicons name="help-circle-outline" size={28} color="white" />
          </TouchableOpacity>
        </>
      )}

      {/* Search Food Button - Top Right */}
      {!loading && (
        <TouchableOpacity
          style={styles.flashButtonTop}
          onPress={() =>
            router.push({
              pathname: "/manual-food-entry",
              params: { mealTime },
            })
          }
          accessibilityLabel="Search food database"
        >
          <Ionicons name="search" size={28} color="white" />
        </TouchableOpacity>
      )}

      {/* Add loading overlay */}
      {loading && <LoadingScreen message="Scanning..." />}

      {/* Onboarding Bottom Sheet */}
      <ScanOnboardingModal
        bottomSheetRef={onboardingSheetRef}
        onClose={() => {}}
        onComplete={() => {}}
      />
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
  galleryButton: {
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
  flashButtonTop: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
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
  searchButtonTop: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
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
});
