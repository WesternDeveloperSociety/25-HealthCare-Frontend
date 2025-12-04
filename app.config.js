// app.config.js
module.exports = {
    expo: {
      name: "starter-kit-expo",
      slug: "starter-kit-expo",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/icon.png",
      scheme: "myapp",
      userInterfaceStyle: "automatic",
      newArchEnabled: true,
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.anonymous.starterkitexpo",
        infoPlist: {
          NSLocationWhenInUseUsageDescription: "We need your location to show nearby clinics",
          NSLocationAlwaysAndWhenInUseUsageDescription: "We need your location to show nearby clinics",
        },
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/images/adaptive-icon.png",
          backgroundColor: "#ffffff",
        },
        package: "com.anonymous.starterkitexpo",
        permissions: [
          "ACCESS_FINE_LOCATION",
          "ACCESS_COARSE_LOCATION"
        ],
      },
      web: {
        bundler: "metro",
        output: "static",
      },
      plugins: [
        "expo-router",
        [
          "@rnmapbox/maps",
          {
            RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOAD_TOKEN,
          },
        ],
      ],
      experiments: {
        typedRoutes: true,
      },
    },
  };