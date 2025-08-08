import { Redirect } from "expo-router";
import { memo } from "react";

function Index() {
  return <Redirect href="/(auth)/sign-up" />;
}

export default memo(Index);
