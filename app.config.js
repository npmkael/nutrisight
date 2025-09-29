module.exports = ({ config }) => {
  require("dotenv").config();
  return {
    ...config,
    extra: {
      EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID:
        process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID:
        process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID:
        process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      EXPO_PUBLIC_SUSHI_SECRET: process.env.EXPO_PUBLIC_SUSHI_SECRET,
    },
  };
};
