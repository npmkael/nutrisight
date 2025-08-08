import NonAuthProtect from "@/lib/NonAuthProtect";
import { Stack } from "expo-router";
import { memo } from "react";
import "../../global.css";

function RootLayout() {
  return (
    <NonAuthProtect>
      <Stack>
        <Stack.Screen
          name="welcome"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="otp"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </NonAuthProtect>
  );
}

export default memo(RootLayout);
