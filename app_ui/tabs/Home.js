// Home.js

import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { View, ScrollView, Text, TouchableWithoutFeedback, Animated, TouchableOpacity, } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Collapsible from 'react-native-collapsible';

import * as SecureStore from 'expo-secure-store'; 

import createStyles from '../style/styles';
import { useTheme } from '../contexts/ThemeProvider.js';
import { TabHeader } from '../components/headers.js';
import { HomeChoreBlock, HomeGroupChoreBlock } from '../components/blocks.js';
import { useGroupThemes } from '../contexts/GroupThemeProvider';

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

  // list of a user's groups
  const [groupList, setGroupList] = useState([]);

  // Get user's groups and Collapse State -VA
  useEffect(() => {
    const getGroupsAndInitializeCollapseState = async () => {
      if (!username) return; // Ensure the username is set before making the API call
  
      try {
        const response = await axios.post(`${API_URL}get-all-groups-for-user`, { username });
        if (response && response.data) {
          const transformedData = response.data.map(group => ({
            name: group.group_name,
            id: group.group_id,
          }));
          
          setGroupList([...transformedData]);
  
          // Initialize collapse state for each group once group data is fetched
          const initialCollapsedState = transformedData.reduce((acc, group) => {
            acc[group.id] = true; // Default collapsed state is true for every group
            return acc;
          }, {});
  
          setGroupCollapsed(initialCollapsedState);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    getGroupsAndInitializeCollapseState();
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
  const openChoreDetails = (chore_name, grouped_tasks, recurrence, group_id, assigned_to, rotation_enabled) => {
    navigation.navigate('ChoreDetails', {
      routed_chore_name: chore_name,
      routed_tasks: grouped_tasks,
      routed_recurrence: recurrence,
      routed_group_id: group_id,
      routed_assignment: assigned_to,
      routed_rotation: rotation_enabled
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
            assigned_to: group_task.assigned_to,
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
      await axios.post(`${API_URL}get-group-chores-data`, { username: user, group_id })
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
  const { groupThemes } = useGroupThemes();

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

        </TouchableOpacity>

        {/* Horizontal Line */}
        <View style={styles.horizontalLine} />

        {/* Collapsible Content */}
        <View style={styles.fullWidth}>
          <Collapsible collapsed={isPersonalCollapsed}>

            {Object.keys(groupedPersonalTasks).length > 0 ? (
              // Group WITH Chores
              <View style={styles.homeChoresSection}>
                {Object.keys(groupedPersonalTasks).map((chore_name) => (
                  <HomeChoreBlock
                    key={chore_name}
                    choreName={chore_name}
                    tasks={groupedPersonalTasks[chore_name].tasks}
                    onOpenChoreDetails={() => openChoreDetails(
                      chore_name,
                      groupedPersonalTasks[chore_name].tasks,
                      groupedPersonalTasks[chore_name].recurrence,
                      -1,
                      -1,
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
{Object.keys(groupedGroupTasks).map((group_id) => {
  // Dynamically generate styles for the current group
  const groupStyles = createStyles(groupThemes[group_id] || theme);

  return (
    <View key={group_id} style={[styles.groupContentSection]}>
      {/* Heading */}
      <TouchableOpacity
        onPress={() => toggleGroupCollapse(group_id)}
        style={styles.groupChoreSectionLabel}
        activeOpacity={0.8}
      >
        {/* Chevron Icon */}
        <Icon
          type='font-awesome'
          name={isGroupCollapsed[group_id] ? 'chevron-down' : 'chevron-up'}
          style={groupStyles.groupLabelChevron}
          size={22}
        />

        {/* Title */}
        <Text style={styles.sectionHeading}>
          {groupedGroupTasks[group_id].group_name}
        </Text>
      </TouchableOpacity>

      {/* Horizontal Line */}
      <View style={[groupStyles.horizontalLine]} />

      {/* Collapsible Content */}
      <View style={[styles.fullWidth, groupStyles.collapsible]}>
        <Collapsible collapsed={isGroupCollapsed[group_id]}>
          {Object.keys(groupedGroupTasks[group_id].chores).length > 0 ? (
            // Group WITH Chores
            <View style={[styles.homeChoresSection, groupStyles.choresSection]}>
              {Object.keys(groupedGroupTasks[group_id].chores).map((group_chore_name) => (
                <HomeGroupChoreBlock
                  key={group_chore_name}
                  choreName={group_chore_name}
                  tasks={groupedGroupTasks[group_id].chores[group_chore_name].group_tasks}
                  onOpenChoreDetails={() => openChoreDetails(
                    group_chore_name,
                    groupedGroupTasks[group_id].chores[group_chore_name].group_tasks,
                    groupedGroupTasks[group_id].chores[group_chore_name].recurrence,
                    groupedGroupTasks[group_id].chores[group_chore_name].group_id,
                    groupedGroupTasks[group_id].chores[group_chore_name].assigned_to
                  )}
                  recurrence={groupedGroupTasks[group_id].chores[group_chore_name].recurrence}
                  user={username}
                  group_id={group_id}
                />
              ))}
            </View>
          ) : (
            // Group with NO Chores
            <View style={[styles.emptySectionSection, groupStyles.emptySection]}>
              <Text style={[styles.emptySectionText, groupStyles.emptyText]}>
                No Chores Created
              </Text>
            </View>
          )}
        </Collapsible>
      </View>
    </View>
  );
})}

    </View>
  );
};

export default HomeScreen;