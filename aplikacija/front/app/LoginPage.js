import { React, useState, useContext, useEffect, useRef } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../utility/url.js";
import { showAlert } from "../utility/customAlert.js";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {}, []);

  const handleLogin = () => {
    if (email === "" || password === "") {
      showAlert("Error", "Please fill in all fields.");
      return;
    }

    fetch(BASE_URL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        full_name: "",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        storeData(data.token);
      })
      .catch((error) => {
        showAlert("Error", "Invalid email or password. Please try again.");
        setEmail("");
        setPassword("");
      });
  };

  const storeData = async (token) => {
    try {
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("email", email);
      router.navigate("main");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error saving user token:", error);
    }
  };

  const emailInputPress = () => {
    emailInputRef.current.focus();
  };
  const passwordInputPress = () => {
    passwordInputRef.current.focus();
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
        <Text style={styles.infoText}>Please login to continue:</Text>
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
          onPress={passwordInputPress}
        >
          <FontAwesomeIcon icon={faKey} size={25} color="darkgray" />
          <TextInput
            ref={passwordInputRef}
            style={styles.inputText}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="darkgray"
          />
        </TouchableOpacity>
        <CustomButton marginTop="20%" onPress={handleLogin} title="LOGIN" />
      </View>
      <View style={styles.bottomView}>
        <Text style={styles.bottomText}>Don't have an account?</Text>
        <Text
          onPress={() => {
            router.navigate("RegistrationPage");

            setEmail("");
            setPassword("");
          }}
          style={styles.registerButton}
        >
          Register
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

export default LoginPage;
