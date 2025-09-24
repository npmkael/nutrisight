import { Stack } from "expo-router";
import { memo } from "react";

function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="name" options={{ headerShown: false }} />
      <Stack.Screen name="details" options={{ headerShown: false }} />
      <Stack.Screen name="weight" options={{ headerShown: false }} />
      <Stack.Screen name="height" options={{ headerShown: false }} />
      <Stack.Screen name="age" options={{ headerShown: false }} />
      <Stack.Screen name="gender" options={{ headerShown: false }} />
      <Stack.Screen name="allergens" options={{ headerShown: false }} />
      <Stack.Screen name="change-password" options={{ headerShown: false }} />
      <Stack.Screen name="dietary-goals" options={{ headerShown: false }} />
      <Stack.Screen
        name="(edit)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default memo(RootLayout);
