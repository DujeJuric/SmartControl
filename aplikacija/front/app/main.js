import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUser,
  faHouseSignal,
  faCircleDot,
  faHourglass,
  faTerminal,
  faHouseLaptop,
} from "@fortawesome/free-solid-svg-icons";
import CustomButton from "./customButton";
import { BASE_URL } from "../utility/url.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import Profile from "./Profile.js";
import History from "./History.js";
import Routines from "./Routines.js";
import Devices from "./Devices.js";
import Center from "./Center.js";

const Main = () => {
  url = BASE_URL;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [full_name, setFullName] = useState("");
  const [devices, setDevices] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

  const [selectedIcon, setSelectedIcon] = useState(3);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token === null) {
          router.navigate("LoginPage");
          return;
        }
        const userEmail = await AsyncStorage.getItem("email");
        setEmail(userEmail);

        const userResponse = await fetch(url + "/getUser/" + userEmail);
        if (!userResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const userData = await userResponse.json();
        setUserData(userData);
        setFullName(userData.full_name);
        setLoading(false);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    removeToken();
    router.navigate("LoginPage");
  };

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
    } catch (error) {
      console.error("Error removing user token:", error);
    }
  };

  const renderContent = () => {
    switch (selectedIcon) {
      case 1:
        return <Devices userData={userData} />;
      case 2:
        return <Routines userData={userData} />;
      case 3:
        return <Center />;
      case 4:
        return <History />;
      case 5:
        return <Profile onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "MainPage",
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
        <Text style={styles.titleText}>SmartControl</Text>
      </View>
      <View style={styles.centerView}>
        {loading ? ( // Display loading indicator if loading is true
          <ActivityIndicator size="large" color="#FF7B00" />
        ) : (
          <>{renderContent()}</>
        )}
      </View>
      <View style={styles.bottomView}>
        <TouchableOpacity
          onPress={() => setSelectedIcon(1)}
          style={styles.bottomViews}
        >
          <FontAwesomeIcon
            style={[
              styles.bottomIcons,
              selectedIcon === 1 && styles.highlightButton,
            ]}
            icon={faHouseLaptop}
            size={30}
          />
          <Text
            style={[
              styles.bottomText,
              selectedIcon === 1 && styles.highlightButton,
            ]}
          >
            Devices
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedIcon(2)}
          style={styles.bottomViews}
        >
          <FontAwesomeIcon
            style={[
              styles.bottomIcons,
              selectedIcon === 2 && styles.highlightButton,
            ]}
            icon={faTerminal}
            size={30}
          />
          <Text
            style={[
              styles.bottomText,
              selectedIcon === 2 && styles.highlightButton,
            ]}
          >
            Routines
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedIcon(3)}
          style={styles.bottomViews}
        >
          <FontAwesomeIcon
            style={[
              styles.bottomIcons,
              selectedIcon === 3 && styles.highlightButton,
            ]}
            icon={faCircleDot}
            size={50}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedIcon(4)}
          style={styles.bottomViews}
        >
          <FontAwesomeIcon
            style={[
              styles.bottomIcons,
              selectedIcon === 4 && styles.highlightButton,
            ]}
            icon={faHourglass}
            size={30}
          />
          <Text
            style={[
              styles.bottomText,
              selectedIcon === 4 && styles.highlightButton,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedIcon(5)}
          style={styles.bottomViews}
        >
          <FontAwesomeIcon
            style={[
              styles.bottomIcons,
              selectedIcon === 5 && styles.highlightButton,
            ]}
            icon={faUser}
            size={30}
          />
          <Text
            style={[
              styles.bottomText,
              selectedIcon === 5 && styles.highlightButton,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
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
    maxHeight: "15%",
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
  bottomView: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FF7B00",
    alignItems: "center",
    width: "100%",
    maxHeight: "15%",
    justifyContent: "center",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  bottomIcons: {
    paddingLeft: 60,
    color: "#fff",
  },
  titleText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },
  bottomViews: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  bottomText: {
    fontSize: 14,
    color: "#fff",
  },
  highlightButton: {
    color: "#FFF157",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1.5,
    shadowRadius: 2,
  },
});

export default Main;
