// NewChore.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import { ScreenHeader } from '../components/headers.js';

import axios from 'axios';
import { API_URL } from '../config';

const NewChoreScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // this is the "add new chore" at the top of the screen -KK
  return (
    <View style={[styles.screen]}>
      <ScreenHeader title="Add a New Chore" navigation={navigation} />
      <NewChoreDisplay navigation={navigation} />
    </View>
  );
};

const NewChoreDisplay = ({ navigation }) => {
  const [chore_name, setChoreName] = useState('');     // the name of the chore to be added to the db -KK
  const [recurrence, setRecurrence] = useState('Just Once');    // how often the chore recurrs, added to the db -KK
  const [tasks, setTasks] = useState([]);              // the new task list to be added to the array -KK
  const [newTask, setNewTask] = useState('');          // block for the new task to add to the list -KK
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [username, setUsername] = useState(null);

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

  // add the chore to the database, gets called when the "add chore" button is pressed -KK
  const addChore = async () => {
    try {
      // add the chore to the database -KK
      await axios.post(`${API_URL}add_chore`, { chore_name, username, recurrence });

      // loop through tasks and add each one to the db -KK
      await Promise.all(tasks.map(task_name =>
        axios.post(`${API_URL}add_task`, { chore_name, task_name, username })
      ));

      // reset everything -KK
      setChoreName('');
      setNewTask('');
      setRecurrence('Just Once');
      setTasks([]);
      navigation.goBack();    // exit and go back to home -KK

    } catch (error) {
      console.error(error);
    }
  };

  // adds the task entered into the input box to the task list
  // these will only get added to the db after the "add chore" button is pressed -KK
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask]);
      setNewTask('');
    }
  };

  // this is the box for adding a new chore -KK
  return (
    <View style={styles.formContainer}>
      {/* the chore name bit -KK */}
      <Text style={styles.label}>Chore Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter chore name"
        value={chore_name}
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => { setRecurrence('Just Once'); setIsModalVisible(false); }}>
              <Text style={styles.modalItem}>Just Once</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setRecurrence('Weekly'); setIsModalVisible(false); }}>
              <Text style={styles.modalItem}>Weekly</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* the task bit -KK */}
      <Text style={styles.label}>Tasks:</Text>
      <TextInput
        style={styles.input}
        placeholder="Add task..."
        value={newTask}
        onChangeText={setNewTask}
      />
      <Button title="Add Task" onPress={addTask} />

      {/* prints the task list underneath the add task bit -KK */}
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.taskItem}>- {item}</Text>
        )}
      />

      <View style={styles.buttonContainer}>
        <Button title="Add Chore" onPress={addChore} />
      </View>
    </View>
  );
};

// temporary styles for this screen -KK
const styles = StyleSheet.create({
  formContainer: {
    width: '90%', // Adjust percentage as needed
    padding: 20,
    backgroundColor: '#E5EAF2',
    borderRadius: 10,
    marginHorizontal: '5%', // Center the box by adding equal margins on both sides
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  dropdownText: {
    fontSize: 16,
    color: '#555',
  },
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
  taskItem: {
    fontSize: 14,
    marginLeft: 10,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default NewChoreScreen;