import LoadingScreen from "@/components/loading-screen";
import { useAuth } from "@/context/AuthContext";
import { Redirect, useSegments } from "expo-router";
import { memo, ReactNode } from "react";

interface GuestProtectProps {
  children: ReactNode;
}

function GuestProtect({ children }: GuestProtectProps) {
  const { user, loading, checkingSession } = useAuth();
  const segments = useSegments();
  const path = segments.join("/");

  // Define the public auth pages that should not show a loading screen
  const isPublicAuthPage =
    path === "(auth)/sign-in" || path === "(auth)/sign-up";

  if (checkingSession)
    return (
      <LoadingScreen
        messages={[
          "Checking your session…",
          "Verifying your account…",
          "Loading your data…",
        ]}
      />
    );

  if (loading && !isPublicAuthPage)
    return (
      <LoadingScreen
        messages={["Loading…", "Getting things ready…", "Almost there…"]}
      />
    );

  if (user && user.isVerified) return <Redirect href="/(root)/(tabs)/home" />;

  return <>{children}</>;
}

export default memo(GuestProtect);
