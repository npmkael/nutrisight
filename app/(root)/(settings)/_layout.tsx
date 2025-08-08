import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="name" options={{ headerShown: false }} />
      <Stack.Screen name="details" options={{ headerShown: false }} />
      <Stack.Screen name="weight" options={{ headerShown: false }} />
      <Stack.Screen name="height" options={{ headerShown: false }} />
      <Stack.Screen name="age" options={{ headerShown: false }} />
      <Stack.Screen name="gender" options={{ headerShown: false }} />
      <Stack.Screen name="allergens" options={{ headerShown: false }} />
    </Stack>
  );
}
