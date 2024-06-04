import React, { useEffect } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCirclePlus,
  faCircleMinus,
  faClock,
  faGear,
  faLocationDot,
  faTemperatureThreeQuarters,
} from "@fortawesome/free-solid-svg-icons";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../utility/url";

const BaseForm = () => {
  return (
    <View>
      <Text>Base Form</Text>
      <TextInput placeholder="Enter a value" />
    </View>
  );
};

const TimeForm = ({ setNewCondition, condition }) => {
  const { condition_time, condition_days } = condition;

  const [hour, minute] = condition_time
    ? condition_time.split(":")
    : ["00", "00"];

  const days = condition_days ? condition_days.split(",") : [];

  const [selectedHour, setSelectedHour] = useState(hour);
  const [selectedMinute, setSelectedMinute] = useState(minute);
  const [selectedDays, setSelectedDays] = useState(days);

  useEffect(() => {
    console.log("Time", condition);
    const newCondition = {
      id: condition.id,
      condition_type: "time",
      condition_time: `${selectedHour}:${selectedMinute}`,
      condition_days: selectedDays.join(","),
      condition_repeat: selectedDays.length > 0,
      condition_true: false,
    };

    setNewCondition(newCondition);
  }, [selectedHour, selectedMinute, selectedDays]);

  const hours = Array.from(Array(24).keys()).map((hour) => {
    return ("0" + hour).slice(-2);
  });

  const minutes = Array.from(Array(60).keys()).map((minute) => {
    return ("0" + minute).slice(-2);
  });

  const daysOfWeek = [
    { label: "Sunday", value: "Sunday" },
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
  ];

  const toggleDaySelection = (day) => {
    const isSelected = selectedDays.includes(day.value);
    if (isSelected) {
      setSelectedDays(
        selectedDays.filter((selectedDay) => selectedDay !== day.value)
      );
    } else {
      setSelectedDays([...selectedDays, day.value]);
    }
  };

  return (
    <View style={styles.timeView}>
      <View style={styles.titleView}>
        <FontAwesomeIcon icon={faClock} style={styles.baseIcon} size={30} />
        <Text style={styles.title}>Time condition</Text>
      </View>
      <Text style={styles.label}>Select the time</Text>
      <View style={styles.viewPicker}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedHour}
            onValueChange={(itemValue) => setSelectedHour(itemValue)}
            style={styles.picker}
          >
            {hours.map((hour) => (
              <Picker.Item key={hour} label={hour} value={hour} />
            ))}
          </Picker>

          <Picker
            selectedValue={selectedMinute}
            onValueChange={(itemValue) => setSelectedMinute(itemValue)}
            style={styles.picker}
          >
            {minutes.map((minute) => (
              <Picker.Item key={minute} label={minute} value={minute} />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.daysContainer}>
        <Text style={styles.dropdownHeader}>Repeat every:</Text>
        <View style={styles.dropdownList}>
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day.value}
              style={[
                styles.dayItem,
                selectedDays.includes(day.value) && styles.selectedItem,
              ]}
              onPress={() => toggleDaySelection(day)}
            >
              <Text style={styles.dayText}>{day.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const LocationForm = ({ setNewCondition, condition }) => {
  const latitude = condition.condition_location_latitude
    ? condition.condition_location_latitude
    : 45.80897;
  const longitude = condition.condition_location_longitude
    ? condition.condition_location_longitude
    : 15.9922;
  const [location_latitude, setLocationLatitude] = useState(latitude);
  const [location_longitude, setLocationLongitude] = useState(longitude);
  const [selectedLocation, setSelectedLocation] = useState({
    latitude,
    longitude,
  });

  useEffect(() => {
    console.log("Location", condition);
    const newCondition = {
      id: condition.id,
      condition_type: "location",
      condition_location_latitude: location_latitude.toString(),
      condition_location_longitude: location_longitude.toString(),
      condition_true: false,
    };

    setNewCondition(newCondition);
  }, [location_latitude, location_longitude]);

  handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocationLatitude(latitude);
    setLocationLongitude(longitude);
    setSelectedLocation({ latitude, longitude });
  };

  return (
    <View style={styles.locationView}>
      <View style={styles.titleView}>
        <FontAwesomeIcon
          icon={faLocationDot}
          style={styles.baseIcon}
          size={30}
        />
        <Text style={styles.title}>Location condition</Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView style={styles.map} onPress={handleMapPress}>
          {selectedLocation && <Marker coordinate={selectedLocation} />}
        </MapView>
        <Text style={styles.coordinate}>Latitude: {location_latitude}</Text>
        <Text style={styles.coordinate}>Longitude: {location_longitude}</Text>
      </View>
    </View>
  );
};

const WeatherForm = () => {
  return (
    <View>
      <Text>Weather Form</Text>
      <TextInput placeholder="Enter a weather condition" />
    </View>
  );
};

const TemperatureForm = ({ setNewCondition, condition }) => {
  const temp = condition.condition_temperature
    ? condition.condition_temperature
    : 0.0;
  const opt = condition.condition_option
    ? condition.condition_option
    : "Bellow";
  const typ = condition.condition_temperature_type
    ? condition.condition_temperature_type
    : "Your Location";
  const devId = condition.condition_device_id
    ? condition.condition_device_id
    : "";

  const [temperature, setTemperature] = useState(temp);
  const [selectedDevice, setSelectedDevice] = useState(devId);
  const [type, setType] = useState(typ);
  const [option, setOption] = useState(opt);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (devices.length === 0) {
      fetchDevices();
    }

    console.log("Temperature", condition);

    const newCondition = {
      id: condition.id,
      condition_type: "temperature",
      condition_temperature: temperature,
      condition_device_id: selectedDevice,
      condition_option: option,
      condition_temperature_type: type,
      condition_true: false,
    };
    setNewCondition(newCondition);
  }, [temperature, selectedDevice, type, option]);

  const increaseTemperature = () => {
    setTemperature(temperature + 0.1);
  };

  const decreaseTemperature = () => {
    setTemperature(temperature - 0.1);
  };

  const fetchDevices = async () => {
    url = BASE_URL;
    userId = await AsyncStorage.getItem("userId");
    try {
      const devicesResponse = await fetch(url + "/getUserDevices/" + userId);
      if (!devicesResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const devicesData = await devicesResponse.json();
      const filteredDevices = devicesData.filter(
        (device) =>
          device.device_attributes.temperature ||
          device.device_attributes.device_class == "temperature"
      );
      setDevices(filteredDevices);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <View style={styles.temperatureView}>
      <View style={styles.titleView}>
        <FontAwesomeIcon
          icon={faTemperatureThreeQuarters}
          style={styles.baseIcon}
          size={30}
        />
        <Text style={styles.title}>Temeperature condition</Text>
      </View>

      <View style={styles.temperatureContainer}>
        <TouchableOpacity onPress={decreaseTemperature} style={styles.button}>
          <FontAwesomeIcon icon={faCircleMinus} size={32} />
        </TouchableOpacity>
        <Text style={styles.temperatureText}>{temperature.toFixed(1)}°C</Text>
        <TouchableOpacity onPress={increaseTemperature} style={styles.button}>
          <FontAwesomeIcon icon={faCirclePlus} size={32} />
        </TouchableOpacity>
      </View>
      <View style={styles.typeView}>
        <Text style={styles.typeText}>Choose an option: </Text>
        <View style={styles.typeValueView}>
          <TouchableOpacity
            style={
              option == "Bellow"
                ? styles.typeOpacitySelected
                : styles.typeOpacity
            }
            onPress={() => setOption("Bellow")}
          >
            <Text style={styles.typeTextValue}>Bellow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              option == "Above"
                ? styles.typeOpacitySelected
                : styles.typeOpacity
            }
            onPress={() => setOption("Above")}
          >
            <Text style={styles.typeTextValue}>Above</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.typeText}>Choose which temperature to use: </Text>
        <View style={styles.typeValueView}>
          <TouchableOpacity
            style={
              type == "Your Location"
                ? styles.typeOpacitySelected
                : styles.typeOpacity
            }
            onPress={() => {
              setType("Your Location");
              setSelectedDevice("");
            }}
          >
            <Text style={styles.typeTextValue}>Your Location</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              type == "Device" ? styles.typeOpacitySelected : styles.typeOpacity
            }
            onPress={() => {
              setType("Device");
              setSelectedDevice(devices[0].id);
            }}
          >
            <Text style={styles.typeTextValue}>Device</Text>
          </TouchableOpacity>
        </View>
        {type == "Device" && (
          <View style={styles.tempPicker}>
            {devices.length == 0 && <Text>No devices available</Text>}
            <Picker
              selectedValue={selectedDevice}
              onValueChange={(itemValue) => setSelectedDevice(itemValue)}
            >
              {devices.map((device) => (
                <Picker.Item
                  key={device.id}
                  label={device.device_name}
                  value={device.id}
                />
              ))}
            </Picker>
          </View>
        )}
      </View>
    </View>
  );
};

