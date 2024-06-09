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
import { getDevices } from "./HomeAssitantService";
import { ColorSpace } from "react-native-reanimated";
import { isEqual } from "lodash";

LogBox.ignoreLogs([
  "FontAwesomeIcon: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
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

      if (userDataId === null) {
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      const latitude = loc.coords.latitude;
      const longitude = loc.coords.longitude;

      await AsyncStorage.setItem("latitude", latitude.toString());
      await AsyncStorage.setItem("longitude", longitude.toString());

      updateTemperature(userDataId, latitude, longitude);
      updateDevices(userDataId);

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

    const updateDevices = async (userDataId) => {
      const storedDevices = await getStoredDevices(userDataId);
      const devices = await getDevices();
      addDevices(storedDevices, devices, userDataId);
    };

    const getStoredDevices = async () => {
      const url = BASE_URL;
      try {
        const response = await fetch(url + "/getUserDevices/" + userId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const devicesData = await response.json();

        return devicesData;
      } catch (error) {
        console.error("There was an error!", error);
      }
    };

    const addDevices = async (storedDevices, devices, userDataId) => {
      const storedEntityIds = storedDevices.map(
        (device) => device.device_entity_id
      );

      const presentEntityIds = [];

      for (i = 0; i < devices.length; i++) {
        const body = {
          device_name: devices[i].attributes.friendly_name,
          device_type: devices[i].entity_id.split(".")[0],
          device_state: devices[i].state,
          device_attributes: devices[i].attributes,
          device_last_changed: devices[i].last_changed,
          device_last_updated: devices[i].last_updated,
          device_context_id: devices[i].context.id,
          device_entity_id: devices[i].entity_id,
          device_user_id: userDataId,
        };

        if (storedEntityIds.includes(body.device_entity_id)) {
          const storedDevice =
            storedDevices[storedEntityIds.indexOf(body.device_entity_id)];
          presentEntityIds.push(body.device_entity_id);

          if (
            storedDevice.device_state !== body.device_state ||
            !isEqual(storedDevice.device_attributes, body.device_attributes) ||
            storedDevice.device_last_changed !== body.device_last_changed ||
            storedDevice.device_last_updated !== body.device_last_updated ||
            storedDevice.device_context_id !== body.device_context_id
          ) {
            console.log("Updating device in database " + body.device_name);
            updateDevice(storedDevice, body);
          }
        }
      }

      storedDevices.forEach((device) => {
        if (!presentEntityIds.includes(device.device_entity_id)) {
          console.log("Deleting device from database " + device.device_name);
          deleteDevice(device.id);
        }
      });
    };

    const updateDevice = async (storedDevice, newDevice) => {
      const url = BASE_URL;

      body = {
        device_name: storedDevice.device_name,
        device_type: storedDevice.device_type,
        device_state: newDevice.device_state,
        device_attributes: newDevice.device_attributes,
        device_last_changed: newDevice.device_last_changed,
        device_last_updated: newDevice.device_last_updated,
        device_context_id: newDevice.device_context_id,
        device_entity_id: storedDevice.device_entity_id,
        device_user_id: storedDevice.device_user_id,
      };

      try {
        const response = await fetch(url + "/updateDevice/" + storedDevice.id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("There was an error!", error);
      }
    };

    const deleteDevice = async (id) => {
      const url = BASE_URL;

      try {
        const response = await fetch(url + "/deleteDevice/" + id, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("There was an error!", error);
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
