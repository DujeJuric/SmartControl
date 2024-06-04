import React, { useEffect } from "react";
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
  faGear,
  faLocationDot,
  faTemperatureThreeQuarters,
} from "@fortawesome/free-solid-svg-icons";

const BaseComponent = () => {
  return (
    <View style={styles.view}>
      <Text>Add a condition</Text>
      <FontAwesomeIcon icon={faCirclePlus} style={styles.baseIcon} size={20} />
    </View>
  );
};

const TimeComponent = ({
  condition,
  setNewCondition,
  openFormModal,
  setIsConditionEdit,
  manualRoutine,
}) => {
  const edit = () => {
    console.log("Edit Time", condition);
    setNewCondition(condition);
    setIsConditionEdit(true);
    openFormModal();
  };
  return (
    <View>
      <TouchableOpacity onPress={edit} disabled={manualRoutine}>
        <View style={!manualRoutine ? styles.view : styles.viewManual}>
          <View style={styles.titleView}>
            <FontAwesomeIcon icon={faClock} style={styles.baseIcon} size={20} />
            <Text style={styles.titleText}>Time</Text>
          </View>

          <FontAwesomeIcon icon={faGear} size={20} style={styles.editIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const LocationComponent = ({
  condition,
  setNewCondition,
  openFormModal,
  setIsConditionEdit,
  manualRoutine,
}) => {
  const edit = () => {
    console.log(manualRoutine);
    setNewCondition(condition);
    setIsConditionEdit(true);
    openFormModal();
  };

  return (
    <View>
      <TouchableOpacity onPress={edit} disabled={manualRoutine}>
        <View style={!manualRoutine ? styles.view : styles.viewManual}>
          <View style={styles.titleView}>
            <FontAwesomeIcon
              icon={faLocationDot}
              style={styles.baseIcon}
              size={20}
            />
            <Text style={styles.titleText}>Location </Text>
          </View>
          <FontAwesomeIcon icon={faGear} size={20} style={styles.editIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const WeatherComponent = () => {
  return (
    <View>
      <Text>Weather Component</Text>
    </View>
  );
};

const TemperatureComponent = ({
  condition,
  setNewCondition,
  openFormModal,
  setIsConditionEdit,
  manualRoutine,
}) => {
  const edit = () => {
    console.log(manualRoutine);
    setNewCondition(condition);
    setIsConditionEdit(true);
    openFormModal();
  };

  return (
    <View>
      <TouchableOpacity onPress={edit} disabled={manualRoutine}>
        <View style={!manualRoutine ? styles.view : styles.viewManual}>
          <View style={styles.titleView}>
            <FontAwesomeIcon
              icon={faTemperatureThreeQuarters}
              style={styles.baseIcon}
              size={20}
            />
            <Text style={styles.titleText}>Temperature </Text>
          </View>
          <FontAwesomeIcon icon={faGear} size={20} style={styles.editIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const CustomConditionComponent = ({
  type,
  condition,
  setNewCondition,
  openFormModal,
  setIsConditionEdit,
  manualRoutine,
}) => {
  switch (type) {
    case "base":
      return <BaseComponent />;
    case "time":
      return (
        <TimeComponent
          condition={condition}
          setNewCondition={setNewCondition}
          openFormModal={openFormModal}
          setIsConditionEdit={setIsConditionEdit}
          manualRoutine={manualRoutine}
        />
      );
    case "location":
      return (
        <LocationComponent
          condition={condition}
          setNewCondition={setNewCondition}
          openFormModal={openFormModal}
          setIsConditionEdit={setIsConditionEdit}
          manualRoutine={manualRoutine}
        />
      );
    case "weather":
      return <WeatherComponent />;
    case "temperature":
      return (
        <TemperatureComponent
          condition={condition}
          setNewCondition={setNewCondition}
          openFormModal={openFormModal}
          setIsConditionEdit={setIsConditionEdit}
          manualRoutine={manualRoutine}
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
  viewManual: {
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
    opacity: 0.5,
  },
  baseIcon: {
    color: "#FF7B00",
  },
  editIcon: {
    color: "darkgray",
    marginLeft: 100,
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

export default CustomConditionComponent;
