// NewChore.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import { ScreenHeader } from '../components/headers.js';
import Dropdown from '../components/dropdown.js';

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
  const [username, setUsername] = useState(null);
  const [userGroups, setUserGroups] = useState([]);

  const [group, setGroup] = useState('Personal');
  const [recurrence, setRecurrence] = useState('Just Once');    // how often the chore recurrs, added to the db -KK
  const [chore_name, setChoreName] = useState('');  // the name of the chore to be added to the db -KK
  const [tasks, setTasks] = useState([]);  // the new task list to be added to the array -KK
  const [newTask, setNewTask] = useState('');  // block for the new task to add to the list -KK

  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);


  // recurrence dropdown
  const initialRec = { label: 'Just Once', value: 'Just Once' };
  const [selectedRec, setSelectedRec] = useState(initialRec);  // how often the chore recurrs, selectedRec.value added to the db
  const recDropdownData = [
    { label: 'Just Once', value: 'Just Once' },
    { label: 'Every Minute', value: 'Every Minute' },
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
  ];

  // Get user
  useEffect(() => {
    const getUsername = async () => {   // get the username from securestore -KK
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        console.error("UI NewChore.js: Username not found in SecureStore.");
      }
      // get all groups for the user -KK
      await axios.post(`${API_URL}get-all-groups-for-user`, { username: storedUsername }).then((response) => setUserGroups(response.data))
      .catch((error) => console.error(error)); 
      console.log("UI NewChore: userGroups is " + userGroups);
      refresh();
    };
    getUsername();
  }, []);

  // Add the chore to the database
  // (gets called when the "add chore" button is pressed) -KK
  const addChore = async () => {
    console.log("UI NewChore: adding chore " + chore_name + " to " + group);
    try {
      console.log("UI NewChore: userGroups is " + JSON.stringify(userGroups));
      // add the chore to the database -KK
      if(group == 'Personal'){
        await axios.post(`${API_URL}add-chore`, { chore_name, username, recurrence: selectedRec.value });
        // loop through tasks and add each one to the db -KK
        await Promise.all(tasks.map(task_name =>
          axios.post(`${API_URL}add-task`, { chore_name, task_name, username })
        ));
      }else{
        // add the group chore to the database -KK
        // assign_to is hardcoded as of now

        const groupEntry = userGroups.find(entry => entry.group_name === group);
        const group_id = groupEntry.group_id;

        await axios.post(`${API_URL}add-group-chore`, { 
          group_chore_name: chore_name,
          assign_to: username,
          recurrence: selectedRec.value,
          group_id
        });

        await Promise.all(tasks.map(group_task_name =>
          axios.post(`${API_URL}add-group-task`, { group_chore_name: chore_name, group_task_name, group_id })
        ));
      }

      // reset everything -KK
      setChoreName('');
      setUserGroups([]);
      setNewTask('');
      setGroup('Personal');
      setSelectedRec(initialRec);
      setTasks([]);
      navigation.goBack();  // exit and go back to home -KK
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

  const refresh = () => {
    userGroups.forEach(group => {
      console.log("UI NewChore group is: " + group.group_name);
    });
  };

  // ---------- Page Content ----------
  return (
    <View style={styles.content}>

        <View style={styles.formContainer}>
        {/* Chore Name Input */}
        <Text style={styles.label}>Chore Name:</Text>
        <TextInput
          style={styles.choreNameInput}
          placeholder="Enter Chore Name . . ."
          placeholderTextColor={theme.text3}
          value={chore_name}
          selectionColor={theme.text2}
          onChangeText={setChoreName}
        />

        {/********************* FIX BELOW *********************/}

        {/* the chore group bit -KK */}
        <Text style={styles.label}>Group:</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setIsGroupModalVisible(true)}
        >
          <Text style={oldStyles.dropdownText}>{group}</Text>
        </TouchableOpacity>

        <Modal
          visible={isGroupModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsGroupModalVisible(false)}
        >
          <View style={oldStyles.modalOverlay}>
            <View style={oldStyles.modalContainer}>
              <TouchableOpacity onPress={() => { setGroup('Personal'); setIsGroupModalVisible(false); }}>
                <Text style={oldStyles.modalItem}>Personal</Text>
              </TouchableOpacity>
              {/* loop through all user groups and add that to the modal list -KK */}
              {userGroups && userGroups.length > 0 && (
                userGroups.map((group, index) => (
                  <TouchableOpacity key={index} onPress={() => { setGroup(group.group_name); setIsGroupModalVisible(false); }}>
                    <Text style={oldStyles.modalItem}>{group.group_name}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        </Modal>

        {/********************* FIX ABOVE *********************/}

        {/* Recurrence Dropdown */}
        <Text style={styles.label}>Recurrence:</Text>
        <Dropdown
          label="Select Item"
          data={recDropdownData}
          onSelect={setSelectedRec}
          initialValue = {initialRec}
        />

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
            
      {/* ADD CHORE Button */}
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
  dropdownText: {
    fontSize: 16,
    color: theme.text1,
  },
});

export default NewChoreScreen;