import { UserProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
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

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(root)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <UserProvider>
      <InitialLayout />
    </UserProvider>
  );
}
