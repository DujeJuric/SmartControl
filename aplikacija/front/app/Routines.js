import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  Switch,
  Modal,
  Button,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState, useRef } from "react";
import { ActivityIndicator } from "react-native";
import { BASE_URL } from "../utility/url.js";
import { useEffect } from "react";
import CustomButton from "./customButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGear, faTag, faPlus } from "@fortawesome/free-solid-svg-icons";
import CustomConditionComponent from "./CustomConditionComponent.js";
import CustomConditionForm from "./CustomConditionForm.js";
import CustomActionComponent from "./CustomActionComponent.js";
import CustomActionForm from "./CustomActionForm.js";
import { Picker } from "@react-native-picker/picker";

const Routines = ({ userData }) => {
  const options = ["Time", "Location", "Temperature"];
  const actionsOptions = ["Activate_routine", "Send_notification"];
  const [alreadyAddedOptions, setAlreadyAddedOptions] = useState([]);
  const [alreadyAddedActionOptions, setAlreadyAddedActionOptions] = useState(
    []
  );
  const [isActionAddActitve, setIsActionAddActitve] = useState(false);
  const [isAlreadyAdded, setIsAlreadyAdded] = useState(false);
  const [isAlreadyAddedAction, setIsAlreadyAddedAction] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingRoutine, setLoadingRoutine] = useState(false);
  const [routines, setRoutines] = useState([]);
  const url = BASE_URL;
  const [routineId, setRoutineId] = useState("");
  const [isNewRoutineModalVisible, setIsNewRoutineModalVisible] =
    useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isInputFormVisible, setIsInputFormVisible] = useState(false);
  const [isAddRoutineModalVisible, setIsAddRoutineModalVisible] =
    useState(false);
  const [editRoutine, setEditRoutine] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isConditionEdit, setIsConditionEdit] = useState(false);
  const [isActionEdit, setIsActionEdit] = useState(false);
  const [isActionForm, setIsActionForm] = useState(false);
  const [actions, setActions] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [routineName, setRoutineName] = useState("");
  const [selectedOption, setSelectedOption] = useState("Time");
  const [selectedActionOption, setSelectedActionOption] =
    useState("Activate_routine");
  const routineNameInputRef = useRef(null);
  const [manualRoutine, setManualRoutine] = useState(false);
  const [manualId, setManualId] = useState("0");
  const [newCondition, setNewCondition] = useState({});
  const [newAction, setNewAction] = useState({});

  const toggleSwitch = () => {
    console.log(manualId);
    setManualRoutine((previousState) => !previousState);
    if (!manualRoutine) {
      addCondition({
        condition_type: "manual",
        condition_routine_id: routineId,
        condition_manual: true,
        condition_true: false,
      });
    } else {
      setNewCondition({ id: manualId });
      deleteCondition();
      setManualId("0");
    }
  };

  const routineNameInputPress = () => {
    routineNameInputRef.current.focus();
  };

  const addRoutine = () => {
    setIsAddRoutineModalVisible(true);
  };

  const addRoutineName = async () => {
    setLoadingRoutine(true);
    try {
      const response = await fetch(url + "/addRoutine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          routine_name: routineName,
          routine_user_id: userData.id,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setRoutines([...routines, data]);
      setLoadingRoutine(false);
      setIsAddRoutineModalVisible(false);
      openEditRoutine(data);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const cancelAddPress = () => {
    setIsAddRoutineModalVisible(false);
    setRoutineName("");
  };

  const openEditRoutine = async (routine) => {
    setRoutineId(routine.id);
    setIsNewRoutineModalVisible(true);
    setLoadingRoutine(true);
    setIsEdit(true);
    setEditRoutine(routine);
    setRoutineName(routine.routine_name);
    await fetchConditionsAndActions(routine.id);
    setLoadingRoutine(false);
  };

  const openFormModal = () => {
    setSelectedActionOption("Activate_routine");
    if (alreadyAddedActionOptions.includes("activate_routine")) {
      setIsAlreadyAddedAction(true);
    } else {
      setIsAlreadyAddedAction(false);
    }

    setSelectedOption("Time");
    if (alreadyAddedOptions.includes("time")) {
      setIsAlreadyAdded(true);
    } else {
      setIsAlreadyAdded(false);
    }

    setNewCondition({});
    setNewAction({});
    setIsFormModalVisible(true);
  };

  const openInputForm = () => {
    if (isActionAddActitve) {
      setIsActionForm(true);
    }
    setIsFormModalVisible(true);
    setIsInputFormVisible(true);
  };

  const handleOptionChange = (itemValue) => {
    setSelectedOption(itemValue);
    if (alreadyAddedOptions.includes(itemValue.toLowerCase())) {
      setIsAlreadyAdded(true);
    } else {
      setIsAlreadyAdded(false);
    }
  };

  const handeActionOptionChange = (itemValue) => {
    setSelectedActionOption(itemValue);
    if (alreadyAddedActionOptions.includes(itemValue.toLowerCase())) {
      setIsAlreadyAddedAction(true);
    } else {
      setIsAlreadyAddedAction(false);
    }
  };

  const updateRoutine = async () => {
    setLoadingRoutine(true);
    try {
      const response = await fetch(url + "/updateRoutine/" + routineId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          routine_name: routineName,
          routine_user_id: userData.id,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const updatedRoutines = routines.map((routine) => {
        if (routine.id === data.id) {
          return data;
        }
        return routine;
      });
      setRoutines(updatedRoutines);
    } catch (error) {
      console.error("There was an error!", error);
    }
    setLoadingRoutine(false);
  };

  const updateConditions = () => {
    newCondition.condition_routine_id = routineId;
    if (isConditionEdit) {
      editContition(newCondition);
    } else {
      addCondition(newCondition);
    }
    setIsFormModalVisible(false);
    setIsInputFormVisible(false);
    setNewCondition({});
    setIsConditionEdit(false);
  };

  const cancelPress = () => {
    setIsFormModalVisible(false);
    setIsInputFormVisible(false);
    setNewCondition({});
    setNewAction({});
    setIsConditionEdit(false);
    setIsActionEdit(false);
    setIsActionForm(false);
    setIsActionAddActitve(false);
  };

  const updateActions = () => {
    newAction.action_routine_id = routineId;
    if (isActionEdit) {
      editAction(newAction);
    } else {
      addAction(newAction);
    }
    setIsFormModalVisible(false);
    setIsInputFormVisible(false);
    setNewAction({});
    setIsActionEdit(false);
    setIsActionForm(false);
    setIsActionAddActitve(false);
  };

  const deleteCondition = async () => {
    setLoadingRoutine(true);
    const id = newCondition.id ? newCondition.id : manualId;
    try {
      const response = await fetch(url + "/deleteCondition/" + id, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const updatedConditions = conditions.filter(
        (condition) => condition.id !== data.id
      );
      setConditions(updatedConditions);
      const updatedOptions = alreadyAddedOptions.filter(
        (option) => option !== data.condition_type
      );
      setAlreadyAddedOptions(updatedOptions);
    } catch (error) {
      console.error("There was an error!", error);
    }
    setLoadingRoutine(false);
    setIsFormModalVisible(false);
    setIsInputFormVisible(false);
    setNewCondition({});
    setIsConditionEdit(false);
  };

  const deleteAction = async () => {
    setLoadingRoutine(true);

    const id = newAction.id;
    try {
      const response = await fetch(url + "/deleteAction/" + id, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const updatedActions = actions.filter((action) => action.id !== data.id);
      setActions(updatedActions);
      const updatedOptions = alreadyAddedActionOptions.filter(
        (option) => option !== data.action_type
      );
      setAlreadyAddedActionOptions(updatedOptions);
    } catch (error) {
      console.error("There was an error!", error);
    }
    setIsActionForm(false);
    setLoadingRoutine(false);
    setIsFormModalVisible(false);
    setIsInputFormVisible(false);
    setNewAction({});
    setIsActionEdit(false);
    setIsActionAddActitve(false);
  };

  const deleteRoutine = async (routineId) => {
    setLoadingRoutine(true);
    try {
      const response = await fetch(url + "/deleteRoutine/" + routineId, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const updatedRoutines = routines.filter(
        (routine) => routine.id !== data.id
      );
      setRoutines(updatedRoutines);
    } catch (error) {
      console.error("There was an error!", error);
    }
    setLoadingRoutine(false);
    setIsNewRoutineModalVisible(false);
    setRoutineName("");
    setConditions([]);
    setActions([]);
    setIsEdit(false);
    setManualRoutine(false);
  };

  useEffect(() => {
    setManualId(0);
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

  const fetchConditionsAndActions = async (routineId) => {
    try {
      const conditionsResponse = await fetch(
        url + "/getRoutineConditions/" + routineId
      );
      if (!conditionsResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const conditionsData = await conditionsResponse.json();
      const types = conditionsData.map((condition) => condition.condition_type);
      setAlreadyAddedOptions(types);
      conditionsData.forEach((condition) => {
        if (condition.condition_type === "manual") {
          setManualRoutine(true);
          setManualId(condition.id);

          conditionsData.splice(conditionsData.indexOf(condition), 1);
        }
      });
      setConditions(conditionsData);

      const actionsResponse = await fetch(
        url + "/getRoutineActions/" + routineId
      );
      if (!actionsResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const actionsData = await actionsResponse.json();
      const actionTypes = actionsData.map((action) => action.action_type);
      setAlreadyAddedActionOptions(actionTypes);
      setActions(actionsData);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const addCondition = async (condition) => {
    setLoadingRoutine(true);
    setAlreadyAddedOptions([...alreadyAddedOptions, condition.condition_type]);
    try {
      const response = await fetch(url + "/addCondition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(condition),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.condition_type !== "manual")
        setConditions([...conditions, data]);
      else {
        console.log("Manual condition added");
        setManualId(data.id);
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
    setLoadingRoutine(false);
  };

  const editContition = async (condition) => {
    setLoadingRoutine(true);
    try {
      const response = await fetch(url + "/updateCondition/" + condition.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(condition),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const updatedConditions = conditions.map((condition) => {
        if (condition.id === data.id) {
          return data;
        }
        return condition;
      });
      setConditions(updatedConditions);
    } catch (error) {
      console.error("There was an error!", error);
    }
    setLoadingRoutine(false);
  };

  const addAction = async (action) => {
    console.log(action);
    setLoadingRoutine(true);
    setAlreadyAddedActionOptions([
      ...alreadyAddedActionOptions,
      action.action_type,
    ]);
    try {
      const response = await fetch(url + "/addAction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setActions([...actions, data]);
    } catch (error) {
      console.error("There was an error!", error);
    }
    setLoadingRoutine(false);
  };

  const editAction = async (action) => {
    setLoadingRoutine(true);
    try {
      const response = await fetch(url + "/updateAction/" + action.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const updatedActions = actions.map((action) => {
        if (action.id === data.id) {
          return data;
        }
        return action;
      });
      setActions(updatedActions);
    } catch (error) {
      console.error("There was an error!", error);
    }
    setLoadingRoutine(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF7B00" />
      ) : (
        <View style={styles.mainView}>
          <Text style={styles.title}>Routines</Text>
          <View style={styles.routineList}>
            <ScrollView
              showsVerticalScrollIndicator={true}
              indicatorStyle="black"
            >
              {routines.length === 0 ? (
                <Text style={styles.routineInfo}>
                  There are no routines added.
                </Text>
              ) : (
                routines.map((routine) => (
                  <TouchableOpacity
                    key={routine.id}
                    onPress={() => openEditRoutine(routine)}
                  >
                    <View style={styles.routines}>
                      <Text style={styles.routineText}>
                        {routine.routine_name}
                      </Text>
                      <FontAwesomeIcon
                        icon={faGear}
                        size={20}
                        style={styles.routineIcons}
                      />
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
          <CustomButton onPress={addRoutine} title="Create a new routine" />

          <Modal
            visible={isNewRoutineModalVisible}
            onRequestClose={() => setIsNewRoutineModalVisible(false)}
            animationType="slide"
            presentationStyle="fullScreen"
          >
            <ScrollView
              showsVerticalScrollIndicator={true}
              indicatorStyle="black"
            >
              <View style={styles.newRoutineViewBackground}>
                {loadingRoutine ? (
                  <View>
                    <ActivityIndicator
                      size="large"
                      color="#FF7B00"
                      style={{ marginTop: 300 }}
                    />
                    <Button
                      title="Cancel"
                      onPress={() => {
                        setIsNewRoutineModalVisible(false);
                        setRoutineName("");
                        setConditions([]);
                        setActions([]);
                        setIsEdit(false);
                        setManualRoutine(false);
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.newRoutineView}>
                    <TouchableOpacity
                      onPress={routineNameInputPress}
                      style={styles.inputField}
                    >
                      <FontAwesomeIcon
                        icon={faTag}
                        size={25}
                        color="darkgray"
                      />
                      <TextInput
                        ref={routineNameInputRef}
                        style={styles.inputText}
                        placeholder="Routine Name"
                        value={routineName}
                        onChangeText={setRoutineName}
                        placeholderTextColor="darkgray"
                      />
                    </TouchableOpacity>

                    <View style={styles.switch}>
                      <Text style={styles.switchText}>Manual Routine</Text>
                      <Switch
                        trackColor={{ false: "gray", true: "#FF7B00" }}
                        thumbColor={manualRoutine ? "#f4f3f4" : "#f4f3f4"}
                        onValueChange={toggleSwitch}
                        value={manualRoutine}
                      />
                    </View>
                    <Text
                      style={
                        !manualRoutine
                          ? styles.titleText
                          : styles.titleTextManual
                      }
                    >
                      Conditions
                    </Text>
                    <TouchableOpacity
                      style={
                        !manualRoutine
                          ? styles.addButton
                          : styles.addButtonManual
                      }
                      onPress={() => {
                        setIsActionAddActitve(false), openFormModal();
                      }}
                      disabled={manualRoutine}
                    >
                      <FontAwesomeIcon icon={faPlus} size={20} />
                      <Text>Add condition</Text>
                    </TouchableOpacity>
                    <View
                      style={
                        !manualRoutine
                          ? styles.conditionsView
                          : styles.conditionsViewManual
                      }
                    >
                      <ScrollView
                        showsVerticalScrollIndicator={true}
                        indicatorStyle="black"
                      >
                        {conditions.length === 0 ? (
                          <Text style={styles.infoText}>
                            There are no added conditions.
                          </Text>
                        ) : (
                          conditions.map(
                            (condition) =>
                              condition.condition_type !== "manual" && (
                                <CustomConditionComponent
                                  key={condition.id}
                                  type={condition.condition_type}
                                  condition={condition}
                                  setNewCondition={setNewCondition}
                                  openFormModal={openInputForm}
                                  setIsConditionEdit={setIsConditionEdit}
                                  manualRoutine={manualRoutine}
                                />
                              )
                          )
                        )}
                      </ScrollView>
                    </View>
                    <Text style={styles.titleText}>Actions</Text>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => {
                        setIsActionAddActitve(true), openFormModal();
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} size={20} />
                      <Text>Add action</Text>
                    </TouchableOpacity>
                    <View style={styles.conditionsView}>
                      <ScrollView
                        showsVerticalScrollIndicator={true}
                        indicatorStyle="black"
                      >
                        {actions.length === 0 ? (
                          <Text style={styles.infoTextAction}>
                            There are no added actions.
                          </Text>
                        ) : (
                          actions.map((action) => (
                            <CustomActionComponent
                              key={action.id}
                              type={action.action_type}
                              action={action}
                              setNewAction={setNewAction}
                              openFormModal={openInputForm}
                              setIsActionEdit={setIsActionEdit}
                              setIsActionForm={setIsActionForm}
                            />
                          ))
                        )}
                      </ScrollView>
                    </View>
                    <View style={styles.buttonsView}>
                      <Button
                        title="Back"
                        onPress={() => {
                          updateRoutine();
                          setIsNewRoutineModalVisible(false);
                          setRoutineName("");
                          setConditions([]);
                          setActions([]);
                          setIsEdit(false);
                          setManualRoutine(false);
                        }}
                      />
                      <Button
                        title="Delete"
                        onPress={() => deleteRoutine(routineId)}
                      />
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>

            <Modal
              visible={isFormModalVisible}
              onRequestClose={() => setIsFormModalVisible(false)}
              animationType="none"
              presentationStyle="fullScreen"
            >
              <ScrollView
                showsVerticalScrollIndicator={true}
                indicatorStyle="black"
              >
                <View style={styles.newRoutineViewBackground}>
                  {loadingRoutine ? (
                    <View>
                      <ActivityIndicator
                        size="large"
                        color="#FF7B00"
                        style={{ marginTop: 300 }}
                      />
                      <Button
                        title="Cancel"
                        onPress={() => {
                          setIsNewRoutineModalVisible(false);
                          setRoutineName("");
                          setConditions([]);
                          setActions([]);
                          setIsEdit(false);
                          setManualRoutine(false);
                          setIsActionAddActitve(false);
                          setIsActionForm(false);
                        }}
                      />
                    </View>
                  ) : (
                    <View style={styles.newRoutineView}>
                      <View style={styles.options}>
                        {isActionAddActitve ? (
                          <Text style={styles.selectTitle}>
                            Select an action type
                          </Text>
                        ) : (
                          <Text style={styles.selectTitle}>
                            Select a condition type
                          </Text>
                        )}

                        {isActionAddActitve ? (
                          <Picker
                            style={styles.actionPicker}
                            selectedValue={selectedActionOption}
                            onValueChange={(itemValue) =>
                              handeActionOptionChange(itemValue)
                            }
                          >
                            {actionsOptions.map((option) => (
                              <Picker.Item
                                key={option}
                                label={option}
                                value={option}
                              />
                            ))}
                          </Picker>
                        ) : (
                          <Picker
                            style={styles.picker}
                            selectedValue={selectedOption}
                            onValueChange={(itemValue) =>
                              handleOptionChange(itemValue)
                            }
                          >
                            {options.map((option) => (
                              <Picker.Item
                                key={option}
                                label={option}
                                value={option}
                              />
                            ))}
                          </Picker>
                        )}
                        {selectedOption !== "" && !isActionAddActitve ? (
                          <Text style={{ marginTop: 10 }}>
                            Selected condition: {selectedOption}
                          </Text>
                        ) : (
                          <Text style={{ marginTop: 10 }}>
                            Selected action: {selectedActionOption}
                          </Text>
                        )}
                        {isAlreadyAdded && !isActionAddActitve && (
                          <Text style={{ color: "red", marginTop: 10 }}>
                            This condition is already added.
                          </Text>
                        )}
                        {isAlreadyAddedAction && isActionAddActitve && (
                          <Text style={{ color: "red", marginTop: 10 }}>
                            This action is already added.
                          </Text>
                        )}
                      </View>

                      <View style={styles.buttonsView}>
                        <Button
                          title="Cancel"
                          onPress={() => {
                            setIsFormModalVisible(false);
                            setSelectedOption("");
                            setIsActionEdit(false);
                            setIsActionForm(false);
                            setIsActionAddActitve(false);
                          }}
                        />
                        <Button
                          title="Next"
                          onPress={() => openInputForm()}
                          disabled={
                            isActionAddActitve
                              ? isAlreadyAddedAction
                              : isAlreadyAdded
                          }
                        />
                      </View>
                    </View>
                  )}
                </View>
              </ScrollView>

              <Modal
                visible={isInputFormVisible}
                onRequestClose={() => setIsInputFormVisible(false)}
                animationType="none"
                presentationStyle="fullScreen"
              >
                {!isActionForm ? (
                  <View style={styles.inputForm}>
                    <CustomConditionForm
                      type={
                        isConditionEdit
                          ? newCondition.condition_type
                          : selectedOption.toLowerCase()
                      }
                      setNewCondition={setNewCondition}
                      condition={newCondition}
                    />
                    {isConditionEdit ? (
                      <View style={styles.buttonsViewInput}>
                        <Button title="Cancel" onPress={() => cancelPress()} />
                        <Button
                          title="Delete"
                          onPress={() => deleteCondition()}
                        />
                        <Button
                          title="Save"
                          onPress={() => updateConditions()}
                        />
                      </View>
                    ) : (
                      <View style={styles.buttonsViewInput}>
                        <Button
                          title="Back"
                          onPress={() => {
                            setIsInputFormVisible(false);
                          }}
                        />
                        <Button
                          title="Add"
                          onPress={() => updateConditions()}
                        />
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={styles.inputForm}>
                    <CustomActionForm
                      type={
                        isActionEdit
                          ? newAction.action_type
                          : selectedActionOption.toLowerCase()
                      }
                      setNewAction={setNewAction}
                      action={newAction}
                    />

                    {isActionEdit ? (
                      <View style={styles.buttonsViewInput}>
                        <Button title="Cancel" onPress={() => cancelPress()} />
                        <Button title="Delete" onPress={() => deleteAction()} />
                        <Button title="Save" onPress={() => updateActions()} />
                      </View>
                    ) : (
                      <View style={styles.buttonsViewInput}>
                        <Button
                          title="Back"
                          onPress={() => {
                            setIsInputFormVisible(false);
                            setIsActionForm(false);
                          }}
                        />
                        <Button title="Add" onPress={() => updateActions()} />
                      </View>
                    )}
                  </View>
                )}
              </Modal>
            </Modal>
          </Modal>
          <Modal
            visible={isAddRoutineModalVisible}
            onRequestClose={() => setIsAddRoutineModalVisible(false)}
            animationType="fade"
            transparent={true}
          >
            <View style={styles.inputRoutineForm}>
              <View style={styles.routineNameView}>
                <Text style={styles.titleText}>Routine</Text>
                <TouchableOpacity
                  onPress={routineNameInputPress}
                  style={styles.inputRoutineField}
                >
                  <FontAwesomeIcon icon={faTag} size={25} color="darkgray" />
                  <TextInput
                    ref={routineNameInputRef}
                    style={styles.inputText}
                    placeholder="Routine Name"
                    value={routineName}
                    onChangeText={setRoutineName}
                    placeholderTextColor="darkgray"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.buttonsViewInput}>
                <Button title="Cancel" onPress={() => cancelAddPress()} />
                <Button title="Add" onPress={() => addRoutineName()} />
              </View>
            </View>
          </Modal>
        </View>
      )}
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
  routineList: {
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
  routineText: {
    fontSize: 15,
    maxWidth: 200,
    paddingRight: "10%",
    color: "black",
    fontWeight: "bold",
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
  routineIcons: {
    color: "darkgray",
  },
  newRoutineModal: {},
  newRoutineView: {
    backgroundColor: "white",
    padding: 15,
    height: 150,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    paddingTop: 30,
  },
  newRoutineViewBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    minHeight: "35%",
    height: "fit-content",
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
  switch: {
    flexDirection: "row",
    width: "80%",
    marginTop: 15,
  },
  switchText: {
    fontSize: 16,
    color: "black",
    marginRight: 10,
    fontSize: 20,
    marginBottom: 10,
  },
  titleText: {
    fontSize: 26,
    color: "#FF7B00",
    fontWeight: "bold",
    marginTop: 10,
  },
  titleTextManual: {
    fontSize: 26,
    color: "gray",
    fontWeight: "bold",
    marginTop: 10,
    opacity: 0.5,
  },
  inputText: {
    marginLeft: "10%",
    color: "black",
    width: "100%",
    fontSize: 16,
    textAlignVertical: "top",
  },
  conditionsView: {
    flexDirection: "column",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    padding: 5,
    backgroundColor: "white",
    marginTop: 10,
    height: "140%",
    width: "fit-content",
  },
  conditionsViewManual: {
    flexDirection: "column",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    padding: 5,
    backgroundColor: "lightgray",
    marginTop: 10,
    height: "140%",
    width: "fit-content",
    opacity: 0.5,
  },
  buttonsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginTop: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 30,
    backgroundColor: "limegreen",
    borderColor: "black",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    color: "black",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 30,
  },
  addButtonManual: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 30,
    backgroundColor: "lightgray",
    borderColor: "black",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    color: "black",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 30,
    opacity: 0.5,
  },
  infoText: {
    marginTop: 50,
    fontSize: 18,
    color: "darkgray",
  },
  infoTextAction: {
    marginTop: 50,
    fontSize: 18,
    color: "darkgray",
    marginHorizontal: 12,
  },
  options: {
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 10,
    marginBottom: 50,
  },
  picker: {
    width: 200,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    backgroundColor: "white",
  },
  actionPicker: {
    width: 300,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    backgroundColor: "white",
  },
  selectTitle: {
    fontSize: 24,
    color: "#FF7B00",
    marginBottom: 10,
    marginTop: 100,
    fontWeight: "bold",
  },
  inputForm: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoutineForm: {
    marginVertical: 200,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    height: "35%",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 50,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    padding: 5,
    backgroundColor: "white",
  },

  routineNameView: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",

    marginBottom: 50,
  },
  buttonsViewInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginBottom: 20,
  },
  inputRoutineField: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    width: "80%",
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
  routineInfo: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    marginTop: 140,
  },
});

export default Routines;
