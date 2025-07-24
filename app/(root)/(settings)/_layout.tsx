import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="name" options={{ headerShown: false }} />
    </Stack>
  );
}
