// Chores.js

import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, ScrollView, } from 'react-native';
import * as SecureStore from 'expo-secure-store'; 

import createStyles from '../style/styles';
import { useTheme } from '../style/ThemeProvider';
import { TabHeader } from '../components/headers.js';
import { ActiveChoreBlock, ActiveGroupChoreBlock } from '../components/blocks.js';
import { SectionTabButton } from '../components/buttons.js';

import axios from 'axios';
import { API_URL } from '../config';


// header and page content  -MH
const ChoresScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      <TabHeader title="Chores" />
      <ChoresDisplay />
    </View>
  );
};

// page content  -MH
const ChoresDisplay = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [username, setUsername] = useState(null);
  
  const [visibleTasks, setVisibleTasks] = useState({}); // tracks which chores have visible tasks -MH
  const [editing, setEditing] = useState(null); // tracks which chores are being edited -KK
  const [showToDo, setShowToDo] = useState(true); // tracks whether you're on the To-Do or Completed tab

  const [personalData, setPersonalData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [task_name, setNewTask] = useState('');  


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

  const groupedPersonalTasksCompleted = {};
  const groupedPersonalTasksToDo = {};

  personalData.forEach((task) => {
    // Safety check for null/undefined tasks
    if (!task || !task.chore_name) {
      console.log("Chores.js: found null task in personalData")
      return
    };

    // Group based on chore completion
    const targetGroup = task.chore_is_completed ? groupedPersonalTasksCompleted : groupedPersonalTasksToDo;

    // If the chore name doesn't exist in the target group, initialize it
    if (!targetGroup[task.chore_name]) {
      targetGroup[task.chore_name] = {
        is_completed: task.chore_is_completed,
        tasks: []
      };
    }

    // Only add tasks if task_name is non-null
    if (task.task_name) {
      targetGroup[task.chore_name].tasks.push({
        id: task.id,
        task: task.task_name,
        completed: task.task_is_completed });
    }
  });

  const groupedGroupTasksCompleted = {};
  const groupedGroupTasksToDo = {};

  groupData.forEach((task) => {
    // Safety check for null/undefined tasks
    if (!task || !task.group_chore_name) {
      console.log("Chores.js: found null task in groupData")
      return
    };

    // Group based on chore completion
    const targetGroup = task.chore_is_completed ? groupedGroupTasksCompleted : groupedGroupTasksToDo;

    // If the chore name doesn't exist in the target group, initialize it
    if (!targetGroup[task.group_chore_name]) {
      targetGroup[task.group_chore_name] = {
        group_id: task.group_id,
        is_completed: task.chore_is_completed,
        group_tasks: []
      };
    }

    // Only add tasks if task_name is non-null
    if (task.group_task_name) {
      targetGroup[task.group_chore_name].group_tasks.push({
        id: task.id,
        task: task.group_task_name,
        completed: task.task_is_completed });
    }
  });


  // toggle the visibility of tasks for a chore -KK
  const toggleVisibility = (chore_name) => {
    setVisibleTasks((prevState) => ({
      ...prevState,
      [chore_name]: !prevState[chore_name],
    }));

    // set edit to null when toggling visibility -MH
    setEditing(null);
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

      <View style={styles.choreSectionTabs}>
        <SectionTabButton
          label="To-Do"
          selected={showToDo}
          onClick={() => setShowToDo(true)}
        />
        <SectionTabButton
          label="Completed"
          selected={!showToDo}
          onClick={() => setShowToDo(false)}
        />
      </View>

      <View style={styles.choreSection}>
        {showToDo ? (
          // ----- To-Do Tab -----
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.centeredContent}
          >
            {Object.keys(groupedPersonalTasksToDo).length > 0 || Object.keys(groupedGroupTasksToDo).length > 0  ? (
              // If there are Chores To-Do
              <>
              {/* personal chores */}
              {Object.keys(groupedPersonalTasksToDo).map((chore_name) => (
                <ActiveChoreBlock
                  user={username}
                  key={chore_name}
                  choreName={chore_name}
                  tasks={groupedPersonalTasksToDo[chore_name].tasks}
                  completed={groupedPersonalTasksToDo[chore_name].is_completed}
                  visible={visibleTasks[chore_name]}
                  onToggleVisibility={toggleVisibility}
                  onEdit={() => setEditing(editing === chore_name ? null : chore_name)}
                  onDelete={deleteTask}
                  isEditing={editing === chore_name}
                  newTask={task_name}
                  setNewTask={setNewTask}
                  onAddTask={addTask}
                  refresh={refresh}
                />
              ))}

              {/* group chores */}
              {Object.keys(groupedGroupTasksToDo).map((group_chore_name) => (
                <ActiveGroupChoreBlock
                  user={username}
                  key={group_chore_name}
                  group_id={groupedGroupTasksToDo[group_chore_name].group_id}
                  choreName={group_chore_name}
                  tasks={groupedGroupTasksToDo[group_chore_name].group_tasks}
                  completed={groupedGroupTasksToDo[group_chore_name].is_completed}
                  visible={visibleTasks[group_chore_name]}
                  onToggleVisibility={toggleVisibility}
                  onEdit={() => setEditing(editing === group_chore_name ? null : group_chore_name)}
                  onDelete={deleteGroupTask}
                  isEditing={editing === group_chore_name}
                  newTask={task_name}
                  setNewTask={setNewTask}
                  onAddTask={addGroupTask}
                  refresh={refresh}
                />
              ))}
              </>
            ) : (
              // If NO chores To-Do
              <View style={styles.emptyChoresSection}>
                <Text style={styles.emptySectionText}>
                  No Chores To-Do!
                </Text>
              </View>
            )}
          </ScrollView>
        ) : (
          // ----- Completed Tab -----
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.centeredContent}
          >
            {Object.keys(groupedPersonalTasksCompleted).length > 0 || Object.keys(groupedGroupTasksCompleted).length > 0  ? (
              // If there are Completed Chores
              <>
              {/* personal chores */}
              {Object.keys(groupedPersonalTasksCompleted).map((chore_name) => (
                <ActiveChoreBlock
                  user={username}
                  key={chore_name}
                  choreName={chore_name}
                  tasks={groupedPersonalTasksCompleted[chore_name].tasks}
                  completed={groupedPersonalTasksCompleted[chore_name].is_completed}
                  visible={visibleTasks[chore_name]}
                  onToggleVisibility={toggleVisibility}
                  onEdit={() => setEditing(editing === chore_name ? null : chore_name)}
                  onDelete={deleteTask}
                  isEditing={editing === chore_name}
                  newTask={task_name}
                  setNewTask={setNewTask}
                  onAddTask={addTask}
                  refresh={refresh}
                />
              ))}

              {/* group chores */}
              {Object.keys(groupedGroupTasksCompleted).map((group_chore_name) => (
                <ActiveGroupChoreBlock
                  user={username}
                  key={group_chore_name}
                  group_id={groupedGroupTasksCompleted[group_chore_name].group_id}
                  choreName={group_chore_name}
                  tasks={groupedGroupTasksCompleted[group_chore_name].group_tasks}
                  completed={groupedGroupTasksCompleted[group_chore_name].is_completed}
                  visible={visibleTasks[group_chore_name]}
                  onToggleVisibility={toggleVisibility}
                  onEdit={() => setEditing(editing === group_chore_name ? null : group_chore_name)}
                  onDelete={deleteGroupTask}
                  isEditing={editing === group_chore_name}
                  newTask={task_name}
                  setNewTask={setNewTask}
                  onAddTask={addGroupTask}
                  refresh={refresh}
                />
              ))}
              </>
            ) : (
              // If NO Completed Chores
              <View style={styles.emptyChoresSection}>
                <Text style={styles.emptySectionText}>
                  No Completed Chores
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

    </View>
  );
};

export default ChoresScreen;