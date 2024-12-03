// NewChore.js

import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

import { useTheme } from '../contexts/ThemeProvider.js';
import createStyles from '../style/styles';
import { ScreenHeader } from '../components/headers.js';
import { LoadingVisual } from '../components/placeholders.js';
import Dropdown from '../components/dropdown.js';
import Switch from '../components/switch.js';
import { UsePresetButton } from '../components/buttons.js';

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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <NewChoreDisplay navigation={navigation} />
      </ScrollView>
    </View>
  );
};

// page content
const NewChoreDisplay = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [username, setUsername] = useState(null);
  const [display, setDisplay] = useState(null);
  const [user_id, setUserID] = useState(null);
  const [choreName, setChoreName] = useState('');  // the name of the chore to be added to the db -KK
  const [tasks, setTasks] = useState([]);  // the new task list to be added to the array -KK
  const [newTask, setNewTask] = useState('');  // block for the new task to add to the list -KK

  // recurrence dropdown
  const recDropdownData = [
    { label: 'Just Once', value: 'Just Once' },
    { label: 'Every Minute', value: 'Every Minute' },
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
  ];
  const initialRec = { label: 'Just Once', value: 'Just Once' };
  const [selectedRec, setSelectedRec] = useState(initialRec);  // how often the chore recurrs, selectedRec.value added to the db -MH
  const [rotationEnabled, setRotationEnabled] = useState(false); // set default to rotation off - AT

  // group dropdown
  const [groupDropdownData, setGroupDropdownData] = useState([{ label: 'Personal', value: -1 }]);
  const initialGroup = { label: 'Personal', value: -1 };
  const [selectedGroup, setSelectedGroup] = useState(initialGroup);

  // assignment dropdown
  const [assignmentDropdownData, setAssignmentDropdownData] = useState([]);
  const initialAssignment = { label: display, value: user_id };
  const [assign_to, setAssignment] = useState(null);

  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const getUsername = async () => {
      try {
        const storedUsername = await SecureStore.getItemAsync('username');
        if (storedUsername) {
          setUsername(storedUsername);
        } else {
          console.error("UI NewChore.js: Username not found in SecureStore.");
        }

        const userResponse = await axios.post(`${API_URL}get-user-id`, { username: storedUsername });
        setUserID(userResponse.data.id);

        const displayResponse = await axios.post(`${API_URL}get-display`, { user_id: userResponse.data.id });
        setDisplay(displayResponse.data[0].display_name);

        const groupResponse = await axios.post(`${API_URL}get-all-groups-for-user`, { username: storedUsername });
        if (groupResponse && groupResponse.data) {

          const groupsWithPerms = groupResponse.data.filter(group => group.can_modify_chore === 1);

          if (groupsWithPerms.length > 0){
            const transformedGroupData = groupsWithPerms.map(group => ({
              label: group.group_name,
              value: group.group_id,
            }));
            
            setGroupDropdownData([{ label: 'Personal', value: -1 }, ...transformedGroupData]);

            // fetch group members for each group -KK
            const memberPromises = groupsWithPerms.map(async group => {
              const memberResponse = await axios.get(`${API_URL}get-group-members`, {
                params: { group_id: group.group_id },
              });
              return {
                group_id: group.group_id,
                members: memberResponse.data.map(member => ({
                  label: member.display_name,
                  value: member.user_id,
                })),
              };
            });
            const allGroupMembers = await Promise.all(memberPromises);
            setAssignmentDropdownData(allGroupMembers);
          }
        }
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getUsername();
  }, []);

  // Function to handle rotation switch toggle - AT
  const handleRotationToggle = async (value) => {
    setRotationEnabled(value);
  };

  // Add the chore to the database
  // (gets called when the "add chore" button is pressed) -KK
  const addChore = async () => {
    try {
      // add the chore to the database -KK
      if(selectedGroup.label == 'Personal'){
        try{
          await axios.post(`${API_URL}add-chore`, {
            chore_name: choreName,
            username,
            recurrence: selectedRec.value
          });
          // loop through tasks and add each one to the db -KK
          await Promise.all(tasks.map(task_name =>
            axios.post(`${API_URL}add-task`, { chore_name: choreName, task_name, username })
          ));
        } catch (error) {
            Alert.alert("Error: ", error.response.data.message);
        }
      } else{
        // add the group chore to the database -KK
        try{
          await axios.post(`${API_URL}add-group-chore`, { 
            group_chore_name: choreName,
            assign_to: assign_to.value,
            recurrence: selectedRec.value,
            group_id: selectedGroup.value,
            rotation_enabled: rotationEnabled,
            username: username
          });

          await Promise.all(tasks.map(group_task_name =>
            axios.post(`${API_URL}add-group-task`, { group_chore_name: choreName, group_task_name, group_id: selectedGroup.value, username: username })
          ));
        } catch (error) {
          Alert.alert("Error: ", error.response.data.message);
        }
      }

      // reset everything -KK
      setChoreName('');
      setNewTask('');
      const tempSelectedGroupId = selectedGroup.value;
      setSelectedRec(initialRec);
      setRotationEnabled(false);  // - AT
      setSelectedGroup(initialGroup);
      setTasks([]);

      // exit and go back to home -KK
      //navigation.goBack();  
      navigation.navigate('HomeMain', {
        needToLoad: true, // tells home page to reload collapsible  -MH
        groupEdited: tempSelectedGroupId, // group id or -1 if personal  -MH
      });

    } catch (error) {
      console.error("Error adding chore:", error);
    }
  };

  // Adds the task entered into the input box to the task list
  // These will only get added to the db after the "add chore" button is pressed -KK
  const addTask = () => {
    if (!newTask.trim()) { return; }

    if (!tasks.includes(newTask)) {
      setTasks([...tasks, newTask]);
      setNewTask('');
    } else {
      Alert.alert("Error: ", 'This task already exists for this chore.'); 
    }
  };

  // Delete task from the task list  -MH
  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index)); // keep all tasks except the one at 'index'
  };

  // open Preset Menu page above current page
  const openPresetMenu = () => {
    navigation.navigate('PresetMenu');
  };

  // used to get preset choreName and recurrence
  const route = useRoute();
  
  useEffect(() => {
    setLoading(true); // start loading
    const timer = setTimeout(() => {
      if (route.params?.choreName) {
        setChoreName(route.params.choreName);
      }
      if (route.params?.selectedRec) {
        setSelectedRec(route.params.selectedRec);
      }
      setSelectedGroup(initialGroup);
      setRotationEnabled(false);

      setLoading(false); // stop loading
    }, 500); // Delay of 0.5 second
  
    return () => clearTimeout(timer); // Cleanup timeout when component unmounts
  }, [route.params?.choreName, route.params?.selectedRec]);

  // ---------- Page Content ----------
  return (
    <View style={styles.content}>
      {loading ? (
        <LoadingVisual />
      ) : (
      <>
        <View style={styles.formContainer}>
        {/* Chore Name Input */}
        <Text style={styles.label}>Chore Name:</Text>
        <TextInput
          style={styles.choreNameInput}
          placeholder="Enter Chore Name . . ."
          placeholderTextColor={theme.text3}
          value={choreName}
          selectionColor={theme.text2}
          onChangeText={setChoreName}
        />

        <UsePresetButton
          onClick={openPresetMenu}
        />

        {/* Group Dropdown */}
        <Text style={styles.label}>Group:</Text>
        <Dropdown
          label="Select Group"
          data={groupDropdownData}
          onSelect={(group) => {
            setSelectedGroup(group);
            setAssignment(initialAssignment);
          }}
          initialValue={initialGroup}
        />

        {/* Assignment Dropdown */}
        {selectedGroup.value !== -1 && (
          <>
            <Text style={styles.label}>Assignment:</Text>
            <Dropdown
              label="Assign to Member"
              data={assignmentDropdownData.find((group) => group.group_id === selectedGroup.value).members || []} 
              onSelect={setAssignment}
              initialValue={initialAssignment}
            />
          </>
        )}

        {/* Recurrence Dropdown */}
        <Text style={styles.label}>Recurrence:</Text>
        <Dropdown
          label="Select Item"
          data={recDropdownData}
          onSelect={setSelectedRec}
          initialValue={selectedRec}
        />
        
        {/* Conditional Rotation Switch if Recurrence Selected - AT */}
        {selectedGroup.value !== -1 && selectedRec.value !== 'Just Once' && (
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Rotate Assignment: </Text>
            <Switch
              isOn={rotationEnabled}
              onToggle={handleRotationToggle}
            />
          </View>
        )}

        {/* Tasks */}
        <Text style={styles.label}>Tasks:</Text>

        {/* Show task list  -MH */}
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
            <Ionicons name={"add-outline"} size={25} color={theme.white} />

            <Text style={styles.addChoreButtonText}> Add Chore</Text>
          </TouchableOpacity>
        </View>
        </>
    )}
    </View>
  );
};


export default NewChoreScreen;