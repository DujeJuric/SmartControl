import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useState } from "react";
import { BASE_URL } from "../utility/url.js";
import { ActivityIndicator } from "react-native";

const Devices = ({ userData }) => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const url = BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const devicesResponse = await fetch(
          url + "/getUserDevices/" + userData.id
        );
        if (!devicesResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const devicesData = await devicesResponse.json();
        setDevices(devicesData);
        setLoading(false);
      } catch (error) {
        console.error("There was an error!", error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF7B00" />
      ) : (
        <View>
          <Text>Your devices:</Text>
          {devices.map((device) => (
            <View key={device.id}>
              <Text>{device.device_name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: "fit-content",
  },
});

export default Devices;
