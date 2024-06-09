import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { getDevices } from "./HomeAssitantService";
import { useState } from "react";
import { BASE_URL } from "../utility/url.js";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCirclePlay,
  faCaretLeft,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { ActivityIndicator } from "react-native";
import { isEqual } from "lodash";

const Center = ({ userData }) => {
  const [storedDevices, setStoredDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routineLoading, setRoutineLoading] = useState(true);
  const url = BASE_URL;
  const [routines, setRoutines] = useState([]);
  const [routine, setRoutine] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(
    () => {
      getStoredDevices();
      const fetchRoutineData = async () => {
        setRoutineLoading(true);
        try {
          const routinesResponse = await fetch(
            url + "/getUserRoutines/" + userData.id
          );
          if (!routinesResponse.ok) {
            throw new Error("Network response was not ok");
          }
          const routinesData = await routinesResponse.json();
          const manualRoutines = [];

          const conditionsResponse = await fetch(url + "/getConditions");
          if (!conditionsResponse.ok) {
            throw new Error("Network response was not ok");
          }
          const conditionsData = await conditionsResponse.json();

          routinesData.forEach((routine) => {
            routineConditions = conditionsData.filter(
              (condition) => condition.condition_routine_id === routine.id
            );

            routineConditions.forEach((condition) => {
              if (condition.condition_type === "manual") {
                manualRoutines.push(routine);
              }
            });
          });

          setRoutines(manualRoutines);
          setRoutine(manualRoutines[0]);
          setCurrentIndex(0);
          setRoutineLoading(false);
        } catch (error) {
          console.error("There was an error!", error);
        }
      };
      fetchRoutineData();
    },
    [addDevices],
    []
  );

  const fetchData = async () => {
    try {
      const devicesData = await getDevices();
      addDevices(devicesData);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const getStoredDevices = async () => {
    setLoading(true);
    const url = BASE_URL;
    userId = userData.id;
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
      setStoredDevices(devicesData);
    } catch (error) {
      console.error("There was an error!", error);
    }
    setLoading(false);
  };

  const addDevices = async (devices) => {
    const storedEntityIds = storedDevices.map(
      (device) => device.device_entity_id
    );

    const presentEntityIds = [];

    setLoading(true);

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
        device_user_id: userData.id,
      };

      if (!storedEntityIds.includes(body.device_entity_id)) {
        console.log("Adding device to database " + body.device_name);
        presentEntityIds.push(body.device_entity_id);
        try {
          const response = await fetch(url + "/addDevice", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          setStoredDevices([...storedDevices, response]);
        } catch (error) {
          console.error("There was an error!", error);
        }
      } else {
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

    getStoredDevices();
    setLoading(false);
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

  const moveRoutineLeft = () => {
    if (currentIndex === 0) {
      setCurrentIndex(routines.length - 1);
      setRoutine(routines[routines.length - 1]);
    } else {
      setCurrentIndex(currentIndex - 1);
      setRoutine(routines[currentIndex - 1]);
    }
  };

  const moveRoutineRight = () => {
    if (currentIndex === routines.length - 1) {
      setCurrentIndex(0);
      setRoutine(routines[0]);
    } else {
      setCurrentIndex(currentIndex + 1);
      setRoutine(routines[currentIndex + 1]);
    }
  };

  const activateRoutine = async () => {
    const url = BASE_URL;

    try {
      const response = await fetch(url + "/activateRoutine/" + routine.id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          routine_id: routine.id,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../images/MicrosoftTeams-image.png")}
      />
      <TouchableOpacity onPress={() => fetchData()}>
        <View style={styles.buttonView}>
          <Text style={styles.buttonText}>Connect to Home Assistant</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.runText}>Run your manual routines</Text>
      <View style={styles.bottomView}>
        <TouchableOpacity onPress={() => moveRoutineLeft()}>
          <FontAwesomeIcon
            icon={faCaretLeft}
            size={60}
            style={styles.leftRightIcons}
          />
        </TouchableOpacity>
        <View style={styles.routineList}>
          {routineLoading ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={true}
              indicatorStyle="black"
            >
              {routines.length === 0 ? (
                <Text style={styles.routineInfo}>
                  There are no manual routines.
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    activateRoutine();
                  }}
                >
                  <View style={styles.routines}>
                    <Text style={styles.routineText}>
                      {routine.routine_name}
                    </Text>
                    <FontAwesomeIcon
                      icon={faCirclePlay}
                      size={20}
                      style={styles.routineIcons}
                    />
                  </View>
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
        </View>
        <TouchableOpacity onPress={() => moveRoutineRight()}>
          <FontAwesomeIcon
            icon={faCaretRight}
            style={styles.leftRightIcons}
            size={60}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    backgroundColor: "white",
    height: "fit-content",
    marginTop: 20,
  },
  buttonView: {
    backgroundColor: "#FF7B00",
    padding: 40,
    borderRadius: 50,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  routineList: {
    width: "65%",
    height: "80%",
    backgroundColor: "#FF7B00",
    borderColor: "black",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    color: "black",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
    borderRadius: 30,
  },
  runText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
  },
  routineInfo: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
  routines: {
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
  routineText: {
    fontSize: 15,
    maxWidth: 200,
    paddingRight: "10%",
    color: "black",
    fontWeight: "bold",
  },
  routineIcons: {
    color: "limegreen",
  },
  bottomView: {
    flexDirection: "row",
  },
  leftRightIcons: {
    marginTop: 6,
  },
  image: {
    width: 150,
    height: 120,
    marginBottom: 30,
    resizeMode: "contain",
  },
});

export default Center;
