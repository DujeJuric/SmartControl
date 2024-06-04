import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { BASE_URL } from "../utility/url.js";
import { ActivityIndicator } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "./customButton";

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

  const openEditDevice = () => {};

  const addDevice = () => {};

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF7B00" />
      ) : (
        <View style={styles.mainView}>
          <Text style={styles.title}>Your devices</Text>
          <View style={styles.deviceList}>
            <ScrollView
              showsVerticalScrollIndicator={true}
              indicatorStyle="black"
            >
              {devices.length === 0 ? (
                <Text style={styles.deviceInfo}>
                  There are no devices added.
                </Text>
              ) : (
                devices.map((device) => (
                  <TouchableOpacity
                    key={device.id}
                    onPress={() => openEditDevice(device)}
                  >
                    <View style={styles.devices}>
                      <Text style={styles.deviceText}>
                        {device.device_name}
                      </Text>
                      <FontAwesomeIcon
                        icon={faGear}
                        size={20}
                        style={styles.deviceIcons}
                      />
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
          <CustomButton onPress={addDevice} title="Add a new device" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    height: "fit-content",
  },
  title: {
    fontSize: 28,
    color: "#FF7B00",
    fontWeight: "bold",
    shadowColor: "black",
    shadowOffset: { width: -1, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    marginTop: 20,
  },
  deviceList: {
    width: "fit-content",
    height: "70%",
    backgroundColor: "#FF7B00",
    borderColor: "black",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    color: "black",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 30,
  },
  mainView: {
    flex: 1,
    width: "90%",
    alignItems: "center",
  },
  deviceText: {
    fontSize: 15,
    maxWidth: 200,
    paddingRight: "10%",
    color: "black",
    fontWeight: "bold",
  },
  devices: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    margin: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  deviceIcons: {
    color: "darkgray",
  },
});

export default Devices;
