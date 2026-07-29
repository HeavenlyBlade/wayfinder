import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AppState, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationBar from "expo-navigation-bar";

import SplashScreen from "./src/screens/SplashScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import HomeScreen from "./src/screens/HomeScreen";
import MapScreen from "./src/screens/MapScreen";
import ARScreen from "./src/screens/ARScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import AboutScreen from "./src/screens/AboutScreen";
import SurveyScreen from "./src/screens/SurveyScreen";
import { SettingsProvider } from "./src/context/SettingsContext";

const Stack = createStackNavigator();

// Hide the Android software navigation bar (back/home/recents buttons).
// Uses "immersive" behaviour — bar auto-hides and reappears only on swipe.
// Safe no-op on iOS (no software nav bar exists).
async function hideNavBar() {
  if (Platform.OS !== "android") return;
  try {
    await NavigationBar.setVisibilityAsync("hidden");
    await NavigationBar.setBehaviorAsync("inset-swipe"); // swipe from edge to peek
  } catch (_) {}
}

export default function App() {
  const [appState, setAppState] = useState("splash");
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [onboardChecked, setOnboardChecked] = useState(false);

  // Hide nav bar on mount and every time the app comes back to foreground
  useEffect(() => {
    hideNavBar();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") hideNavBar();
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("wayfinder_onboarded").then((val) => {
      setHasOnboarded(val === "true");
      setOnboardChecked(true);
    });
  }, []);

  function handleSplashFinish() {
    if (!onboardChecked) return;
    setAppState(hasOnboarded ? "ready" : "onboarding");
  }

  async function handleOnboardingFinish() {
    await AsyncStorage.setItem("wayfinder_onboarded", "true");
    setAppState("ready");
  }

  if (appState === "splash")
    return <SplashScreen onFinish={handleSplashFinish} />;
  if (appState === "onboarding")
    return <OnboardingScreen onFinish={handleOnboardingFinish} />;

  return (
    <SettingsProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false, animation: "fade" }}
          initialRouteName="Home"
        >
          <Stack.Screen name="Home"     component={HomeScreen} />
          <Stack.Screen name="Map"      component={MapScreen} />
          <Stack.Screen name="AR"       component={ARScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="About"    component={AboutScreen} />
          <Stack.Screen name="Survey"   component={SurveyScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SettingsProvider>
  );
}
