import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default function App() {
  const [appState, setAppState] = useState("splash");
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("wayfinder_onboarded").then((val) => {
      setHasOnboarded(val === "true");
    });
  }, []);

  function handleSplashFinish() {
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

  // The splash and onboarding returns stay the same.
  // Only the NavigationContainer return gets wrapped:

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
