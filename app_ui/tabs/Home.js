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
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Popover from 'react-native-popover-view';

import Dropdown from '../components/dropdown.js';

import axios from 'axios';
import { API_URL } from '../config';
import themes from '../style/colors.js';

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
  const [groupColor, setGroupColor] = useState(themes.green.main);        // need to change default color method once secure
  const [popoverVisible, setPopoverVisible] = useState(false);

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


  // Trying to get User ID here -VA


  const fetchUserId = async () => {
    try {
      const username = await SecureStore.getItemAsync('username');
      console.log("Username = " + username);

      if (username) {
        // console.log(`Making request to: ${API_URL}get-id`);

        const response = await axios.post(`${API_URL}get-id`, { username });
        const user_id = response.data.user_id;
        console.log("User ID = " + user_id);
        if (user_id) {
          return user_id;
        } else {
          console.error('User ID not found');
        }
      } else {
        console.error('Username not found in SecureStore');
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };
  
  const fetchGroupColor = async (group_id) => {
    try {
      const user_id = await fetchUserId();
      if (user_id) {
        const response = await axios.post(`${API_URL}get-group-color`, { user_id, group_id });
        const groupColor = response.data[0]?.group_color;
        if (groupColor) {
          setGroupColor(groupColor);
        } else {
          console.warn('No group color found for this group.');
        }
      }
    } catch (error) {
      console.error('Error fetching group color:', error);
    }
  };
  

  
  const handleOptionSelect = (option) => {
    console.log("Selected option: " + option);
    setPopoverVisible(false); // Close popover after selection
  };

  const refresh = async (user) => {
    try {
      // Fetch personal data
      const personalResponse = await axios.post(`${API_URL}get-chores-data`, { username: user });
      setPersonalData(personalResponse.data);
  
      // Fetch groups for the user
      const groupsResponse = await axios.post(`${API_URL}get-all-groups-for-user`, { username: user });
      let allGroupData = [];
      const groupNameMap = {};
      const groupColorMap = {};
  
      for (const group of groupsResponse.data) {
        const groupId = group.group_id;
  
        // Fetch group tasks
        const tasksResponse = await axios.post(`${API_URL}get-group-chores-data-for-user`, { username: user, group_id: groupId });
        allGroupData = [...allGroupData, ...tasksResponse.data];
  
        // Fetch group name
        if (!groupNameMap[groupId]) {
          const nameResponse = await axios.post(`${API_URL}get-group-name`, { group_id: groupId });
          groupNameMap[groupId] = nameResponse.data.group_name;
        }
  
        // Fetch group color
        // if (!groupColorMap[groupId]) {
        //   await fetchGroupColor(user.id, groupId);
        // }
      }
  
      const enrichedGroupData = allGroupData.map((groupTask) => ({
        ...groupTask,
        group_name: groupNameMap[groupTask.group_id] || 'Unknown Group'
      }));
      setGroupData(enrichedGroupData);
    } catch (error) {
      console.error('Error during refresh:', error);
    }
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
      
      <View style={styles.content}>
      {/* Personal Chores */}
      <View style={styles.contentSection}>
        <TouchableWithoutFeedback onPress={togglePersonalCollapse}>
          <View style={styles.homeToggleButton}>
            <Text style={styles.sectionHeading}>Personal Chores</Text>

            {/* Menu for color options */}
                {/* The button that triggers the menu */}
                  <TouchableOpacity onPress={() => setPopoverVisible(true)} style={styles.button}>
                    <Icon name="ellipsis-vertical" size={24} color="#fff" />
                  </TouchableOpacity>

                  <Popover
          isVisible={popoverVisible}
          onRequestClose={() => setPopoverVisible(false)} // Close on tap outside
          fromView={this.popoverButton}
          popoverStyle={styles.popover}
        >
          <TouchableOpacity onPress={() => handleOptionSelect('Option 1')}>
            <Text style={styles.menuItem}>Option 1</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionSelect('Option 2')}>
            <Text style={styles.menuItem}>Option 2</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionSelect('Option 3')}>
            <Text style={styles.menuItem}>Option 3</Text>
          </TouchableOpacity>
        </Popover>
                  {/* Add more color options as needed */}
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
              <TouchableOpacity onPress={() => console.log("Settings clicked")}>
                <Icon name="ellipsis-vertical" size={24} color="#fff" />
            </TouchableOpacity>
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