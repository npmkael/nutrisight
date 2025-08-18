import { Redirect } from "expo-router";
import { memo } from "react";

function Index() {
  return <Redirect href="/(onboarding)/onboarding" />;
}

export default memo(Index);