const CustomConditionForm = ({ type, setNewCondition, condition }) => {
  switch (type) {
    case "base":
      return <BaseForm />;
    case "time":
      return (
        <TimeForm setNewCondition={setNewCondition} condition={condition} />
      );
    case "location":
      return (
        <LocationForm setNewCondition={setNewCondition} condition={condition} />
      );
    case "weather":
      return <WeatherForm />;
    case "temperature":
      return (
        <TemperatureForm
          setNewCondition={setNewCondition}
          condition={condition}
        />
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  timeView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#FF7B00",

    fontWeight: "bold",
  },

  viewPicker: {
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    backgroundColor: "white",
    margin: 10,
    padding: 5,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    width: 100,
  },
  daysContainer: {
    padding: 20,
    alignItems: "center",
  },
  dropdownHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dropdownList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  dayItem: {
    backgroundColor: "lightgray",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  selectedItem: {
    backgroundColor: "#FF7B00",
  },
  dayText: {
    fontSize: 16,
  },
  baseIcon: {
    color: "#FF7B00",
  },
  titleView: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 34,
    marginBottom: 10,
  },
  locationView: {
    flex: 1,
    justifyContent: "center",
    marginTop: 30,
  },
  temperatureView: {
    flex: 1,
    justifyContent: "center",
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    width: "80%",
    backgroundColor: "white",
    borderColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    color: "black",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 30,
  },
  inputText: {
    marginLeft: "10%",
    color: "black",
    width: "100%",
    fontSize: 16,
  },
  map: {
    width: Dimensions.get("window").width - 40,
    height: Dimensions.get("window").height - 400,
    borderColor: "#FF7B00",
    borderWidth: 3,
    borderRadius: 5,
    marginBottom: 10,
  },
  mapContainer: {
    flex: 1,
  },
  coordinate: {
    fontSize: 16,
    fontWeight: "bold",

    textAlign: "center",
  },
  temperatureContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  button: {
    marginHorizontal: 20,
  },
  temperatureText: {
    fontSize: 32,
    fontWeight: "bold",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    backgroundColor: "white",
  },
  typeView: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  tempPicker: {
    width: 290,
    height: "fit-content",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    backgroundColor: "white",

    padding: 5,
  },
  typeOpacity: {
    backgroundColor: "white",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: "black",

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,

    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  typeOpacitySelected: {
    backgroundColor: "#FF7B00",
    borderColor: "#FF7B00",
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: "black",

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  typeTextValue: {
    fontSize: 14,
  },
  typeValueView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: "black",

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    backgroundColor: "white",
    margin: 8,
    padding: 5,
  },
});

export default CustomConditionForm;
