import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { memo, ReactNode } from "react";
import Loading from "../components/Loading";

interface GuestProtectProps {
  children: ReactNode;
}

function GuestProtect({ children }: GuestProtectProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (user && user.isVerified) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  return <>{children}</>;
}

export default memo(GuestProtect);
