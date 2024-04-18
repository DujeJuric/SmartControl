import { React, useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import CustomButton from "./customButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUser,
  faHouseSignal,
  faEnvelope,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import { showAlert } from "../utility/customAlert.js";
import { BASE_URL } from "../utility/url.js";

const RegistrationPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const emailInputRef = useRef(null);
  const fullNameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  useEffect(() => {}, []);

  const handleRegister = () => {
    if (
      email === "" ||
      fullName === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      showAlert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Error", "Passwords do not match. Please try again.");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    fetch(BASE_URL + "/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        full_name: fullName,
        password: password,
      }),
    })
      .then((response) => {
        if (response.status === 400) {
          showAlert("Error", "User already exists. Please try again.");
        }

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        showAlert("Success", "User registered successfully. Please log in.");
      })
      .catch((error) => {});
    router.navigate("LoginPage");
    setEmail("");
    setFullName("");
    setPassword("");
    setConfirmPassword("");
  };

  const emailInputPress = () => {
    emailInputRef.current.focus();
  };
  const fullNameInputPress = () => {
    fullNameInputRef.current.focus();
  };
  const passwordInputPress = () => {
    passwordInputRef.current.focus();
  };
  const confirmPasswordInputPress = () => {
    confirmPasswordInputRef.current.focus();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "SmartControl",
          headerStyle: {
            backgroundColor: "#FF7B00",
            height: "20%",
            border: "5px solid black",
          },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 25,
            color: "black",
          },
          headerShown: false,
          headerRight: () => (
            <FontAwesomeIcon
              icon={faUser}
              style={{ color: "white" }}
              size={30}
            />
          ),
        }}
      />

      <View style={styles.titleView}>
        <FontAwesomeIcon icon={faHouseSignal} size={50} color="white" />
        <Text style={styles.titleText}>Welcome to SmartControl.</Text>
      </View>
      <View style={styles.centerView}>
        <Text style={styles.infoText}>Please register to continue:</Text>
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
        <TouchableOpacity
          style={styles.inputField}
          onPress={passwordInputPress}
        >
          <FontAwesomeIcon icon={faKey} size={25} color="darkgray" />
          <TextInput
            ref={passwordInputRef}
            style={styles.inputText}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="darkgray"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.inputField}
          onPress={confirmPasswordInputPress}
        >
          <FontAwesomeIcon icon={faKey} size={25} color="darkgray" />
          <TextInput
            ref={confirmPasswordInputRef}
            style={styles.inputText}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="darkgray"
          />
        </TouchableOpacity>
        <CustomButton
          marginTop="20%"
          onPress={handleRegister}
          title="REGISTER"
        />
      </View>
      <View style={styles.bottomView}>
        <Text style={styles.bottomText}>Already have an account?</Text>
        <Text
          onPress={() => {
            router.navigate("LoginPage");
            setEmail("");
            setFullName("");
            setPassword("");
            setConfirmPassword("");
          }}
          style={styles.registerButton}
        >
          Login
        </Text>
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

  titleView: {
    flex: 1,
    backgroundColor: "#FF7B00",
    alignItems: "center",
    width: "100%",
    maxHeight: "fit-content",
    justifyContent: "center",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingTop: 10,
  },
  centerView: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    paddingVertical: "40%",
  },
  infoText: {
    fontSize: 20,
    color: "#FF7B00",
    fontWeight: "bold",
    shadowColor: "black",
    shadowOffset: { width: -1, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  bottomView: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FF7B00",
    alignItems: "center",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingVertical: 0,
  },
  titleText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  bottomText: {
    fontSize: 20,
    color: "#fff",
    marginRight: 0,
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
  registerButton: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textDecorationLine: "underline",
    shadowOpacity: 0.4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
});

export default RegistrationPage;
