import { Stack } from "expo-router";
import { memo } from "react";

function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="breakfast" options={{ headerShown: false }} />
      <Stack.Screen name="lunch" options={{ headerShown: false }} />
      <Stack.Screen name="dinner" options={{ headerShown: false }} />
    </Stack>
  );
}

export default memo(RootLayout);
