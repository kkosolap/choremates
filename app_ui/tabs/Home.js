// Home.js

import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, TouchableWithoutFeedback, Animated, } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store'; 

import createStyles from '../style/styles';
import { useTheme } from '../style/ThemeProvider';
import { TabHeader } from '../components/headers.js';
import { ChoreBlock } from '../components/blocks.js';
import { DropdownComponent } from '../components/dropdown.js';


import axios from 'axios';
import { API_URL } from '../config';


// header and page content
const HomeScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();

  const [selectedScreen, setSelectedScreen] = useState('Home'); // Track selected screen

  // Dropdown options for the home screens
  const screenOptions = [
    { label: 'My Home Screen', value: 'Home' },
    { label: 'Another Home Screen', value: 'AnotherHome' },
    { label: 'Third Home Screen', value: 'ThirdHome' },
  ];

  const handleScreenSelect = (screen) => {
    setSelectedScreen(screen);
    // Navigate based on selected screen
    switch (screen) {
      case 'Home':
        navigation.navigate('Home');
        break;
      case 'AnotherHome':
        navigation.navigate('AnotherHome');
        break;
      case 'ThirdHome':
        navigation.navigate('ThirdHome');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.screen}>
      {/* Dropdown to select between different screens */}
      <DropdownComponent 
        data={screenOptions}
        onChange={handleScreenSelect}
        placeholder="Home"
        customStyle={styles.customDropdown}
      />

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
      acc[task.chore_name].tasks.push(task.task_name);
    }
    return acc;
  }, {});

  // fetch the task list for display -KK
  const refresh = async (user) => {
    await axios.post(`${API_URL}get-chores-data`, { username: user }).then((response) => setData(response.data))
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