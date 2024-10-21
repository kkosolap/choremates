// Chores.js

import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import axios from 'axios';

import { API_URL } from '@env';
import colors from '../style/colors';
import styles from '../style/styles';
import { TabHeader } from '../components/headers.js';
import { ChoreBlock } from '../components/blocks.js';
import showHelloPopup from '../components/hello.js';



// header and page content  -MH
const ChoresScreen = () => (
  <View style={styles.screen}>
    <TabHeader title="Weekly Chores" />
    <ChoresDisplay />
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


  // page content -MH
  return (
    <View style={styles.content}>

      {Object.keys(groupedTasks).map((chore_name) => (
        <View key={chore_name} style={styles.choreContainer}>
          {/* chore heading and edit button -KK */}
          <View style={styles.choreHeader}>
            <TouchableOpacity onPress={() => toggleVisibility(chore_name)}>
              <Text style={styles.subtitle}>{chore_name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEdit(edit === chore_name ? null : chore_name)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* list tasks for each chore -KK */}
          {visible[chore_name] && groupedTasks[chore_name].map(({ id, task }) => (
            <View key={id} style={styles.taskContainer}>
              <Text style={styles.taskText}>- {task}</Text>
              {edit === chore_name && (
                <TouchableOpacity onPress={() => deleteTask(chore_name, task)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* text input for adding a task -KK */}
          {edit === chore_name && (
            <View style={styles.addTaskContainer}>
              <TextInput
                style={styles.addTaskInput}
                placeholder="add a new task"
                value={newTask}
                onChangeText={setNewTask}
              />
              <Button title="Add Task" onPress={() => addTask(chore_name)} />
            </View>
          )}
        </View>
      ))}

    </View>
  );
};

export default ChoresScreen;
