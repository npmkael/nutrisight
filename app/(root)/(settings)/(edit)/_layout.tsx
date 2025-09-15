import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="edit-calories" options={{ headerShown: false }} />
      <Stack.Screen name="edit-carbs" options={{ headerShown: false }} />
      <Stack.Screen name="edit-protein" options={{ headerShown: false }} />
      <Stack.Screen name="edit-fats" options={{ headerShown: false }} />
    </Stack>
  );
}
