import React from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCirclePlus,
  faClock,
  faEnvelope,
  faPlay,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

const BaseComponent = () => {
  return (
    <View style={styles.view}>
      <Text>Add a condition</Text>
      <FontAwesomeIcon icon={faCirclePlus} style={styles.baseIcon} size={20} />
    </View>
  );
};

const SendNotification = ({
  action,
  setNewAction,
  openFormModal,
  setIsActionEdit,
  setIsActionForm,
}) => {
  const edit = () => {
    setNewAction(action);
    setIsActionForm(true);
    setIsActionEdit(true);
    openFormModal();
  };
  return (
    <View>
      <TouchableOpacity onPress={edit}>
        <View style={styles.view}>
          <View style={styles.titleView}>
            <FontAwesomeIcon
              icon={faEnvelope}
              style={styles.baseIcon}
              size={20}
            />
            <Text style={styles.titleText}>Send_notification </Text>
          </View>
          <FontAwesomeIcon icon={faGear} size={20} style={styles.editIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const ActivateRoutine = ({
  action,
  setNewAction,
  openFormModal,
  setIsActionEdit,
  setIsActionForm,
}) => {
  const edit = () => {
    setNewAction(action);
    setIsActionEdit(true);
    setIsActionForm(true);
    openFormModal();
  };
  return (
    <View>
      <TouchableOpacity onPress={edit}>
        <View style={styles.view}>
          <View style={styles.titleView}>
            <FontAwesomeIcon icon={faPlay} style={styles.baseIcon} size={20} />
            <Text style={styles.titleText}>Activate_routine</Text>
          </View>
          <FontAwesomeIcon icon={faGear} size={20} style={styles.editIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const CustomActionComponent = ({
  type,
  action,
  setNewAction,
  openFormModal,
  setIsActionEdit,
  setIsActionForm,
}) => {
  switch (type) {
    case "base":
      return <BaseComponent />;
    case "send_notification":
      return (
        <SendNotification
          action={action}
          setNewAction={setNewAction}
          openFormModal={openFormModal}
          setIsActionEdit={setIsActionEdit}
          setIsActionForm={setIsActionForm}
        />
      );
    case "activate_routine":
      return (
        <ActivateRoutine
          action={action}
          setNewAction={setNewAction}
          openFormModal={openFormModal}
          setIsActionEdit={setIsActionEdit}
          setIsActionForm={setIsActionForm}
        />
      );
    default:
      return <Text>Invalid Component</Text>;
  }
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
    borderColor: "white",
    borderWidth: 1,
    margin: 10,

    padding: 5,
    borderRadius: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    backgroundColor: "white",

    height: 50,
  },

  baseIcon: {
    color: "#FF7B00",
  },
  editIcon: {
    color: "darkgray",
    marginLeft: 60,
  },
  titleView: {
    flexDirection: "row",
  },
  titleText: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default CustomActionComponent;
