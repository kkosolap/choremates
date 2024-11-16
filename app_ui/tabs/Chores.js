// Chores.js

import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, } from 'react-native';
import * as SecureStore from 'expo-secure-store'; 

import createStyles from '../style/styles';
import { useTheme } from '../style/ThemeProvider';
import { TabHeader } from '../components/headers.js';
import { ActiveChoreBlock, ActiveGroupChoreBlock } from '../components/blocks.js';

import axios from 'axios';
import { API_URL } from '../config';


// header and page content  -MH
const ChoresScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      <TabHeader title="Chores" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ChoresDisplay />
      </ScrollView>
    </View>
  );
};

// page content  -MH
const ChoresDisplay = () => {
  const [username, setUsername] = useState(null);
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [visible, setVisible] = useState({});     // tracks which chores are visible -KK
  const [edit, setEdit] = useState(null);         // tracks which chores are being edited -KK

  const [personalData, setPersonalData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [task_name, setNewTask] = useState('');  
  const [groupColors, setGroupColors] = useState({});


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
  const groupedGroupTasks = groupData.reduce((acc, group_task) => {
    if(group_task && group_task.group_chore_name){
      if (!acc[group_task.group_chore_name]) {
        acc[group_task.group_chore_name] = {
            group_id: group_task.group_id,
            is_completed: group_task.chore_is_completed,
            group_tasks: []
        };
      }
      if (group_task.group_task_name) { // only push if task_name is non-null -MH
        acc[group_task.group_chore_name].group_tasks.push({ 
          id: group_task.id, 
          group_task: group_task.group_task_name, 
          completed: group_task.task_is_completed 
        });
      }
      return acc;
    }
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

  const addGroupTask = (group_chore_name, group_id) => {
    axios.post(`${API_URL}add-group-task`, { 
      group_chore_name, 
      group_task_name: task_name, 
      group_id
    }).then((response) => {
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

  const deleteGroupTask = async (group_chore_name, group_task_name, group_id) => {
    await axios.post(`${API_URL}delete-group-task`, { 
      group_chore_name, 
      group_task_name, 
      group_id
    }).then(refresh(username)).catch((error) => console.error(error)); // refresh task list after updating -KK
  };

  // fetch the task list for display -KK
  const refresh = async (username) => {
    // get all the personal chore data for the user -KK
    await axios.post(`${API_URL}get-chores-data`, { username }).then((response) => setPersonalData(response.data))
    .catch((error) => console.error(error)); 

    // get all the group chore ids for the user -KK
    const response = await axios.post(`${API_URL}get-all-groups-for-user`, { username }).catch((error) => console.error(error));

    let allGroupData = []; 

    // get the group chore data for each group
    for (const group of response.data) {
      const group_id = group.group_id; 
      await axios.post(`${API_URL}get-group-chores-data-for-user`, { username, group_id })
        .then((response) => {
          allGroupData = [...allGroupData, ...response.data]; 
        })
        .catch((error) => console.error(error));
    }

    setGroupData(allGroupData); 
  };


  // page content -MH
  return (
    <View style={styles.content}>

      {/* personal chores */}
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

      {/* group chores */}
      {Object.keys(groupedGroupTasks).map((group_chore_name) => (
        <ActiveGroupChoreBlock
          user={username}
          key={group_chore_name}
          group_id={groupedGroupTasks[group_chore_name].group_id}
          choreName={group_chore_name}
          tasks={groupedGroupTasks[group_chore_name].group_tasks}
          completed={groupedGroupTasks[group_chore_name].is_completed}
          visible={visible[group_chore_name]}
          onToggleVisibility={toggleVisibility}
          onEdit={() => setEdit(edit === group_chore_name ? null : group_chore_name)}
          onDelete={deleteGroupTask}
          isEditing={edit === group_chore_name}
          newTask={task_name}
          setNewTask={setNewTask}
          onAddTask={addGroupTask}
          refresh={refresh}
        />
      ))}
    </View>
  );
};

export default ChoresScreen;