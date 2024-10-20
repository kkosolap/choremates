// Chores.js

import { useEffect, useState } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import axios from 'axios';

import { API_URL } from '@env';
import colors from '../style/colors';
import styles from '../style/styles';
import { TabHeader } from '../components/headers.js';
import { ChoreBlock, KatChoreBlock } from '../components/blocks.js';
import showHelloPopup from '../components/hello.js';


// header and page content  -MH
const ChoresScreen = () => (
  <View style={styles.screen}>
    <TabHeader title="Weekly Chores" />
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ChoresDisplay />
    </ScrollView>
  </View>
);

// page content  -MH
const ChoresDisplay = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState({});   // tracks which chores are visible -KK
  const [edit, setEdit] = useState(null);       // tracks which chores are being edited -KK
  const [newTask, setNewTask] = useState('');   // contains the text for the new task -KK

  // gets called when the component loads
  useEffect(() => {
    refreshTasks();
  }, []);

  // group the tasks by chore -KK
  const groupedTasks = data.reduce((acc, task) => {
    if (!acc[task.chore_name]) {
      acc[task.chore_name] = [];
    }
    acc[task.chore_name].push({ id: task.id, task: task.task_name });
    return acc;
  }, {});

  // toggle the visibility for the chore -KK
  const toggleVisibility = (chore_name) => {
    setVisible((prevState) => ({
      ...prevState,
      [chore_name]: !prevState[chore_name],
    }));
  };

  // add task button -KK
  const addTask = (chore_name) => {
    axios.post(`${API_URL}add_task?chore_name=${chore_name}`, {
      task_name: newTask,
      user_id: 1,           // adjust later to the logged-in user -KK
    })
    .then((response) => {
      console.log(response.data);
      setNewTask('');       // reset the input -KK
      refreshTasks();       // refresh ltask list after updating -KK
    })
    .catch((error) => console.error(error));
  };

  // delete task button -KK
  const deleteTask = (chore_name, task) => {
    axios.delete(`${API_URL}delete_task?chore_name=${chore_name}&task_name=${task}`)
      .then((response) => {
        console.log(response.data);
        refreshTasks();     // refresh ltask list after updating -KK
      })
      .catch((error) => console.error(error));
  };

  // fetch the task list for display -KK
  const refreshTasks = () => {
    axios.get(API_URL + "get_tasks?user_id=1")
      .then((response) => setData(response.data))
      .catch((error) => console.error(error));
  };



  // ----- vals for testing -----
  const sampleChoreName = "this is a test chore lalala la lala la la la";
  const sampleTaskList = [
    { id: 1, task: 'step 1' },
    { id: 2, task: 'step 2' },
    { id: 3, task: 'step 3' },
  ];



  // page content -MH
  return (
    <View style={styles.content}>

      {Object.keys(groupedTasks).map((chore_name) => (

        <>

        <ChoreBlock
          key={chore_name}
          choreName={chore_name}
          tasks={groupedTasks[chore_name]}
          completed={false}                        // get actual value here
          visible={visible[chore_name]}
          onToggleVisibility={toggleVisibility}
          onEdit={() => setEdit(edit === chore_name ? null : chore_name)}
          onDelete={deleteTask}
          isEditing={edit === chore_name}
          newTask={newTask}
          setNewTask={setNewTask}
          onAddTask={addTask}
        />

        <KatChoreBlock
          key={chore_name}
          choreName={chore_name}
          tasks={groupedTasks[chore_name]}
          visible={visible[chore_name]}
          onToggleVisibility={toggleVisibility}
          onEdit={() => setEdit(edit === chore_name ? null : chore_name)}
          onDelete={deleteTask}
          isEditing={edit === chore_name}
          newTask={newTask}
          setNewTask={setNewTask}
          onAddTask={addTask}
        />

        </>

      ))}

    </View>
  );
};

export default ChoresScreen;
