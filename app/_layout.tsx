import { UserProvider, useAuth } from "@/context/AuthContext";
import { useFonts } from "expo-font";
import { SplashScreen, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

const InitialLayout = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (user) {
      // Redirect authenticated users to the home screen.
      router.replace("/(root)/(tabs)/home");
    } else if (!inAuthGroup) {
      // Redirect unauthenticated users to the sign-in screen.
      router.replace("/(auth)/sign-in");
    }
  }, [user, loading, segments, router]);

  // Return null since this component only handles redirection
  return null;
};

export default function RootLayout() {
  const [loaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return (
    <UserProvider>
      <InitialLayout />
    </UserProvider>
  );
}
