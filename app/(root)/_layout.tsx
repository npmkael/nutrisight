import { Stack } from "expo-router";
import { memo } from "react";
import AuthProtect from "../../lib/AuthProtect";

function RootLayout() {
  return (
    <AuthProtect>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(settings)" options={{ headerShown: false }} />
        <Stack.Screen name="result" options={{ headerShown: false }} />
      </Stack>
    </AuthProtect>
  );
}

export default memo(RootLayout);
