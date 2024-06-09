import React, { useEffect } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPlay,
  faClock,
  faEnvelope,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { BASE_URL } from "../utility/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set } from "lodash";

const BaseForm = () => {
  return (
    <View>
      <Text>Base Form</Text>
      <TextInput placeholder="Enter a value" />
    </View>
  );
};

const SendNotification = ({ setNewAction, action }) => {
  const mes = action.action_notification_body
    ? action.action_notification_body
    : "";
  const titl = action.action_notification_title
    ? action.action_notification_title
    : "";
  const [message, setMessage] = useState(mes);
  const [title, setTitle] = useState(titl);

  useEffect(() => {
    const newAction = {
      id: action.id,
      action_type: "send_notification",
      action_notification_title: title,
      action_notification_body: message,
    };

    setNewAction(newAction);
  }, [message, title]);

  return (
    <View style={styles.notificationView}>
      <View style={styles.titleView}>
        <FontAwesomeIcon icon={faEnvelope} style={styles.baseIcon} size={30} />
        <Text style={styles.title}>Send_notification</Text>
      </View>

      <Text style={styles.inputTextNotification}>Title</Text>
      <View style={styles.inputField}>
        <TextInput
          placeholder="Enter a title"
          onChangeText={setTitle}
          style={styles.inputText}
          value={title}
          placeholderTextColor={"darkgray"}
        />
      </View>
      <Text style={styles.inputTextNotification}>Message</Text>
      <View style={styles.inputField}>
        <TextInput
          placeholder="Enter a message"
          onChangeText={setMessage}
          style={styles.inputText}
          value={message}
          placeholderTextColor={"darkgray"}
        />
      </View>
    </View>
  );
};

const ActivateRoutine = ({ setNewAction, action }) => {
  const routId = action.action_routine_id ? action.action_routine_id : "";
  const [routineId, setRoutineId] = useState(routId);
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    const newAction = {
      id: action.id,
      action_type: "activate_routine",
      action_activate_routine_id: routineId,
    };

    setNewAction(newAction);
  }, [routineId]);

  useEffect(() => {
    const fetchRoutines = async () => {
      userId = await AsyncStorage.getItem("userId");
      try {
        const routinesResponse = await fetch(
          BASE_URL + "/getUserRoutines/" + userId
        );
        if (!routinesResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const routinesData = await routinesResponse.json();
        setRoutines(routinesData);
        setRoutineId(routinesData[0].id);
      } catch (error) {
        console.error("There was an error!", error);
      }
    };
    fetchRoutines();
  }, []);

  return (
    <View style={styles.notificationView}>
      <View style={styles.titleView}>
        <FontAwesomeIcon icon={faPlay} style={styles.baseIcon} size={30} />
        <Text style={styles.title}>Activate Routine</Text>
      </View>
      <Text style={styles.typeTextRoutine}>Select the routine:</Text>
      <View style={styles.viewPicker}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={routineId}
            style={styles.picker}
            onValueChange={(itemValue) => setRoutineId(itemValue)}
          >
            {routines.map((routine) => (
              <Picker.Item
                label={routine.routine_name}
                value={routine.id}
                key={routine.id}
              />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};

const ControlDevice = ({ setNewAction, action }) => {
  const devId = action.action_device_id ? action.action_device_id : "";
  const [deviceId, setDeviceId] = useState(devId);

  const cntrType = action.action_device_control_type
    ? action.action_device_control_type
    : "Turn on";
  const [controlType, setControlType] = useState(cntrType);

  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const newAction = {
      id: action.id,
      action_type: "control_device",
      action_device_id: deviceId,
      action_device_control_type: controlType,
    };
    setNewAction(newAction);
  }, [deviceId, controlType]);

  useEffect(() => {
    const fetchDevices = async () => {
      userId = await AsyncStorage.getItem("userId");
      try {
        const devicesResponse = await fetch(
          BASE_URL + "/getUserDevices/" + userId
        );
        if (!devicesResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const devicesData = await devicesResponse.json();
        const filteredDevices = devicesData.filter(
          (device) =>
            device.device_state == "on" || device.device_state == "off"
        );
        setDevices(filteredDevices);
        setDeviceId(filteredDevices[0].id);
      } catch (error) {
        console.error("There was an error!", error);
      }
    };
    fetchDevices();
  }, []);

  return (
    <View style={styles.controlView}>
      <View style={styles.titleView}>
        <FontAwesomeIcon icon={faWrench} style={styles.baseIcon} size={30} />
        <Text style={styles.title}>Control Device</Text>
      </View>
      <View style={styles.controlOptionView}>
        <Text style={styles.typeText}>Choose a control option: </Text>
        <View style={styles.typeValueView}>
          <TouchableOpacity
            style={
              controlType == "Turn on"
                ? styles.typeOpacitySelected
                : styles.typeOpacity
            }
            onPress={() => setControlType("Turn on")}
          >
            <Text style={styles.typeTextValue}>Turn on</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              controlType == "Turn off"
                ? styles.typeOpacitySelected
                : styles.typeOpacity
            }
            onPress={() => setControlType("Turn off")}
          >
            <Text style={styles.typeTextValue}>Turn off</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.typeText}>Select the device:</Text>
      <View style={styles.viewPicker}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={deviceId}
            style={styles.picker}
            onValueChange={(itemValue) => setDeviceId(itemValue)}
          >
            {devices.map((device) => (
              <Picker.Item
                label={device.device_name}
                value={device.id}
                key={device.id}
              />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};

const CustomActionForm = ({ type, setNewAction, action }) => {
  switch (type) {
    case "base":
      return <BaseForm />;
    case "send_notification":
      return <SendNotification setNewAction={setNewAction} action={action} />;
    case "activate_routine":
      return <ActivateRoutine setNewAction={setNewAction} action={action} />;
    case "control_device":
      return <ControlDevice setNewAction={setNewAction} action={action} />;
    default:
      return null;
  }
};

const styles = StyleSheet.create({
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

    marginBottom: 10,
  },
  locationView: {
    flex: 1,
    justifyContent: "center",
  },
  notificationView: {
    marginTop: 150,
    flex: 1,
  },
  controlView: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
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
  inputTextNotification: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginTop: 10,
    marginLeft: "10%",
  },
  typeText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  typeTextRoutine: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
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
  controlOptionView: {
    marginVertical: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
  picker: {
    width: 250,
  },
});

export default CustomActionForm;
