import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { BASE_URL } from "../utility/url.js";
import { useEffect } from "react";

const Routines = ({ userData }) => {
  const [loading, setLoading] = useState(true);
  const [routines, setRoutines] = useState([]);
  const url = BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const routinesResponse = await fetch(
          url + "/getUserRoutines/" + userData.id
        );
        if (!routinesResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const routinesData = await routinesResponse.json();
        setRoutines(routinesData);
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
          <Text>Your routines:</Text>
          {routines.map((routine) => (
            <View key={routine.id}>
              <Text>{routine.routine_name}</Text>
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

export default Routines;
