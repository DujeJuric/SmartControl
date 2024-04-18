import React from "react";
import { StyleSheet, View, Text } from "react-native";

const Center = () => {
  return (
    <View style={styles.container}>
      <Text>Center</Text>
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

export default Center;
