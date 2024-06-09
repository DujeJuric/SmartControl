import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import CustomButton from "./customButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { BASE_URL } from "../utility/url";

const Profile = ({ onLogout, userData }) => {
  const [email, setEmail] = useState(userData.email);
  const [fullName, setFullName] = useState(userData.full_name);
  const emailInputRef = useRef(null);
  const fullNameInputRef = useRef(null);

  const emailInputPress = () => {
    emailInputRef.current.focus();
  };

  const fullNameInputPress = () => {
    fullNameInputRef.current.focus();
  };

  const editProfile = () => {
    const url = BASE_URL;
    fetch(url + "/updateUser/" + userData.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        full_name: fullName,
        password: "",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert("Profile updated successfully");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileView}>
        <Text style={styles.title}>Edit profile</Text>
        <TouchableOpacity style={styles.inputField} onPress={emailInputPress}>
          <FontAwesomeIcon icon={faEnvelope} size={25} color="darkgray" />
          <TextInput
            ref={emailInputRef}
            style={styles.inputText}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="darkgray"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.inputField}
          onPress={fullNameInputPress}
        >
          <FontAwesomeIcon icon={faUser} size={25} color="darkgray" />
          <TextInput
            ref={fullNameInputRef}
            style={styles.inputText}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor="darkgray"
          />
        </TouchableOpacity>
        <CustomButton onPress={editProfile} title="Save" marginTop={20} />
        <CustomButton onPress={onLogout} title="Logout" marginTop={80} />
      </View>
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
  profileView: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    width: "80%",
    justifyContent: "center",
    paddingVertical: "55%",
  },
  title: {
    fontSize: 28,
    color: "#FF7B00",
    fontWeight: "bold",
    shadowColor: "black",
    shadowOffset: { width: -1, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    marginTop: 20,
  },

  inputField: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    height: "35%",
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
});

export default Profile;
