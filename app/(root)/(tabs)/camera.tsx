import PhotoPreviewSection from "@/components/PhotoPreviewSection";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const [scanMode, setScanMode] = useState<"food" | "barcode" | "nutrition">(
    "food"
  );
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      const takedPhoto = await cameraRef.current.takePictureAsync(options);

      setPhoto(takedPhoto);
    }
  };

  const handleRetakePhoto = () => setPhoto(null);

  if (photo)
    return (
      <PhotoPreviewSection
        photo={photo}
        handleRetakePhoto={handleRetakePhoto}
      />
    );

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        {/* Camera Scan Indicator */}
        <View style={styles.scanOverlay}>
          <View style={styles.scanFrame}>
            {/* Corner markers */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          {/* Scanning Mode Selector */}
          <View style={styles.modeSelector}>
            <Text className="font-Poppins text-white text-xl mb-4">
              Select a Scanning Mode:
            </Text>
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

              <TouchableOpacity
                style={[
                  styles.modeButton,
                  scanMode === "nutrition" && styles.modeButtonActive,
                ]}
                onPress={() => setScanMode("nutrition")}
              >
                <View style={styles.modeIcon}>
                  <MaterialIcons
                    name="document-scanner"
                    size={24}
                    color={scanMode === "nutrition" ? "black" : "white"}
                  />
                </View>
                <Text
                  style={[
                    styles.modeText,
                    scanMode === "nutrition" && styles.modeTextActive,
                  ]}
                >
                  Nutrition Facts
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Circular Camera Button */}
        <View style={styles.cameraButtonContainer}>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleTakePhoto}
          >
            <View style={styles.cameraButtonInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
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
    borderWidth: 6,
    // borderRadius: 12, fix later pukingina ayaw mag ismooth
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
    justifyContent: "center",
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
  },
});
