import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./pages/Home";
import Points from "./pages/Points";
import Detail from "./pages/Detail";

const AppStack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      {/* headerMode = none is to remove the header from every page */}
      {/* the screenOption is to have the same background color for all screens */}
      <AppStack.Navigator
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: "#f0f0f5",
          },
        }}
      >
        {/* each page from the application needs to have a router */}
        <AppStack.Screen name="Home" component={Home} />
        <AppStack.Screen name="Points" component={Points} />
        <AppStack.Screen name="Detail" component={Detail} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
