import { Stack } from "expo-router";
import AuthProtect from "../../lib/AuthProtect";

export default function RootLayout() {
  return (
    <AuthProtect>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProtect>
  );
}
