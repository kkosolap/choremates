// Home.js

import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, Alert, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'; 

import createStyles from '../style/styles';
import { useTheme } from '../style/ThemeProvider';
import { TabHeader } from '../components/headers.js';
import { ChoreBlock } from '../components/blocks.js';

import axios from 'axios';
import { API_URL } from '../config';


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
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState({});  // tracks which chores are visible -KK
  const [edit, setEdit] = useState(null);       // tracks which chores are being edited -KK
  const [newTask, setNewTask] = useState('');   // contains the text for the new task -KK

  // calls refresh whenever the screen is in focus -KK
  useFocusEffect(
    useCallback(() => {
      const getUsername = async () => {   // get the username from securestore -KK
        const storedUsername = await SecureStore.getItemAsync('username');
        if (storedUsername) { 
          refresh(storedUsername); 
        } else {
          console.error("UI Home.js: Username not found in SecureStore.");
        }
      };
      getUsername();
    }, [])
  );

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

  // open ChoreDetails page above current page
  const openChoreDetails = (chore_name, grouped_tasks, recurrence) => {
    navigation.navigate('ChoreDetails', {
      routed_chore_name: chore_name,
      routed_tasks: grouped_tasks,
      routed_recurrence: recurrence,
    });
  };

  // group the tasks by chore -KK
  const groupedTasks = data.reduce((acc, task) => {
    if (!acc[task.chore_name]) {
      acc[task.chore_name] = {
          is_completed: task.chore_is_completed,
          recurrence: task.chore_recurrence,
          tasks: []
      };
    }
    if (task.task_name) { // only push if task_name is non-null -MH
      //acc[task.chore_name].tasks.push({ id: task.id, task: task.task_name });
      acc[task.chore_name].tasks.push(task.task_name);
    }
    return acc;
  }, {});

  // fetch the task list for display -KK
  const refresh = async (user) => {
    await axios.post(`${API_URL}get_chores_data`, { username: user }).then((response) => setData(response.data))
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
              onOpenChoreDetails={() => openChoreDetails(
                chore_name,
                groupedTasks[chore_name].tasks,
                groupedTasks[chore_name].recurrence
              )}
              recurrence={groupedTasks[chore_name].recurrence}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;