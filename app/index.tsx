import { Redirect } from "expo-router";
import { memo } from "react";

function Index() {
  console.log("Index component rendered");
  return <Redirect href="/(auth)/onboarding" />;
}

export default memo(Index);
