// NewChore.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import { ScreenHeader } from '../components/headers.js';

import axios from 'axios';
import { API_URL } from '../config';


// header and page content
const NewChoreScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      {/*the ScreenHeader component creates the title and back button -MH*/}
      <ScreenHeader title="Add a New Chore" navigation={navigation} />
      <NewChoreDisplay navigation={navigation} />
    </View>
  );
};

// page content
const NewChoreDisplay = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [chore_name, setChoreName] = useState('');     // the name of the chore to be added to the db -KK
  const [recurrence, setRecurrence] = useState('Just Once');    // how often the chore recurrs, added to the db -KK
  const [tasks, setTasks] = useState([]);              // the new task list to be added to the array -KK
  const [newTask, setNewTask] = useState('');          // block for the new task to add to the list -KK
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [username, setUsername] = useState(null);

  // Get user
  useEffect(() => {
    const getUsername = async () => {   // get the username from securestore -KK
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        console.error("UI NewChore.js: Username not found in SecureStore.");
      }
    };
    getUsername();
  }, []);

  // Add the chore to the database
  // (gets called when the "add chore" button is pressed) -KK
  const addChore = async () => {
    try {
      // add the chore to the database -KK
      await axios.post(`${API_URL}add-chore`, { chore_name, username, recurrence });

      // loop through tasks and add each one to the db -KK
      await Promise.all(tasks.map(task_name =>
        axios.post(`${API_URL}add-task`, { chore_name, task_name, username })
      ));

      // reset everything -KK
      setChoreName('');
      setNewTask('');
      setRecurrence('Just Once');
      setTasks([]);
      navigation.goBack();    // exit and go back to home -KK
    } catch (error) {
      console.error("Error adding chore:", error);
    }
  };

  // Adds the task entered into the input box to the task list
  // These will only get added to the db after the "add chore" button is pressed -KK
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask]);
      setNewTask('');
    }
  };

  // Delete task from the task list  -MH
  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index)); // keep all tasks except the one at 'index'
  };

  // ---------- Page Content ----------
  return (
    <View style={styles.content}>
      <View style={styles.formContainer}>
        {/* the chore name bit -KK */}
        <Text style={styles.label}>Chore Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Chore Name . . ."
          placeholderTextColor={theme.text3}
          value={chore_name}
          selectionColor={theme.text2}
          onChangeText={setChoreName}
        />

        {/* the recurrence bit -KK */}
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
              <TouchableOpacity onPress={() => { setRecurrence('Every Minute'); setIsModalVisible(false); }}>
                <Text style={oldStyles.modalItem}>Every Minute</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setRecurrence('Daily'); setIsModalVisible(false); }}>
                <Text style={oldStyles.modalItem}>Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setRecurrence('Weekly'); setIsModalVisible(false); }}>
                <Text style={oldStyles.modalItem}>Weekly</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Tasks */}
        <Text style={styles.label}>Tasks:</Text>

        {/* Show task list  -MH */}
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

        {/* Add Task input and button  -MH */}
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

        <View style={styles.centeredContent}>
          <TouchableOpacity
            style={styles.addChoreButton}
            onPress={addChore}
            activeOpacity={0.8}
          >
            <Text style={styles.addChoreButtonText}>Add Chore</Text>
          </TouchableOpacity>
        </View>
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


export default NewChoreScreen;