import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { useState } from "react";
import { BASE_URL } from "../utility/url.js";
import { ActivityIndicator } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "./customButton";
import CustomDeviceComponent from "./CustomDeviceComponent.js";
import { Picker } from "@react-native-picker/picker";
import { set } from "lodash";

const Devices = ({ userData }) => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState(devices);
  const [filter, setFilter] = useState("All");
  const filterOptions = [
    "All",
    "Light",
    "Switch",
    "Sensor",
    "Fan",
    "Weather",
    "Binary_Sensor",
  ];
  const [isDeviceEditVisible, setIsDeviceEditVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState({});
  const url = BASE_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const devicesResponse = await fetch(
        url + "/getUserDevices/" + userData.id
      );
      if (!devicesResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const devicesData = await devicesResponse.json();
      console.log("fetching");
      setDevices(devicesData);
      setFilteredDevices(devicesData);
      setLoading(false);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const openEditDevice = (device) => {
    setSelectedDevice(device);
    setIsDeviceEditVisible(true);
  };

  const closeEditDevice = () => {
    setIsDeviceEditVisible(false);
    fetchData();
    setFilter("All");
  };

  const filterChange = () => {
    if (filter === "All") {
      setFilteredDevices(devices);
    } else {
      const filtered = devices.filter(
        (device) => device.device_type === filter.toLowerCase()
      );
      setFilteredDevices(filtered);
    }
    setIsFilterVisible(false);
  };

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
              {filteredDevices.length === 0 ? (
                <Text style={styles.deviceInfo}>There are no devices.</Text>
              ) : (
                filteredDevices.map((device) => (
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
        </View>
      )}
      <View style={styles.filterView}>
        <Text style={styles.filterText}>Filter: </Text>
        <CustomButton title={filter} onPress={() => setIsFilterVisible(true)} />
      </View>
      <Modal
        visible={isDeviceEditVisible}
        onRequestClose={() => closeEditDevice()}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.modalView}>
          <CustomDeviceComponent
            deviceType={selectedDevice.device_type}
            device={selectedDevice}
            closeEditDevice={closeEditDevice}
          />
          <View style={styles.buttonView}>
            <Button title="Back" onPress={() => closeEditDevice()} />
          </View>
        </View>
      </Modal>
      <Modal
        visible={isFilterVisible}
        onRequestClose={() => setIsFilterVisible(false)}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalFilterView}>
          <View style={styles.filterPickerView}>
            <Picker
              selectedValue={filter}
              onValueChange={(itemValue) => setFilter(itemValue)}
            >
              {filterOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
          <Button title="Apply" onPress={() => filterChange()} />
        </View>
      </Modal>
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
  modalView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    marginTop: 50,
  },
  buttonView: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  modalFilterView: {
    marginVertical: 200,
    marginHorizontal: 20,

    justifyContent: "center",
    height: "45%",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 50,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    padding: 5,
    backgroundColor: "white",
  },
  filterView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  filterText: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },
  filterPickerView: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    backgroundColor: "white",
    margin: 10,
    padding: 5,
  },
});

export default Devices;
