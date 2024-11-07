// Chores.js

import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, } from 'react-native';
import * as SecureStore from 'expo-secure-store'; 

import createStyles from '../style/styles';
import { useTheme } from '../style/ThemeProvider';
import { TabHeader } from '../components/headers.js';
import { ActiveChoreBlock } from '../components/blocks.js';

import axios from 'axios';
import { API_URL } from '../config';


// header and page content  -MH
const ChoresScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      <TabHeader title="Weekly Chores" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ChoresDisplay />
      </ScrollView>
    </View>
  );
};

// page content  -MH
const ChoresDisplay = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [personalData, setPersonalData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [visible, setVisible] = useState({});     // tracks which chores are visible -KK
  const [edit, setEdit] = useState(null);         // tracks which chores are being edited -KK
  const [task_name, setNewTask] = useState('');   // contains the text for the new task -KK
  const [username, setUsername] = useState(null);

  // calls refresh whenever the screen is in focus -KK
  useFocusEffect(
    useCallback(() => { 
      const getUsername = async () => {   // get the username from securestore -KK
        const storedUsername = await SecureStore.getItemAsync('username');
        if (storedUsername){
          setUsername(storedUsername); 
          refresh(storedUsername);
        } else {
          console.error("UI Chores.js: Username not found in SecureStore.");
        }
      };
      getUsername();
    }, 
    [])
  );

  // group the personal tasks by chore -KK
  const groupedPersonalTasks = personalData.reduce((acc, task) => {
    if (!acc[task.chore_name]) {
      acc[task.chore_name] = {
          is_completed: task.chore_is_completed,
          tasks: []
      };
      acc[task.chore_name] = {
          is_completed: task.chore_is_completed,
          tasks: []
      };
    }
    if (task.task_name) { // only push if task_name is non-null -MH
      acc[task.chore_name].tasks.push({ id: task.id, task: task.task_name, completed: task.task_is_completed });
    }
    return acc;
  }, {});

  // group the group tasks by chore and then by group -KK
  const groupedGroupTasks = groupData.reduce((acc, task) => {
    // still need to write this lol
    return acc;
  }, {});

  // toggle the visibility of tasks for a chore -KK
  const toggleVisibility = (chore_name) => {
    setVisible((prevState) => ({
      ...prevState,
      [chore_name]: !prevState[chore_name],
    }));

    // set edit to null when toggling visibility -MH
    setEdit(null);
  };

  // add task button -KK
  const addTask = (chore_name) => {
    axios.post(`${API_URL}add-task`, { chore_name, task_name, username}).then((response) => {
      setNewTask('');          // reset the input -KK
      refresh(username);       // refresh ltask list after updating -KK
    })
    .catch((error) => console.error(error));
  };

  // delete task button -KK
  const deleteTask = async (chore_name, task_name) => {
    await axios.post(`${API_URL}delete-task`, { chore_name, task_name, username}).then((response) => {
        refresh(username);     // refresh task list after updating -KK
      })
      .catch((error) => console.error(error));
  };

  // fetch the task list for display -KK
  const refresh = async (username) => {
    // get all the personal chore data for the user -KK
    await axios.post(`${API_URL}get-chores-data`, { username }).then((response) => setPersonalData(response.data))
    .catch((error) => console.error(error)); 

    // get all the group chore ids for the user -KK
    const response = await axios.post(`${API_URL}get-all-groups-for-user`, { username }).catch((error) => console.error(error));

    // get the group chore data for each group -KK
    for (const group of response.data) {
      const group_id = group.group_id; 
      console.log("UI Chores.js: group_id is " + group_id);
      await axios.post(`${API_URL}get-group-chores-data-for-user`, { username, group_id })
          .then((response) => setGroupData(response.data))
          .catch((error) => console.error(error));
    }
    console.log("UI Chores.js: group chore data is " + groupData);
  };


  // page content -MH
  return (
    <View style={styles.content}>

      {Object.keys(groupedPersonalTasks).map((chore_name) => (
        <ActiveChoreBlock
          user={username}
          key={chore_name}
          choreName={chore_name}
          tasks={groupedPersonalTasks[chore_name].tasks}
          completed={groupedPersonalTasks[chore_name].is_completed}
          visible={visible[chore_name]}
          onToggleVisibility={toggleVisibility}
          onEdit={() => setEdit(edit === chore_name ? null : chore_name)}
          onDelete={deleteTask}
          isEditing={edit === chore_name}
          newTask={task_name}
          setNewTask={setNewTask}
          onAddTask={addTask}
          refresh={refresh}
        />
      ))}

    </View>
  );
};

export default ChoresScreen;