import { Stack } from "expo-router";
import AuthProtect from "../../lib/AuthProtect";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(settings)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)/home" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)/progress" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)/account" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)/settings" options={{ headerShown: false }} />
      <Stack.Screen name="result" options={{ headerShown: false }} />
    </Stack>
    <AuthProtect>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/home" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/progress" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/account" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/settings" options={{ headerShown: false }} />
      </Stack>
    </AuthProtect>
  );
}
