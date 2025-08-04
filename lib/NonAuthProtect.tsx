import { useAuth } from "@/context/AuthContext";
import { Redirect, useSegments } from "expo-router";
import { memo, ReactNode } from "react";
import Loading from "../components/Loading";

interface GuestProtectProps {
  children: ReactNode;
}

function GuestProtect({ children }: GuestProtectProps) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const path = segments.join("/");

  // Define the public auth pages that should not show a loading screen
  const isPublicAuthPage =
    path === "(auth)/sign-in" || path === "(auth)/sign-up";

  if (loading && !isPublicAuthPage) {
    return <Loading />;
  }

  if (user && user.isVerified) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  return <>{children}</>;
}

export default memo(GuestProtect);
