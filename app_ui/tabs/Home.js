// Home.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, ScrollView, Text, TouchableWithoutFeedback, Animated, TouchableOpacity, } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Collapsible from 'react-native-collapsible';

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
      <TabHeader title="Home" />
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
  
  const [username, setUsername] = useState(null);
  const [personalData, setPersonalData] = useState([]);
  const [groupData, setGroupData] = useState([]);

  // state to control visibility of three-dot button -VA
  const [showThreeDots, setShowThreeDots] = useState(false);
  const handleTouchablePress = () => {
    setShowThreeDots(!showThreeDots); // Toggle visibility of three-dot button
  };

  // list of a user's groups
  const [groupList, setGroupList] = useState([]);

  // Get user's groups
  useEffect(() => {
    const getGroups = async () => {
      if (!username) return; // Ensure the username is set before making the API call
  
      try {
        const response = await axios.post(`${API_URL}get-all-groups-for-user`, { username });
        if (response && response.data) {
          const transformedData = response.data.map(group => ({
            name: group.group_name,
            id: group.group_id,
          }));
          setGroupList([...transformedData]);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    getGroups();
  }, [username]);

  // track which sections are collapsed -MH
  const [isPersonalCollapsed, setPersonalCollapsed] = useState(true);
  const togglePersonalCollapse = () => {
    setPersonalCollapsed(!isPersonalCollapsed);
  };
  const [isGroupCollapsed, setGroupCollapsed] = useState({});
  const toggleGroupCollapse = (group_id) => {
    setGroupCollapsed((prevState) => ({
      ...prevState,
      [group_id]: !prevState[group_id],
    }));
  };
  const groupCollapsedInitialized = useRef(false);

  useEffect(() => {
    if (!groupCollapsedInitialized.current && groupList.length > 0) {
      // Set initial collapse state for each group in groupList to true
      const initialCollapsedState = groupList.reduce((acc, group) => {
        acc[group.id] = true; // Default collapsed state is true for every group
        return acc;
      }, {});
      setGroupCollapsed(initialCollapsedState);
      groupCollapsedInitialized.current = true; // Mark as initialized
    }
  }, [groupList]);

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
      // Ensure group_id is added even if it doesn't have chores
      if (!acc[group_task.group_id]) {
        acc[group_task.group_id] = {
          group_name: group_task.group_name,
          chores: {},
        };
      }
      // Add chores only if present
      if (group_task.group_chore_name) {
        if (!acc[group_task.group_id].chores[group_task.group_chore_name]) {
          acc[group_task.group_id].chores[group_task.group_chore_name] = {
            group_id: group_task.group_id,
            is_completed: group_task.chore_is_completed,
            recurrence: group_task.chore_recurrence,
            group_tasks: [],
          };
        }
        // Add tasks only if present
        if (group_task.group_task_name) {
          acc[group_task.group_id].chores[group_task.group_chore_name].group_tasks.push(group_task.group_task_name);
        }
      }
    }
    return acc;
  }, {});

  // Ensure all groups are represented, even if empty
  groupList.forEach(group => {
    if (!groupedGroupTasks[group.id]) {
      groupedGroupTasks[group.id] = {
        group_name: group.name,
        chores: {}, // No chores
      };
    }
  });

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

      <View style={styles.spacer}></View>
      <View style={styles.spacer}></View>
      
      {/* Personal Chores */}
      <View style={styles.groupContentSection}>
        {/* Heading */}
        <TouchableOpacity
          style={styles.groupChoreSectionLabel}
          onPress={togglePersonalCollapse}
          activeOpacity={0.8}
        >
          {/* chevron icon */}
          <Icon
            type='font-awesome'
            name={isPersonalCollapsed ? 'chevron-down' : 'chevron-up'}
            style={styles.groupLabelChevron}
            size={22}
            color={theme.main}
          />

          {/* title */}
          <Text style={styles.sectionHeading}>
            Personal Chores
          </Text>

          {/* settings button */}
          <TouchableOpacity
            onPress={() => console.log("Settings clicked")}
            activeOpacity={0.7}
          >
            <Icon name="ellipsis-vertical" size={24} color={theme.main} />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Horizontal Line */}
        <View style={styles.horizontalLine} />

        {/* Collapsible Content */}
        <View style={styles.fullWidth}>
          <Collapsible collapsed={isPersonalCollapsed}>

            {Object.keys(groupedPersonalTasks).length > 0 ? (
              // Group WITH Chores
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
              
            ) : (
              // Group with NO Chores
              <View style={styles.emptySectionSection}>
                <Text style={styles.emptySectionText}>
                  No Chores Created
                </Text>
              </View>
            )
          }

          </Collapsible>
        </View>
      </View>

      {/* Group Chores */}
      {Object.keys(groupedGroupTasks).map((group_id) => (
        <View key={group_id} style={styles.groupContentSection}>
          {/* Heading */}
          <TouchableOpacity
            onPress={() => toggleGroupCollapse(group_id)}
            style={styles.groupChoreSectionLabel}
            activeOpacity={0.8}
          >
            {/* chevron icon */}
            <Icon
              type='font-awesome'
              name={isGroupCollapsed[group_id] ? 'chevron-down' : 'chevron-up'}
              style={styles.groupLabelChevron}
              size={22}
              color={theme.main}
            />

            {/* title */}
            <Text style={styles.sectionHeading}>
              {groupedGroupTasks[group_id].group_name}
            </Text>

            {/* settings button */}
            <TouchableOpacity
              onPress={() => console.log("Settings clicked")}
              activeOpacity={0.7}
            >
              <Icon name="ellipsis-vertical" size={24} color={theme.main} />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Horizontal Line */}
          <View style={styles.horizontalLine} />

          {/* Collapsible Content */}
          <View style={styles.fullWidth}>
            <Collapsible collapsed={isGroupCollapsed[group_id]}>

              {Object.keys(groupedGroupTasks[group_id].chores).length > 0 ? (
                // Group WITH Chores
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

                ) : (
                  // Group with NO Chores
                  <View style={styles.emptySectionSection}>
                    <Text style={styles.emptySectionText}>
                      No Chores Created
                    </Text>
                  </View>
                )
              }

            </Collapsible>
          </View>
        </View>
      ))}

    </View>
  );
};

export default HomeScreen;