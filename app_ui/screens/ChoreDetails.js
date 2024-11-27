// ChoreDetails.js

import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../contexts/ThemeProvider.js';
import createStyles from '../style/styles';
import { ScreenHeader } from '../components/headers.js';
import Dropdown from '../components/dropdown.js';
import Switch from '../components/switch.js';

import axios from 'axios';
import { API_URL } from '../config';


// header and page content
const ChoreDetailsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      {/*the ScreenHeader component creates the title and back button -MH*/}
      <ScreenHeader title="Chore Details" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ChoreDetailsDisplay navigation={navigation} />
      </ScrollView>
    </View>
  );
};


// page content
const ChoreDetailsDisplay = ({navigation}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // get current chore details from parameters -MH
  const route = useRoute();
  const { routed_chore_name, routed_tasks, routed_recurrence, routed_group_id, routed_assignment, routed_rotation } = route.params;

  const [username, setUsername] = useState(null);
  const [chore_name, setChoreName] = useState('');  // the name of the chore to be added to the db -KK
  const [tasks, setTasks] = useState([]);  // the new task list to be added to the array -KK
  const [newTask, setNewTask] = useState('');  // block for the new task to add to the list -KK
  const [choreGroup, setChoreGroup] = useState({});
  const [permission, setPermission] = useState({});

  // recurrence dropdown -MH
  const recDropdownData = [
    { label: 'Just Once', value: 'Just Once' },
    { label: 'Every Minute', value: 'Every Minute' },
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
  ];
  const initialRec = recDropdownData.find(item => item.value === routed_recurrence) || { label: '', value: '' };
  const [selectedRec, setSelectedRec] = useState(initialRec);  // how often the chore recurrs, selectedRec.value added to the db -MH
  
  // rotation state - AT
  const [rotationEnabled, setRotationEnabled] = useState(routed_rotation);
  

  // assignment dropdown data
  const [assignmentDropdownData, setAssignmentDropdownData] = useState([]);
  const [initialAssignment, setInitialAssignment] = useState(null);
  const [assign_to, setAssignment] = useState(null);

  const [loading, setLoading] = useState(true); 

  // Get user and groups
  useEffect(() => {
    const init = async () => {
      try {
        const storedUsername = await SecureStore.getItemAsync('username');
        if (storedUsername) {
          setUsername(storedUsername);
        } else {
          console.error("UI ChoreDetails.js: Username not found in SecureStore.");
        }
  
        if (routed_group_id !== -1) {
          // Fetch initial assignment
          const displayResponse = await axios.post(`${API_URL}get-display`, {
            user_id: routed_assignment,
          });
          
          if (displayResponse?.data?.[0]?.display_name) {
            setInitialAssignment({
              label: displayResponse.data[0].display_name,
              value: routed_assignment,
            });
            setAssignment({
              label: displayResponse.data[0].display_name,
              value: routed_assignment,
            });
          } else {
            console.error("UI ChoreDetails.js: Failed to fetch initial assignment display name.");
          }

          // Fetch group members for the assignment dropdown
          const memberResponse = await axios.get(`${API_URL}get-group-members`, {
            params: { group_id: routed_group_id },
          });
  
          if (memberResponse?.data) {
            const transformedData = memberResponse.data.map((member) => ({
              label: member.display_name,
              value: member.user_id,
            }));
            setAssignmentDropdownData(transformedData);
          } else {
            console.error("UI ChoreDetails.js: Failed to fetch group members.");
          }

          // get the user's permissions for this chore -KK
          const perm = await axios.post(`${API_URL}get-perms`, {
            username: storedUsername,
            group_id: routed_group_id
          });
          setPermission(perm.data);

        }
        else {  setPermission(1); }
        setLoading(false);
      } catch (error) {
        console.error("UI ChoreDetails.js: Error initializing chore details:", error);
      }
    };
    init();
  }, []);
  

  useEffect(() => {
    const getGroupName = async () => {
      if (routed_group_id == -1) {
        setChoreGroup({ label: "Personal", value: routed_group_id });
      } else {
          try {
            const response = await axios.post(`${API_URL}get-group-name`, { group_id: routed_group_id });
            if (response && response.data) {
              setChoreGroup({ label: response.data.group_name, value: routed_group_id });
            } else {
              console.error("Group name not found for the provided group_id.");
            }
          } catch (error) {
            console.error("Error fetching group name:", error);
          }
      }
    };
  
    getGroupName();
  }, [routed_group_id]);

  // Set form starting values to the saved details of the chore -MH
  useEffect(() => {
    setChoreName(routed_chore_name);
    setTasks(routed_tasks);
  }, [routed_chore_name, routed_tasks]);

  // setting rotation state for chore - AT
  useEffect(() => {
    const loadRotationState = async () => {
      try {
        const savedValue = await AsyncStorage.getItem(`rotationEnabled_${routed_chore_name}`);
        if (savedValue !== null) {
          setRotationEnabled(savedValue ? JSON.parse(savedValue) : false);
        }
      } catch (error) {
        console.error('Error loading rotationEnabled state:', error);
      }
    };

    loadRotationState();
  }, [routed_chore_name]);

  // Get the existing tasks for the chore from the database -MH
  const getExistingTasks = async () => {
    let response = null;
    if(choreGroup.label == 'Personal'){
      response = await axios.post(`${API_URL}get-tasks`, { chore_name, username });
      return response.data.map(taskObj => taskObj.task_name);
    } else {
      response = await axios.post(`${API_URL}get-group-tasks`, { group_chore_name: chore_name, group_id: choreGroup.value });
      return response.data.map(taskObj => taskObj.group_task_name);
    }
  };

  // Compare 'tasks' list with the database and add/remove tasks from the database to match 'tasks' -MH
  const updateTasksInDatabase = async () => {
    try {
      const existingTasks = await getExistingTasks();
      
      // determine which tasks are new
      const tasksToAdd = tasks.filter(task => 
        !existingTasks.includes(task)
      );

      // determine which tasks were deleted
      const tasksToRemove = existingTasks.filter(existingTask => 
        !tasks.includes(existingTask)
      );

      if(choreGroup.label == 'Personal'){
        // add new tasks
        await Promise.all(
          tasksToAdd.map(task_name =>
            axios.post(`${API_URL}add-task`, { chore_name, task_name, username }))
        );

        // remove tasks that are no longer in the array
        await Promise.all(
          tasksToRemove.map(task_name =>
            axios.post(`${API_URL}delete-task`, { chore_name, task_name, username }))
        );
      } else { 
        await Promise.all(
          tasksToAdd.map(group_task_name =>
            axios.post(`${API_URL}add-group-task`, { group_chore_name: chore_name, group_task_name, group_id: choreGroup.value, username: username }))
        );

        await Promise.all(
          tasksToRemove.map(group_task_name =>
            axios.post(`${API_URL}delete-group-task`, { group_chore_name: chore_name, group_task_name, group_id: choreGroup.value, username: username }))
        );
      }

    } catch (error) {
      console.error("Error updating tasks in database:", error);
      Alert.alert("Error: ", error.response.data.message);
    }
  };

  // Function to handle rotation switch toggle - AT
  const handleRotationToggle = async (value) => {
    /*
    try {
      // Update the local state immediately
      setRotationEnabled(value);
  
      // save state of toggle even when switch screens
      await AsyncStorage.setItem(`rotationEnabled_${routed_chore_name}`, JSON.stringify(value));
    } catch (error) {
      console.error('Error updating rotation_enabled:', error);
    }*/
      setRotationEnabled(value); // Update only local state
  };
  

  // Update the chore in the database
  // (gets called when the "update chore" button is pressed) -MH
  const updateChore = async () => {
    try {
        if(choreGroup.label == 'Personal') {
          await axios.post(`${API_URL}update-chore`, {
            old_chore_name: routed_chore_name,  // original chore name
            new_chore_name: chore_name,  // updated chore name from input
            username,
            recurrence: selectedRec.value,
          });
        } else {
          await axios.post(`${API_URL}update-group-chore`, {
            old_chore_name: routed_chore_name,  // original chore name
            new_chore_name: chore_name,  // updated chore name from input
            group_id: choreGroup.value,
            recurrence: selectedRec.value,
            rotation_enabled: rotationEnabled,
            assign_to: assign_to.value,
            username: username
          });
        }

        await AsyncStorage.setItem(`rotationEnabled_${routed_chore_name}`, JSON.stringify(rotationEnabled));

        // add/remove tasks in database to match list in edit details window
        await updateTasksInDatabase();

        // exit and go back to home
        navigation.goBack();

    } catch (error) {
        console.error("Error updating chore:", error);
        Alert.alert("Error: ", error.response.data.message);
    }
  };

  // Adds the task entered into the input box to the task list
  // These will only get added to the db after the "save changes" button is pressed -MH
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask]);
      setNewTask('');
    }
  };

  // Delete task from the task list -MH
  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index)); // keep all tasks except the one at 'index'
  };

  // Deletes the chore from the database -KK
  const deleteChore = async (chore_name) => {
    try {
      if (choreGroup.label == 'Personal'){
        await axios.post(`${API_URL}delete-chore`, { chore_name, username });
      } else {
        await axios.post(`${API_URL}delete-group-chore`, { group_chore_name: chore_name, group_id: choreGroup.value, username: username });
      }
      navigation.goBack();   
    } catch (error) {
      console.error(error);
    }
  };

  // ---------- Page Content ----------
  return (
    <View style={styles.content}>
      {loading ? (
        <Text>Loading...</Text> // Display a loader or placeholder
      ) : (
      <>
      <View style={styles.formContainer}>

        {/* Chore Name Input */}
        {permission === 1 ? (
          <>
          {/* editable */}
          <Text style={styles.label}>Chore Name:</Text>
          <TextInput
            style={styles.choreNameInput}
            value={chore_name}
            selectionColor={theme.text2}
            onChangeText={setChoreName}
          />
          </>
        ) : (
          <>
          {/* NOT editable */}
          <Text style={styles.label}>Chore Name:</Text>
          <View
            style={styles.choreNameInputNoEdit}
          >
            <Text style={styles.choreNameInputText}>{chore_name}</Text>
          </View>
          </>
        )}

        {/* Show Group */}
        {/* NOT editable */}
        <Text style={styles.label}>Group:</Text>
        <View style={styles.dropdownContainer}>
          <View
            style={styles.dropdownButtonNoEdit}
          >
            <Text style={styles.dropdownButtonText}>{choreGroup.label}</Text>
          </View>
        </View>

        {/* Assignment Dropdown */}
        {routed_group_id !== -1 && (
          <>
            {permission === 1 ? (
              <>
                {/* editable */}
                <Text style={styles.label}>Assignment:</Text>
                {initialAssignment && (
                  <Dropdown
                    label="Assign to Member"
                    data={assignmentDropdownData || []}
                    onSelect={setAssignment}
                    initialValue={initialAssignment}
                  />
                )}
              </>
            ) : (
              <>
                {/* NOT editable */}
                <Text style={styles.label}>Assignment:</Text>
                <View style={styles.dropdownContainer}>
                  <View
                    style={styles.dropdownButtonNoEdit}
                  >
                    <Text style={styles.dropdownButtonText}>{initialAssignment.label}</Text>
                  </View>
                </View>
              </> 
            )}
          </>
        )}
        

        {/* Recurrence Dropdown */}
        {permission === 1 ? (
          <>
            {/* editable */}
            <Text style={styles.label}>Recurrence:</Text>
            <Dropdown
              label=""
              data={recDropdownData}
              onSelect={setSelectedRec}
              initialValue = {initialRec}
            />
          </>
        ) : (
          <>
            {/* NOT editable */}
            <Text style={styles.label}>Recurrence:</Text>
            <View style={styles.dropdownContainer}>
              <View
                style={styles.dropdownButtonNoEdit}
              >
                <Text style={styles.dropdownButtonText}>{initialRec.label}</Text>
              </View>
            </View>
          </>
        )}

        {/* Rotation Switch - AT */}
        {selectedRec.value !== 'Just Once' && permission === 1 ? (
          <>
            {/* Editable */}
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Enable Rotation </Text>
              <Switch
                isOn={rotationEnabled}
                onToggle={handleRotationToggle}
              />
            </View>
          </>
        ) : (selectedRec.value !== 'Just Once') ? (
          <>
            {/* Not editable */}
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Enable Rotation </Text>
              <Switch
                isOn={rotationEnabled}
                onToggle={() => {}} // You can also disable the toggle if needed
                disabled
              />
            </View>
          </>
        ) : null}

        {/* Tasks */}
        {permission === 1 ? (
          <>
            {/* editable */}
            <Text style={styles.label}>Tasks:</Text>
            {/* Show Task List */}
            {tasks && tasks.length > 0 ? (
              <View style={styles.taskList}>
                <FlatList
                  scrollEnabled={false}
                  data={tasks}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <View style={styles.bulletAndTask}>
                      <Icon name={"square-outline"} size={15} color={theme.text2} />
                      <Text style={styles.taskItem}>{item}</Text>
                      <TouchableOpacity
                        style={styles.newChoreDeleteTask}
                        onPress={() => deleteTask(index)}
                      >
                        <Icon name="close-outline" size={24} color={theme.text3} />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            ) : (
              <View style={styles.emptyTasksSection}>
                <Text style={styles.emptySectionText}> no tasks added</Text>
              </View>
            )}

            {/* Add Task Input and Button */}
            <View style={styles.inputAndButton}>
              <TextInput
                style={styles.taskNameInput}
                placeholder="Add Task . . ."
                placeholderTextColor={theme.text3}
                value={newTask}
                selectionColor={theme.text2}
                onChangeText={setNewTask}
                onSubmitEditing={addTask}
              />

              {/* Add Task Button */}
              <View style={styles.inputButtonContainer}>
                <TouchableOpacity onPress={addTask}>
                  <Icon name="arrow-forward-circle-outline" size={40} color={theme.main} />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* NOT editable */}
            <Text style={styles.label}>Tasks:</Text>
            {/* Show Task List */}
            {tasks && tasks.length > 0 ? (
              <FlatList
                scrollEnabled={false}
                data={tasks}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.bulletAndTask}>
                    <Icon name={"square-outline"} size={15} color={theme.text2} />
                    <Text style={styles.taskItem}>{item}</Text>
                  </View>
                )}
              />
            ) : (
              <View style={styles.emptyTasksSection}>
                <Text style={styles.emptySectionText}> no tasks added</Text>
              </View>
            )}
          </>
        )}
        
      </View>

      {/* SAVE CHANGES Button */}
      {permission === 1 && (
        <View style={styles.centeredContent}>
          <TouchableOpacity
            style={styles.addChoreButton}
            onPress={updateChore}
            activeOpacity={0.8}
          >
            <Text style={styles.addChoreButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* DELETE Button */}
      {permission === 1 && (
        <View style={styles.centeredContent}>
          <TouchableOpacity
            style={styles.deleteChoreButton}
            onPress={() => deleteChore(routed_chore_name)}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteChoreButtonText}>Delete Chore</Text>
          </TouchableOpacity>
        </View>
      )}
      </>
    )}
    </View>
  );
};

export default ChoreDetailsScreen;