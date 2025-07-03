import { useAuth } from "@/context/AuthContext";
import { Redirect, Slot } from "expo-router";
import { memo } from "react";
import Loading from "./loading";

function AuthProtect() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Slot />;
}

export default memo(AuthProtect);
