// Home.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, TouchableWithoutFeedback, Animated, TouchableOpacity, } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Collapsible from 'react-native-collapsible';

import * as SecureStore from 'expo-secure-store'; 

import createStyles from '../style/styles';
import { useTheme } from '../style/ThemeProvider';
import { TabHeader } from '../components/headers.js';
import { ChoreBlock } from '../components/blocks.js';
import Dropdown from '../components/dropdown.js';

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
  const [username, setUsername] = useState(null);
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const scale = React.useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  
  const [personalData, setPersonalData] = useState([]);
  const [groupData, setGroupData] = useState([]);

  // state to control visibility of three-dot button -VA
  const [showThreeDots, setShowThreeDots] = useState(false);
  const handleTouchablePress = () => {
    setShowThreeDots(!showThreeDots); // Toggle visibility of three-dot button
  };

  // track which sections are collapsed -MH
  const [personalCollapsed, setPersonalCollapsed] = useState(true);
  const togglePersonalCollapse = () => {
    setPersonalCollapsed(!personalCollapsed);
  };
  const [isGroupCollapsed, setGroupCollapsed] = useState({});
  const toggleGroupCollapse = (group_id) => {
    setGroupCollapsed((prevState) => ({
      ...prevState,
      [group_id]: !prevState[group_id],
    }));
  };

  useEffect(() => {
    if (groupData.length > 0) {
      // Set initial collapse state for each group to true
      const initialCollapsedState = groupData.reduce((acc, group) => {
        acc[group.group_id] = true; // Default collapsed state is true
        return acc;
      }, {});
      setGroupCollapsed(initialCollapsedState);
    }
  }, [groupData]);

  // calls refresh whenever the screen is in focus -KK
  useFocusEffect(
    useCallback(() => {
      const getUsername = async () => {   // get the username from securestore -KK
        const storedUsername = await SecureStore.getItemAsync('username');
        if (storedUsername) { 
          setUsername(storedUsername); 
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
  const openChoreDetails = (chore_name, grouped_tasks, recurrence, group_id) => {
    navigation.navigate('ChoreDetails', {
      routed_chore_name: chore_name,
      routed_tasks: grouped_tasks,
      routed_recurrence: recurrence,
      routed_group_id: group_id
    });
  };

  // group the personal tasks by chore -KK
  const groupedPersonalTasks = personalData.reduce((acc, task) => {
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

  // group the group tasks by chore and then by group -KK
  const groupedGroupTasks = groupData.reduce((acc, group_task) => {
    if (group_task && group_task.group_id) {
      if (!acc[group_task.group_id]) {
        acc[group_task.group_id] = {
          group_name: group_task.group_name,
          chores: {},
        };
      }
      if (!acc[group_task.group_id].chores[group_task.group_chore_name]) {
        acc[group_task.group_id].chores[group_task.group_chore_name] = {
          group_id: group_task.group_id,
          is_completed: group_task.chore_is_completed,
          recurrence: group_task.chore_recurrence,
          group_tasks: [],
        };
      }
      if (group_task.group_task_name) { // only push if task_name is non-null
        acc[group_task.group_id].chores[group_task.group_chore_name].group_tasks.push(group_task.group_task_name);
      }
    }
    return acc;
  }, {});

  const refresh = async (user) => {
    // Fetch personal data
    await axios.post(`${API_URL}get-chores-data`, { username: user })
      .then((response) => setPersonalData(response.data))
      .catch((error) => console.error(error));
  
    // Get all groups for the user
    const response = await axios.post(`${API_URL}get-all-groups-for-user`, { username: user })
      .catch((error) => console.error(error));
  
    let allGroupData = [];
    const groupNameMap = {};
  
    // Fetch group data for each group and also get group names
    for (const group of response.data) {
      const group_id = group.group_id;
      
      // Fetch group tasks
      await axios.post(`${API_URL}get-group-chores-data-for-user`, { username: user, group_id })
        .then((response) => {
          allGroupData = [...allGroupData, ...response.data];
        })
        .catch((error) => console.error(error));
      
      // Fetch group name
      if (!groupNameMap[group_id]) {
        await axios.post(`${API_URL}get-group-name`, { group_id })
          .then((response) => {
            groupNameMap[group_id] = response.data.group_name;
          })
          .catch((error) => console.error(error));
      }
    }
  
    // Attach group names to group data
    const enrichedGroupData = allGroupData.map((group_task) => ({
      ...group_task,
      group_name: groupNameMap[group_task.group_id] || 'Unknown Group'
    }));
  
    setGroupData(enrichedGroupData);
  };


  // page content -MH
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

      {/* Old All House Chores Heading       ** to be deleted, but commented out temporarily for reference
      <View style={styles.contentSection}>
        <Text style={styles.sectionHeading}>
          All House Chores
        </Text>
        
        <View style={styles.horizontalLine} />
      </View>
      */}
      
      {/* Personal Chores */}
      <View style={styles.contentSection}>
        {/* Heading */}
        <TouchableWithoutFeedback onPress={togglePersonalCollapse}>
          <View style={styles.homeToggleButton}>
            <Text style={styles.sectionHeading}>
              Personal Chores
            </Text>
          </View>
        </TouchableWithoutFeedback>

        {/* Collapsible Content */}
        <Collapsible collapsed={personalCollapsed}>
          <View style={styles.choresList}>
            {Object.keys(groupedPersonalTasks).map((chore_name) => (
              <ChoreBlock
                key={chore_name}
                choreName={chore_name}
                tasks={groupedPersonalTasks[chore_name].tasks}
                onOpenChoreDetails={() => openChoreDetails(
                  chore_name,
                  groupedPersonalTasks[chore_name].tasks,
                  groupedPersonalTasks[chore_name].recurrence,
                  -1
                )}
                recurrence={groupedPersonalTasks[chore_name].recurrence}
              />
            ))}
          </View>
        </Collapsible>
      </View>

      {/* Group Chores */}
      {Object.keys(groupedGroupTasks).map((group_id) => (
        <View key={group_id} style={styles.contentSection}>
          {/* Heading */}
          <TouchableWithoutFeedback onPress={() => toggleGroupCollapse(group_id)}>
            <View style={styles.homeToggleButton}>
              <Text style={styles.sectionHeading}>
                {groupedGroupTasks[group_id].group_name}
              </Text>
            </View>
          </TouchableWithoutFeedback>

          {/* Collapsible Content */}
          <Collapsible collapsed={isGroupCollapsed[group_id]}>
            <View style={styles.choresList}>
              {Object.keys(groupedGroupTasks[group_id].chores).map((group_chore_name) => (
                <ChoreBlock
                  key={group_chore_name}
                  choreName={group_chore_name}
                  tasks={groupedGroupTasks[group_id].chores[group_chore_name].group_tasks}
                  onOpenChoreDetails={() => openChoreDetails(
                    group_chore_name,
                    groupedGroupTasks[group_id].chores[group_chore_name].group_tasks,
                    groupedGroupTasks[group_id].chores[group_chore_name].recurrence,
                    groupedGroupTasks[group_id].chores[group_chore_name].group_id
                  )}
                  recurrence={groupedGroupTasks[group_id].chores[group_chore_name].recurrence}
                />
              ))}
            </View>
          </Collapsible>
        </View>
      ))}

    </View>
  );
};

export default HomeScreen;