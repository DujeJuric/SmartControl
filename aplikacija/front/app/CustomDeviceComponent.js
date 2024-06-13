import { React, useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Button,
  TextInput,
  Switch,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTag,
  faLightbulb,
  faCloud,
  faToggleOn,
  faWifi,
  faFan,
} from "@fortawesome/free-solid-svg-icons";
import { turnOffDevice, turnOnDevice } from "./HomeAssitantService";
import ColorPicker from "./ColorPicker";
import { SafeAreaView } from "react-native";
import CustomButton from "./customButton";
import TempColorPicker from "./TempColorPicker";

const Light = ({ device, closeEditDevice }) => {
  const [xValue, setXValue] = useState(
    device.device_attributes.xy_color ? device.device_attributes.xy_color[0] : 0
  );
  const [yValue, setYValue] = useState(
    device.device_attributes.xy_color ? device.device_attributes.xy_color[1] : 0
  );

  const [tempColor, setTempColor] = useState(
    device.device_attributes.color_temp
      ? device.device_attributes.color_temp
      : 0
  );
  const [brightness, setBrightness] = useState(
    device.device_attributes.brightness
      ? device.device_attributes.brightness
      : 3
  );

  const [state, setState] = useState(
    device.device_state === "on" ? true : false
  );

  const [deviceName, setDeviceName] = useState(device.device_name);
  const deviceNameInputRef = useRef(null);
  const isAvailable = device.device_state === "unavailable" ? false : true;

  useEffect(() => {}, []);

  const turnOn = async () => {
    const body = {
      entity_id: device.device_entity_id,
    };
    const data = await turnOnDevice(body, "light", device.id);
    closeEditDevice();
  };

  const turnOff = async () => {
    const body = {
      entity_id: device.device_entity_id,
    };

    const data = await turnOffDevice(body, "light", device.id);
    closeEditDevice();
  };

  const edit = async () => {
    if (device.device_attributes.color_mode === "xy") {
      const body = {
        entity_id: device.device_entity_id,
        xy_color: [xValue, yValue],
        brightness: brightness,
      };
      data = await turnOnDevice(body, "light", device.id);
    } else if (device.device_attributes.color_mode === "color_temp") {
      const body = {
        entity_id: device.device_entity_id,
        color_temp: tempColor,
        brightness: brightness,
      };
      data = await turnOnDevice(body, "light", device.id);
    }
  };

  const deviceNameInputPress = () => {
    deviceNameInputRef.current.focus();
  };

  const toggleSwitch = () => {
    setState((previousState) => !previousState);
    if (state == 1) {
      turnOff();
    } else {
      turnOn();
    }
  };

  return (
    <View style={styles.view}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>Device type: Light</Text>
        <FontAwesomeIcon icon={faLightbulb} size={35} color="#FF7B00" />
      </View>
      <TouchableOpacity
        onPress={deviceNameInputPress}
        style={styles.inputDeviceField}
      >
        <FontAwesomeIcon icon={faTag} size={25} color="darkgray" />
        <TextInput
          ref={deviceNameInputRef}
          style={styles.inputText}
          placeholder="Device name"
          value={deviceName}
          onChangeText={setDeviceName}
          placeholderTextColor="darkgray"
        />
      </TouchableOpacity>
      {!isAvailable ? (
        <Text style={{ color: "red", marginTop: 10 }}>
          Device is not available
        </Text>
      ) : (
        <View style={styles.switch}>
          <Text style={styles.switchText}>{state == 1 ? "ON" : "OFF"}</Text>
          <Switch
            trackColor={{ false: "gray", true: "#FF7B00" }}
            thumbColor={state ? "#f4f3f4" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={state}
          />
        </View>
      )}
      {device.device_attributes.color_mode === "xy" && (
        <View style={styles.container}>
          <ColorPicker
            xValue={xValue}
            yValue={yValue}
            brightness={brightness}
            setXValue={setXValue}
            setYValue={setYValue}
            setBrightness={setBrightness}
          />
          <CustomButton title="Save" onPress={edit} marginTop={0} />
        </View>
      )}
      {device.device_attributes.color_mode === "color_temp" && (
        <View style={styles.container}>
          <TempColorPicker
            min={device.device_attributes.min_mireds}
            max={device.device_attributes.max_mireds}
            colorTemp={tempColor}
            setColorTemp={setTempColor}
            brightness={brightness}
            setBrightness={setBrightness}
          />
          <CustomButton title="Save" onPress={edit} marginTop={0} />
        </View>
      )}
    </View>
  );
};

const DeviceSwitch = ({ device, closeEditDevice }) => {
  const [state, setState] = useState(
    device.device_state === "on" ? true : false
  );
  const stateStaus = device.device_state;

  const isAvailable =
    device.device_state === "on" || device.device_state === "off";

  const [deviceName, setDeviceName] = useState(device.device_name);
  const deviceNameInputRef = useRef(null);

  const deviceNameInputPress = () => {
    deviceNameInputRef.current.focus();
  };

  const toggleSwitch = () => {
    setState((previousState) => !previousState);
    if (state == 1) {
      turnOff();
    } else {
      turnOn();
    }
  };

  const turnOn = () => {
    const body = {
      entity_id: device.device_entity_id,
    };
    turnOnDevice(body, "switch", device.id);
  };

  const turnOff = () => {
    const body = {
      entity_id: device.device_entity_id,
    };
    turnOffDevice(body, "switch", device.id);
  };

  const edit = () => {
    closeEditDevice();
  };

  return (
    <View style={styles.view}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>Device type: Switch</Text>
        <FontAwesomeIcon icon={faToggleOn} size={35} color="#FF7B00" />
      </View>
      <TouchableOpacity
        onPress={deviceNameInputPress}
        style={styles.inputDeviceField}
      >
        <FontAwesomeIcon icon={faTag} size={25} color="darkgray" />
        <TextInput
          ref={deviceNameInputRef}
          style={styles.inputText}
          placeholder="Device name"
          value={deviceName}
          onChangeText={setDeviceName}
          placeholderTextColor="darkgray"
        />
      </TouchableOpacity>
      {!isAvailable ? (
        <Text style={styles.stateText}>Switch state: {stateStaus}</Text>
      ) : (
        <View style={styles.switch}>
          <Text style={styles.switchText}>{state == 1 ? "ON" : "OFF"}</Text>
          <Switch
            trackColor={{ false: "gray", true: "#FF7B00" }}
            thumbColor={state ? "#f4f3f4" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={state}
          />
        </View>
      )}
      <CustomButton
        title="Save"
        onPress={() => {
          edit();
        }}
        marginTop={20}
      />
    </View>
  );
};

const Sensor = ({ device, closeEditDevice }) => {
  const [deviceName, setDeviceName] = useState(device.device_name);
  const deviceNameInputRef = useRef(null);

  const state = device.device_state;
  const isNumber = !isNaN(state);
  const isDate = state.includes("-") && state.includes("T");
  const date = new Date(state);

  const unit = device.device_attributes.unit_of_measurement
    ? device.device_attributes.unit_of_measurement
    : "";

  const deviceNameInputPress = () => {
    deviceNameInputRef.current.focus();
  };

  const edit = () => {
    closeEditDevice();
  };

  return (
    <View style={styles.view}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>Device type: Sensor</Text>
        <FontAwesomeIcon icon={faWifi} size={35} color="#FF7B00" />
      </View>
      <TouchableOpacity
        onPress={deviceNameInputPress}
        style={styles.inputDeviceField}
      >
        <FontAwesomeIcon icon={faTag} size={25} color="darkgray" />
        <TextInput
          ref={deviceNameInputRef}
          style={styles.inputText}
          placeholder="Device name"
          value={deviceName}
          onChangeText={setDeviceName}
          placeholderTextColor="darkgray"
        />
      </TouchableOpacity>
      {isNumber ? (
        <Text style={styles.stateText}>
          Sensor value: {state} {unit}
        </Text>
      ) : isDate ? (
        <Text style={styles.stateText}>
          Sensor value: {date.toLocaleString()}
        </Text>
      ) : (
        <Text style={styles.stateText}>Sensor state: {state}</Text>
      )}
      <CustomButton
        title="Save"
        onPress={() => {
          edit();
        }}
        marginTop={20}
      />
    </View>
  );
};

const BinarySensor = ({ device, closeEditDevice }) => {
  const [state, setState] = useState(
    device.device_state === "on" ? true : false
  );
  const stateStaus = device.device_state;

  const isAvailable =
    device.device_state === "on" || device.device_state === "off";

  const [deviceName, setDeviceName] = useState(device.device_name);
  const deviceNameInputRef = useRef(null);

  const deviceNameInputPress = () => {
    deviceNameInputRef.current.focus();
  };

  const toggleSwitch = () => {
    setState((previousState) => !previousState);
    if (state == 1) {
      turnOff();
    } else {
      turnOn();
    }
  };

  const turnOn = () => {
    const body = {
      entity_id: device.device_entity_id,
    };
    turnOnDevice(body, "switch", device.id);
  };

  const turnOff = () => {
    const body = {
      entity_id: device.device_entity_id,
    };
    turnOffDevice(body, "switch", device.id);
  };

  const edit = () => {
    closeEditDevice();
  };

  return (
    <View style={styles.view}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>Device type: Binary Sensor</Text>
        <FontAwesomeIcon icon={faWifi} size={35} color="#FF7B00" />
      </View>
      <TouchableOpacity
        onPress={deviceNameInputPress}
        style={styles.inputDeviceField}
      >
        <FontAwesomeIcon icon={faTag} size={25} color="darkgray" />
        <TextInput
          ref={deviceNameInputRef}
          style={styles.inputText}
          placeholder="Device name"
          value={deviceName}
          onChangeText={setDeviceName}
          placeholderTextColor="darkgray"
        />
      </TouchableOpacity>
      {!isAvailable ? (
        <Text style={styles.stateText}>Binary sensor state: {stateStaus}</Text>
      ) : (
        <View style={styles.switch}>
          <Text style={styles.switchText}>{state == 1 ? "ON" : "OFF"}</Text>
          <Switch
            trackColor={{ false: "gray", true: "#FF7B00" }}
            thumbColor={state ? "#f4f3f4" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={state}
          />
        </View>
      )}
      <CustomButton
        title="Save"
        onPress={() => {
          edit();
        }}
        marginTop={20}
      />
    </View>
  );
};

const Weather = ({ device, closeEditDevice }) => {
  const state = device.device_state;
  const temperature = device.device_attributes.temperature;
  const temperatureUnit = device.device_attributes.temperature_unit;
  const humidity = device.device_attributes.humidity;
  const dewPoint = device.device_attributes.dew_point;
  const CloudCover = device.device_attributes.cloud_coverage;
  const pressure = device.device_attributes.pressure;
  const pressureUnit = device.device_attributes.pressure_unit;
  const windSpeed = device.device_attributes.wind_speed;
  const windSpeedUnit = device.device_attributes.wind_speed_unit;

  const [deviceName, setDeviceName] = useState(device.device_name);
  const deviceNameInputRef = useRef(null);

  const deviceNameInputPress = () => {
    deviceNameInputRef.current.focus();
  };

  const edit = () => {
    closeEditDevice();
  };

  return (
    <View style={styles.view}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>Device type: Weather</Text>
        <FontAwesomeIcon icon={faCloud} size={35} color="#FF7B00" />
      </View>
      <TouchableOpacity
        onPress={deviceNameInputPress}
        style={styles.inputDeviceField}
      >
        <FontAwesomeIcon icon={faTag} size={25} color="darkgray" />
        <TextInput
          ref={deviceNameInputRef}
          style={styles.inputText}
          placeholder="Device name"
          value={deviceName}
          onChangeText={setDeviceName}
          placeholderTextColor="darkgray"
        />
      </TouchableOpacity>
      <View style={styles.weatherInfo}>
        <Text style={styles.weatherText}>Weather: {state}</Text>
        <Text style={styles.weatherText}>
          Temperature: {temperature} {temperatureUnit}
        </Text>
        <Text style={styles.weatherText}>Humidity: {humidity}</Text>
        <Text style={styles.weatherText}>Dew point: {dewPoint}</Text>
        <Text style={styles.weatherText}>Cloud coverage: {CloudCover}</Text>
        <Text style={styles.weatherText}>
          Pressure: {pressure} {pressureUnit}
        </Text>
        <Text style={styles.weatherText}>
          Wind speed: {windSpeed} {windSpeedUnit}
        </Text>
      </View>
      <CustomButton
        title="Save"
        onPress={() => {
          edit();
        }}
        marginTop={20}
      />
    </View>
  );
};

const Fan = ({ device, closeEditDevice }) => {
  const [state, setState] = useState(
    device.device_state === "on" ? true : false
  );

  const [deviceName, setDeviceName] = useState(device.device_name);
  const deviceNameInputRef = useRef(null);
  const isAvailable = device.device_state === "unavailable" ? false : true;

  const turnOn = () => {
    const body = {
      entity_id: device.device_entity_id,
    };

    turnOnDevice(body, "fan", device.id);
  };

  const turnOff = () => {
    const body = {
      entity_id: device.device_entity_id,
    };

    console.log(body);

    turnOffDevice(body, "fan", device.id);
  };

  const deviceNameInputPress = () => {
    deviceNameInputRef.current.focus();
  };

  const toggleSwitch = () => {
    setState((previousState) => !previousState);
    if (state == 1) {
      turnOff();
    } else {
      turnOn();
    }
  };

  const edit = () => {
    closeEditDevice();
  };

  return (
    <View style={styles.view}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>Device type: Fan</Text>
        <FontAwesomeIcon icon={faFan} size={35} color="#FF7B00" />
      </View>
      <TouchableOpacity
        onPress={deviceNameInputPress}
        style={styles.inputDeviceField}
      >
        <FontAwesomeIcon icon={faTag} size={25} color="darkgray" />
        <TextInput
          ref={deviceNameInputRef}
          style={styles.inputText}
          placeholder="Device name"
          value={deviceName}
          onChangeText={setDeviceName}
          placeholderTextColor="darkgray"
        />
      </TouchableOpacity>
      {!isAvailable ? (
        <Text style={{ color: "red", marginTop: 10 }}>
          Device is not available
        </Text>
      ) : (
        <View style={styles.switch}>
          <Text style={styles.switchText}>{state == 1 ? "ON" : "OFF"}</Text>
          <Switch
            trackColor={{ false: "gray", true: "#FF7B00" }}
            thumbColor={state ? "#f4f3f4" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={state}
          />
        </View>
      )}
      <CustomButton
        title="Save"
        onPress={() => {
          edit();
        }}
        marginTop={20}
      />
    </View>
  );
};

const CustomDeviceComponent = ({ deviceType, device, closeEditDevice }) => {
  switch (deviceType) {
    case "light":
      return <Light device={device} closeEditDevice={closeEditDevice} />;
    case "switch":
      return <DeviceSwitch device={device} closeEditDevice={closeEditDevice} />;
    case "sensor":
      return <Sensor device={device} closeEditDevice={closeEditDevice} />;
    case "binary_sensor":
      return <BinarySensor device={device} closeEditDevice={closeEditDevice} />;
    case "weather":
      return <Weather device={device} closeEditDevice={closeEditDevice} />;
    case "fan":
      return <Fan device={device} closeEditDevice={closeEditDevice} />;
    default:
      return <Text>Device not found</Text>;
  }
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
  },
  inputDeviceField: {
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
    textAlignVertical: "top",
  },
  switch: {
    flexDirection: "row",
    width: "80%",
    marginTop: 15,
  },
  switchText: {
    fontSize: 16,
    color: "black",
    marginRight: 10,
    fontSize: 20,
    marginBottom: 10,
  },
  titleView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  titleText: {
    fontSize: 21,
    color: "black",
    marginRight: 10,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  stateText: {
    fontSize: 20,
    color: "black",
    marginTop: 50,
    fontWeight: "bold",
    textAlign: "center",
  },
  weatherInfo: {
    flex: 1,
    flexDirection: "column",
    marginTop: 50,
  },
  weatherText: {
    fontSize: 20,
    color: "black",
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomDeviceComponent;
