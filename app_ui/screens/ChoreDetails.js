// ChoreDetails.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import { ScreenHeader } from '../components/headers.js';
import Dropdown from '../components/dropdown.js';

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
      <ChoreDetailsDisplay navigation={navigation} />
    </View>
  );
};


// page content
const ChoreDetailsDisplay = ({navigation}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // get current chore details from parameters -MH
  const route = useRoute();
  const { routed_chore_name, routed_tasks, routed_recurrence, routed_group_id } = route.params;

  const [username, setUsername] = useState(null);
  const [chore_name, setChoreName] = useState('');  // the name of the chore to be added to the db -KK
  const [tasks, setTasks] = useState([]);  // the new task list to be added to the array -KK
  const [newTask, setNewTask] = useState('');  // block for the new task to add to the list -KK
  const [choreGroup, setChoreGroup] = useState({});

  // recurrence dropdown -MH
  const recDropdownData = [
    { label: 'Just Once', value: 'Just Once' },
    { label: 'Every Minute', value: 'Every Minute' },
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
  ];
  const initialRec = recDropdownData.find(item => item.value === routed_recurrence) || { label: '', value: '' };
  const [selectedRec, setSelectedRec] = useState(initialRec);  // how often the chore recurrs, selectedRec.value added to the db -MH

  // Get user and groups
  useEffect(() => {
    const getUsername = async () => {   // get the username from securestore -KK
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        console.error("UI ChoreDetails.js: Username not found in SecureStore.");
      }
    };

    getUsername();
  }, []);

  useEffect(() => {
    const getGroupName = async () => {
      if (routed_group_id == -1) {
        setChoreGroup({ label: "Personal Chores", value: routed_group_id });
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
            axios.post(`${API_URL}add-group-task`, { group_chore_name: chore_name, group_task_name, group_id: choreGroup.value }))
        );

        await Promise.all(
          tasksToRemove.map(group_task_name =>
            axios.post(`${API_URL}delete-group-task`, { group_chore_name: chore_name, group_task_name, group_id: choreGroup.value }))
        );
      }

    } catch (error) {
      console.error("Error updating tasks in database:", error);
    }
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
            assigned_to: username
          });
        }

        // add/remove tasks in database to match list in edit details window
        await updateTasksInDatabase();

        // exit and go back to home
        navigation.goBack();

    } catch (error) {
        console.error("Error updating chore:", error);
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
        await axios.post(`${API_URL}delete-group-chore`, { group_chore_name: chore_name, group_id: choreGroup.value });
      }
      navigation.goBack();   
    } catch (error) {
      console.error(error);
    }
  };

  // ---------- Page Content ----------
  return (
    <View style={styles.content}>

      <View style={styles.formContainer}>

        {/* Chore Name Input */}
        <Text style={styles.label}>Chore Name:</Text>
        <TextInput
          style={styles.choreNameInput}
          value={chore_name}
          selectionColor={theme.text2}
          onChangeText={setChoreName}
        />

        {/* Show Group */}
        <Text style={styles.label}>Group: {choreGroup.label}</Text>
        <View style={styles.spacer}></View>
        <View style={styles.spacer}></View>

        {/* Recurrence Dropdown */}
        <Text style={styles.label}>Recurrence:</Text>
        <Dropdown
          label=""
          data={recDropdownData}
          onSelect={setSelectedRec}
          initialValue = {initialRec}
        />

        {/* Tasks */}
        <Text style={styles.label}>Tasks:</Text>

        {/* show task list  -MH */}
        <View style={styles.taskList}>
          <FlatList
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

        {/* 'Add Task' input and button */}
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

          {/* add task button  -MH */}
          <View style={styles.inputButtonContainer}>
            <TouchableOpacity onPress={addTask}>
              <Icon name="arrow-forward-circle-outline" size={40} color={theme.main} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* SAVE CHANGES Button */}
      <View style={styles.centeredContent}>
        <TouchableOpacity
          style={styles.addChoreButton}
          onPress={updateChore}
          activeOpacity={0.8}
        >
          <Text style={styles.addChoreButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      {/* DELETE Button */}
      <View style={styles.centeredContent}>
        <TouchableOpacity
          style={styles.deleteChoreButton}
          onPress={() => deleteChore(routed_chore_name)}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteChoreButtonText}>Delete Chore</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChoreDetailsScreen;