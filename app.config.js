module.exports = ({ config }) => {
  // load local .env for dev (install dotenv if not present)
  try {
    require("dotenv").config();
  } catch (e) {
    // noop
  }

  // Public values that are safe to embed in the app
  const EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID =
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
    process.env.EXPO_GOOGLE_WEB_CLIENT_ID ||
    "";

  const EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID =
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
    process.env.EXPO_GOOGLE_ANDROID_CLIENT_ID ||
    "";

  const EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID =
    process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
    process.env.EXPO_GOOGLE_IOS_CLIENT_ID ||
    "";

  // Build-time secret (DO NOT add this to config.extra)
  const SUSHI_SECRET =
    process.env.SUSHI_SECRET || process.env.EXPO_SUSHI_SECRET;

  // If you need the secret for native build config only, use it here
  // but DO NOT expose it in config.extra; for example:
  // if (SUSHI_SECRET) {
  //   // configure some native-only plugin that requires it
  // }

  return {
    extra: {
      ...(config.extra || {}),
      // only public values here
      EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      // do NOT put SUSHI_SECRET here
    },
  };
};
