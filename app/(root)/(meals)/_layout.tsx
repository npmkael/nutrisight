import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="breakfast" options={{ headerShown: false }} />
      <Stack.Screen name="lunch" options={{ headerShown: false }} />
      <Stack.Screen name="dinner" options={{ headerShown: false }} />
      <Stack.Screen name="snacks" options={{ headerShown: false }} />
    </Stack>
  );
}
