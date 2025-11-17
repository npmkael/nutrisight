import { UserProvider } from "@/context/AuthContext";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { memo, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Loading from "../components/Loading";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    GeistBold: require("../assets/fonts/Geist-Bold.ttf"),
    GeistSemiBold: require("../assets/fonts/Geist-SemiBold.ttf"),
    GeistMedium: require("../assets/fonts/Geist-Medium.ttf"),
    GeistRegular: require("../assets/fonts/Geist-Regular.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <Loading />; // Show loading screen while fonts are loading
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(root)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(onboarding)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </UserProvider>
    </GestureHandlerRootView>
  );
}

export default memo(RootLayout);
