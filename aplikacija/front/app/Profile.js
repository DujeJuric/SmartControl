import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import CustomButton from "./customButton";

const Profile = ({ onLogout }) => {
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <CustomButton onPress={onLogout} title="Logout" />
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

export default Profile;
