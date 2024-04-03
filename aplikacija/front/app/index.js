import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import RegistrationPage from "./RegistrationPage.js";

const Stack = createNativeStackNavigator();

export const BASE_URL = "https://7b7d-213-202-117-142.ngrok-free.app";

const Home = () => {
  return <RegistrationPage />;
};

export default Home;
