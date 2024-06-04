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
  faCirclePlus,
  faClock,
  faGear,
  faLocationDot,
  faTemperatureThreeQuarters,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

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

  useEffect(() => {
    const newAction = {
      id: action.id,
      action_type: "activate_routine",
      action_activate_routine_id: routineId,
    };

    setNewAction(newAction);
  }, [routineId]);

  return (
    <View style={styles.notificationViewView}>
      <View style={styles.titleView}>
        <FontAwesomeIcon icon={faClock} style={styles.baseIcon} size={30} />
        <Text style={styles.title}>Activate Routine</Text>
      </View>

      <View style={styles.inputField}>
        <TextInput
          placeholder="Enter a routine id"
          onChangeText={setRoutineId}
          style={styles.inputText}
          value={routineId}
          placeholderTextColor={"darkgray"}
        />
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
});

export default CustomActionForm;
