import { Redirect } from "expo-router";
import { memo } from "react";

function Index() {
  console.log("Index component rendered");
  return <Redirect href="/(auth)/(setup)/1" />;
}

export default memo(Index);
