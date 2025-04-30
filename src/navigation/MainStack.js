import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ScreenNames } from "../global";
import SplashScreen from "../screens/SplashScreen/SplashScreen";


const MainStack = () => {
  const Stack = createNativeStackNavigator();
  const options = {
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    headerShown: false,
  }
  const inititalRouteName = ScreenNames.SPLASH_SCREEN;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={inititalRouteName} screenOptions={options}>
      <Stack.Screen name={ScreenNames.SPLASH_SCREEN} component={SplashScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStack;

const styles = StyleSheet.create({});
