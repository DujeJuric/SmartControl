import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { useState } from "react";
import { BASE_URL } from "../utility/url.js";
import { ActivityIndicator } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faRotateForward } from "@fortawesome/free-solid-svg-icons";

const History = ({ userData }) => {
  const [loading, setLoading] = useState(true);
  const [historyLogs, setHistoryLogs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const url = BASE_URL;
    try {
      const historyResponse = await fetch(
        url + "/getUserHistoryLogs/" + userData.id
      );
      if (!historyResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const historyData = await historyResponse.json();
      setHistoryLogs(historyData);
      setLoading(false);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF7B00" />
      ) : (
        <View style={styles.mainView}>
          <Text style={styles.title}>Logs</Text>
          <View style={styles.logList}>
            <ScrollView
              showsVerticalScrollIndicator={true}
              indicatorStyle="black"
            >
              {historyLogs.length === 0 ? (
                <Text style={styles.logInfo}>No logs found</Text>
              ) : (
                historyLogs.map((log) => (
                  <View style={styles.logs} key={log.id}>
                    <Text style={styles.logText}>{log.log_text}</Text>
                    <Text style={styles.logDate}>{log.log_date}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      )}
      <View style={styles.refreshView}>
        <TouchableOpacity onPress={fetchData}>
          <FontAwesomeIcon icon={faRotateForward} size={30} color="white" />
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
  logList: {
    width: "fit-content",
    height: "70%",
    backgroundColor: "#FF7B00",
    borderColor: "black",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    color: "black",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 30,
  },
  mainView: {
    flex: 1,
    width: "90%",
    alignItems: "center",
  },
  logText: {
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 1,
    padding: 5,
    margin: 5,
    fontSize: 10,
    maxWidth: 200,
    paddingRight: "10%",
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  logDate: {
    fontSize: 12,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
  logs: {
    flexDirection: "column",
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
  refreshView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#FF7B00",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 50,
    padding: 15,
  },
});

export default History;
