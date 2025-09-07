import { Redirect } from "expo-router";
import { memo } from "react";

function Index() {
  console.log("Index component rendered");
  return <Redirect href="/(auth)/success-account" />;
}

export default memo(Index);
