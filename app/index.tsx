import { Redirect } from "expo-router";
import { memo } from "react";

function Index() {
  return <Redirect href="/(auth)/welcome" />;
}

export default memo(Index);
