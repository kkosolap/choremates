// Home.js

import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, Alert   } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import { API_URL } from '@env';
import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import { TabHeader } from '../components/headers.js';
import { ChoreBlock } from '../components/blocks.js';
import AddChoreScreen from '../components/AddChore.js';


// header and page content
const HomeScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      <TabHeader title="My Home" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <HomeDisplay />
      </ScrollView>
    </View>
  );
};

// page content
const HomeDisplay = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const scale = React.useRef(new Animated.Value(1)).current;
  const navigation = useNavigation(); // get the navigation object
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState({});   // tracks which chores are visible -KK
  const [edit, setEdit] = useState(null);       // tracks which chores are being edited -KK
  const [newTask, setNewTask] = useState('');   // contains the text for the new task -KK

  // add chore button press
  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.8, // scale down to 80%
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  // add chore button release
  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1, // scale back to original size
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  // open NewChore page above current page
  const openAddChore = () => {
    navigation.navigate('NewChore');
  };

  // gets called when the component loads
  useEffect(() => {
    refreshTasks();
  }, []);

  // group the tasks by chore -KK
  const groupedTasks = data.reduce((acc, task) => {
    if (!acc[task.chore_name]) {
      acc[task.chore_name] = {
          is_completed: task.chore_is_completed,
          tasks: []
      };
    }
    if (task.task_name) { // only push if task_name is non-null -MH
      acc[task.chore_name].tasks.push({ id: task.id, task: task.task_name });
    }
    return acc;
  }, {});

  // toggle the visibility of tasks for a chore -KK
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
    axios.get(API_URL + "get_chores?user_id=1")
      .then((response) => setData(response.data))
      .catch((error) => console.error(error));
  };

  return (
    <View style={styles.content}>
      {/* AddChore button */}
      <TouchableWithoutFeedback
        onPress={openAddChore}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
          <Icon name="add" size={40} color="#fff" />
        </Animated.View>
      </TouchableWithoutFeedback>

      <Text style={styles.buttonDescription}>
        add chore
      </Text>

      {/* All House Chores Heading */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionHeading}>
          All House Chores
        </Text>

        {/* Horizontal Line */}
        <View style={styles.horizontalLine} />

        {/* Display all Chores */}
        <View style={styles.choresList}>
          
          {Object.keys(groupedTasks).map((chore_name) => (
            <ChoreBlock
              key={chore_name}
              choreName={chore_name}
              tasks={groupedTasks[chore_name].tasks}
              completed={groupedTasks[chore_name].is_completed}
              visible={visible[chore_name]}
              onToggleVisibility={toggleVisibility}
              onEdit={() => setEdit(edit === chore_name ? null : chore_name)}
              onDelete={deleteTask}
              isEditing={edit === chore_name}
              newTask={newTask}
              setNewTask={setNewTask}
              onAddTask={addTask}
            />
          ))}

        </View>
      </View>

      

    </View>
  );
};

export default HomeScreen;