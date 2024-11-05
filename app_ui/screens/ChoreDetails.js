// ChoreDetails.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import { ScreenHeader } from '../components/headers.js';

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

  const route = useRoute();
  const { routed_chore_name, routed_tasks, routed_recurrence } = route.params;  // Get chore name from parameters

  const [chore_name, setChoreName] = useState('');  // the name of the chore to be added to the db -KK
  const [recurrence, setRecurrence] = useState('Just Once');  // how often the chore recurrs, added to the db -KK
  const [tasks, setTasks] = useState([]);  // the new task list to be added to the array -KK
  const [newTask, setNewTask] = useState('');  // block for the new task to add to the list -KK
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [username, setUsername] = useState(null);

  // Get user
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

  // Set form starting values to the saved details of the chore -MH
  useEffect(() => {
    setChoreName(routed_chore_name);
    setTasks(routed_tasks);
    setRecurrence(routed_recurrence);
  }, [routed_chore_name, routed_tasks, routed_recurrence]);

  // Get the existing tasks for the chore from the database -MH
  const getExistingTasks = async () => {
    const response = await axios.post(`${API_URL}get_tasks`, { chore_name, username });
    
    // get result as array of strings
    return response.data.map(taskObj => taskObj.task_name);
  };

  // Compare 'tasks' list with the database and add/remove tasks from the database to match 'tasks' -MH
  const updateTasksInDatabase = async () => {
    try {
      const existingTasks = await getExistingTasks();

      console.log("existing tasks:", existingTasks);

      // determine which tasks are new
      const tasksToAdd = tasks.filter(task => 
        !existingTasks.includes(task)
      );

      console.log("tasks to add:", tasksToAdd);

      // determine which tasks were deleted
      const tasksToRemove = existingTasks.filter(existingTask => 
        !tasks.includes(existingTask)
      );

      console.log("tasks to remove:", tasksToRemove);

      // add new tasks
      await Promise.all(
        tasksToAdd.map(task_name =>
          axios.post(`${API_URL}add_task`, { chore_name, task_name, username })
        )
      );

      // remove tasks that are no longer in the array
      await Promise.all(
        tasksToRemove.map(task_name =>
          axios.post(`${API_URL}delete_task`, { chore_name, task_name, username })
        )
      );

    } catch (error) {
      console.error("Error updating tasks in database:", error);
    }
  };

  // Update the chore in the database
  // (gets called when the "update chore" button is pressed) -MH
  const updateChore = async () => {
    try {
        await axios.post(`${API_URL}update_chore`, {
            old_chore_name: routed_chore_name,  // original chore name
            new_chore_name: chore_name,  // updated chore name from input
            username,
            recurrence,
        });

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
      await axios.post(`${API_URL}delete_chore`, { chore_name, username });
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
          style={styles.input}
          value={chore_name}
          selectionColor={theme.text2}
          onChangeText={setChoreName}
        />

        {/* Recurrence Dropdown */}
        <Text style={styles.label}>Recurrence:</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.dropdownText}>{recurrence}</Text>
        </TouchableOpacity>

        {/* modal is acting as the "drop down" menu for recurence */}
        {/* this will be changed as recurrence is further implemented -KK */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={oldStyles.modalOverlay}>
            <View style={oldStyles.modalContainer}>
              <TouchableOpacity onPress={() => { setRecurrence('Just Once'); setIsModalVisible(false); }}>
                <Text style={oldStyles.modalItem}>Just Once</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setRecurrence('Weekly'); setIsModalVisible(false); }}>
                <Text style={oldStyles.modalItem}>Weekly</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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

        {/* 'Add Task' input and button  -MH */}
        <View style={styles.inputAndButton}>
          <TextInput
            style={styles.smallerInput}
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


// temporary styles for this screen -KK
const oldStyles = StyleSheet.create({
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalItem: {
    fontSize: 18,
    padding: 10,
    width: '100%',
    textAlign: 'center',
  },
});

export default ChoreDetailsScreen;