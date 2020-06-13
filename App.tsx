import React from "react";
import { AppLoading } from "expo";
import { StatusBar } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import Routes from "./src/routes";
import { Ubuntu_700Bold, useFonts } from "@expo-google-fonts/ubuntu";
import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  // the <> component in the return statement can be used to replace a <View />
  return (
    <>
      <StatusBar barStyle="dark-content" translucent />
      <Routes />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gold",
    alignItems: "center",
    justifyContent: "center",
  },
});
