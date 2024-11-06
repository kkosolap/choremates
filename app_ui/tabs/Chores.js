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
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState({});     // tracks which chores are visible -KK
  const [edit, setEdit] = useState(null);         // tracks which chores are being edited -KK
  const [task_name, setNewTask] = useState('');   // contains the text for the new task -KK
  const [username, setUsername] = useState(null);

  // calls refresh whenever the screen is in focus -KK
  useFocusEffect(
    useCallback(() => { 
      const getUsername = async () => {   // get the username from securestore -KK
        const storedUsername = await SecureStore.getItemAsync('username');
        if (storedUsername) {
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

  // group the tasks by chore -KK
  const groupedTasks = data.reduce((acc, task) => {
    if (!acc[task.chore_name]) {
      acc[task.chore_name] = {
          is_completed: task.chore_is_completed,
          is_overdue: task.chore_is_overdue, // track overdue status - AT
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

  // toggle the visibility of tasks for a chore -KK
  const toggleVisibility = (chore_name) => {
    setVisible((prevState) => ({
      ...prevState,
      [chore_name]: !prevState[chore_name],
    }));

    // set edit to null when toggling visibility  -MH
    setEdit(null);
  };

  // add task button -KK
  const addTask = (chore_name) => {
    axios.post(`${API_URL}add_task`, { chore_name, task_name, username}).then((response) => {
      setNewTask('');          // reset the input -KK
      refresh(username);       // refresh ltask list after updating -KK
    })
    .catch((error) => console.error(error));
  };

  // delete task button -KK
  const deleteTask = async (chore_name, task_name) => {
    await axios.post(`${API_URL}delete_task`, { chore_name, task_name, username}).then((response) => {
        refresh(username);     // refresh task list after updating -KK
      })
      .catch((error) => console.error(error));
  };

  // fetch the task list for display -KK
  const refresh = async (user) => {
    await axios.post(`${API_URL}get_chores_data`, { username: user }).then((response) => setData(response.data))
      .catch((error) => console.error(error));
  };


  // page content -MH
  return (
    <View style={styles.content}>

      {Object.keys(groupedTasks).map((chore_name) => (
        <ActiveChoreBlock
          user={username}
          key={chore_name}
          choreName={chore_name}
          tasks={groupedTasks[chore_name].tasks}
          completed={groupedTasks[chore_name].is_completed}
          visible={visible[chore_name]}
          onToggleVisibility={toggleVisibility}
          onEdit={() => setEdit(edit === chore_name ? null : chore_name)}
          onDelete={deleteTask}
          isEditing={edit === chore_name}
          newTask={task_name}
          setNewTask={setNewTask}
          onAddTask={addTask}
          refresh={refresh}
          isOverdue={groupedTasks[chore_name].is_overdue} // pass overdue status - AT
        />
      ))}

    </View>
  );
};

export default ChoresScreen;