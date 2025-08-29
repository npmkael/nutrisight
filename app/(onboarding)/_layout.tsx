import NonAuthProtect from "@/lib/NonAuthProtect";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <NonAuthProtect>
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
    </NonAuthProtect>
  );
}
