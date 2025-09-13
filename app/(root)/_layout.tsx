import { Stack } from "expo-router";
import { memo } from "react";
import AuthProtect from "../../lib/AuthProtect";

function RootLayout() {
  return (
    <AuthProtect>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(settings)" options={{ headerShown: false }} />
        <Stack.Screen name="main-camera" options={{ headerShown: false }} />
        <Stack.Screen
          name="predictions"
          options={{
            headerShown: false,
            presentation: "modal",
            statusBarStyle: "light",
            statusBarBackgroundColor: "#000",
          }}
        />
        <Stack.Screen
          name="results"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="log-weight"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen name="(meals)" options={{ headerShown: false }} />
      </Stack>
    </AuthProtect>
  );
}

export default memo(RootLayout);
