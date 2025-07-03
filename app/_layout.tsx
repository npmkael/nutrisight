import { UserProvider, useAuth } from "@/context/AuthContext";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import Loading from "./loading";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return; // Wait until the auth state is loaded

    const inAuthGroup = segments[0] === "(auth)";

    if (user && !inAuthGroup) {
      // Redirect authenticated users to the home screen if they are not in the auth group.
      router.replace("/(root)/(tabs)/home");
    } else if (!user && !inAuthGroup) {
      // Redirect unauthenticated users to the sign-in screen.
      router.replace("/(auth)/sign-in");
    }
  }, [user, loading, segments, router]);

  // This component renders the actual screen content based on the route.
  return <Slot />;
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
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
    <UserProvider>
      <InitialLayout />
    </UserProvider>
  );
}
