import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { memo, ReactNode } from "react";
import Loading from "../app/loading";

interface AuthProtectProps {
  children: ReactNode;
}

function AuthProtect({ children }: AuthProtectProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <>{children}</>;
}

export default memo(AuthProtect);
