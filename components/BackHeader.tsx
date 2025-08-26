import { colors } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type BackHeaderProps = {
  title?: string;
  backButton?: boolean;
};

export default function BackHeader({
  title,
  backButton = true,
}: BackHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBackPress = () => {
    // check routes if in main-camera, go to home
    if (pathname.includes("main-camera") || pathname.includes("predictions")) {
      router.replace("/(root)/main-camera");
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={18} color="black" />
      </TouchableOpacity>
      {title && (
        <>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.headerSpacer} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
  },
  backButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    backgroundColor: "#F4F4F4",
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: "PoppinsSemiBold",
    color: colors.primary,
    textAlign: "center",
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
  },
});
