import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as ExpoSplash from "expo-splash-screen";
import React, { useEffect } from "react";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import HomeScreen from "./src/screens/Homescreen";
import ProductDetailsScreen from "./src/screens/ProductDetailsScreen";
import CustomSplashScreen from "./src/screens/SplashScreen";
import { Product } from "./src/types";

ExpoSplash.preventAutoHideAsync();

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Details: { product: Product };
  Favorites: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    ExpoSplash.hideAsync();
  }, []);

  const SplashRoute = ({ navigation }: any) => {
    useEffect(() => {
      const t = setTimeout(() => navigation.replace("Home"), 2500);
      return () => clearTimeout(t);
    }, [navigation]);
    return <CustomSplashScreen onFinish={() => {}} />;
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashRoute as any} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Products" }} />
        <Stack.Screen name="Details" component={ProductDetailsScreen} options={{ title: "Product Details" }} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: "Favourites" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
