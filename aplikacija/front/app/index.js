import React from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import Main from "./main";
import { LogBox } from "react-native";
import "react-native-reanimated";
import * as Notifications from "expo-notifications";
import { showAlert } from "../utility/customAlert.js";
import * as Location from "expo-location";
import { BASE_URL } from "../utility/url.js";

LogBox.ignoreLogs([
  "FontAwesomeIcon: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
]);
LogBox.ignoreLogs([
  "There was a problem with the fetch operation:",
  "There was an error! [TypeError: Network request failed]",
]);

LogBox.ignoreAllLogs();

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        console.log(token);
        if (token !== null) {
          setUserToken(token);
        }
      } catch (error) {
        console.error("Error retrieving user token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const setupNotifications = async () => {
      const notificationListener =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("Notification received:", notification);
          showAlert(
            notification.request.content.title,
            notification.request.content.body
          );
        });

      const responseListener =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("Notification response received:", response);
        });

      return () => {
        console.log("Removing notification subscriptions");
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
      };
    };

    const checkAndRequestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      } else {
        updateLocation();
        const interval = setInterval(() => {
          updateLocation();
        }, 60000);
        return () => clearInterval(interval);
      }
    };

    const updateLocation = async () => {
      userDataId = await AsyncStorage.getItem("userId");
      console.log("User Data ID: ", userDataId);
      if (userDataId === null) {
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      const latitude = loc.coords.latitude;
      const longitude = loc.coords.longitude;
      console.log("Latitude: ", latitude);
      console.log("Longitude: ", longitude);

      await AsyncStorage.setItem("latitude", latitude.toString());
      await AsyncStorage.setItem("longitude", longitude.toString());

      updateTemperature(userDataId, latitude, longitude);

      const url = BASE_URL;
      try {
        const response = await fetch(
          url + "/changeLocationContext/" + userDataId,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              context_user_id: userDataId,
              context_location_latitude: latitude.toString(),
              context_location_longitude: longitude.toString(),
              context_device_id: "",
              context_temperature: 0.0,
              context_token: "",
            }),
          }
        );
      } catch (error) {
        console.error("Location error!", error);
      }
    };

    const updateTemperature = async (userDataId, latitude, longitude) => {
      WEATHER_API_KEY = "356bfb1cab144acdb4b214441240106";
      const weatherUrl = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}`;
      try {
        const response = await fetch(weatherUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const weatherData = await response.json();
        const temperature = weatherData.current.temp_c;
        console.log("Temperature: ", temperature);
        await AsyncStorage.setItem("temperature", temperature.toString());

        const url = BASE_URL;
        const response2 = await fetch(
          url + "/changeTemperatureContext/" + userDataId,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              context_user_id: userDataId,
              context_location_latitude: latitude.toString(),
              context_location_longitude: longitude.toString(),
              context_device_id: "",
              context_temperature: temperature,
              context_token: "",
            }),
          }
        );
      } catch (error) {
        console.error("Temp error!", error);
      }
    };

    checkToken();
    setupNotifications();
    checkAndRequestLocationPermission();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{userToken === null ? <LoginPage /> : <Main />}</>;
};

export default Home;
