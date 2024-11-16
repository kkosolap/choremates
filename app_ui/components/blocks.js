// blocks.js

import React, { useEffect, useState, useRef } from 'react';

import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import themes from '../style/colors';
import { completeChore, completeTask, completeGroupChore, completeGroupTask } from '../components/functions.js';
import { getGroupColor } from '../components/groupcolor.js';


import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from '../config.js';
import colors from '../style/colors';



// block for displaying a chore in weekly list
export const ActiveChoreBlock = ({ user, choreName, tasks, completed, onToggleVisibility, visible, onEdit, onDelete, isEditing, newTask, setNewTask, onAddTask, refresh }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const handleToggleChoreCompletion = (user, chore_name) => {
    completeChore(user, chore_name, tasks)
      .then(() => refresh(user))  
      .catch((error) => console.error("Error toggling task:", error));
  };

  const handleToggleTaskCompletion = (user, chore_name, task) => {
    completeTask(user, chore_name, task, completed)
      .then(() => refresh(user))  
      .catch((error) => console.error("Error toggling task:", error));
  };

  return (
    <TouchableOpacity
      style={completed ? styles.choreBlockCompleted : styles.choreBlock}
      onPress={() => onToggleVisibility(choreName)} // Toggle the task visibility
      activeOpacity={0.8}
    >
     {/* Checkbox */}
     <TouchableOpacity
        style={styles.choreCheck}
        onPress={() => handleToggleChoreCompletion(user, choreName)}
      >
        <Icon name={completed ? "checkbox-outline" : "square-outline"} size={26} color={completed ? theme.text3 : theme.text1} />
      </TouchableOpacity>

      {/* Chore Title */}
      <Text style={completed ? styles.choreTitleCompleted : styles.choreTitle}>{choreName}</Text>

      {/* Conditionally render Edit pencil if tasks visible */}
      {visible && (
        <TouchableOpacity
          style={styles.editChoreButton}
          onPress={() => onEdit(choreName)}
        >
          <Icon name="pencil" size={22} color={theme.text3} />
        </TouchableOpacity>
      )}

      {/* Render tasks if visible */}
      {visible && tasks.length > 0 && tasks.map(({ id, task, completed }) => (
        <View key={id} style={styles.taskContainer}>
          <View style={styles.taskAndCheck}>
            {/* checkbox */}
            <TouchableOpacity
              style={styles.taskCheck}
              onPress={() => handleToggleTaskCompletion(user, choreName, task)}
            >
              <Icon name={completed ? "checkbox-outline" : "square-outline"} size={24} color={completed ? theme.text3 : theme.text1} />
            </TouchableOpacity> 

            {/* task text */}
            <Text style={[styles.taskText, completed && styles.taskTextCompleted]}>
              {task}
            </Text>
          </View>

          {/* delete button */}
          {isEditing && (
            <TouchableOpacity
              onPress={() => onDelete(choreName, task)}
            >
              <Icon name="close-outline" size={24} color={theme.text3} />
            </TouchableOpacity>
          )}
        </View>
      ))}

      {/* Input for adding a task if editing */}
      {visible && isEditing && (
        <View style={styles.addTaskContainer}>
          <TextInput
            style={styles.addTaskInput}
            placeholder="add a new task . . ."
            placeholderTextColor={theme.text3}
            value={newTask}
            onChangeText={setNewTask}
            selectionColor={theme.text2}
            onSubmitEditing={() => onAddTask(choreName)}
          />

          <TouchableOpacity
            onPress={() => onAddTask(choreName)}
          >
            <Icon name="arrow-forward-circle-outline" size={30} color={theme.text3} />
          </TouchableOpacity>
          
        </View>
      )}
    </TouchableOpacity>
  );
};

export const ActiveGroupChoreBlock = ({ user, group_id, choreName, tasks, completed, onToggleVisibility, visible, onEdit, onDelete, isEditing, newTask, setNewTask, onAddTask, refresh }) => {
  const { theme } = useTheme();
  const styles = createStyles(themes)

  const [username, setUsername] = useState(null);
  const [groups, setGroups] = useState([]);
  const [groupColors, setGroupColors] = useState({});
  const popoverButtonRef = useRef(null);
  
  
  const handleToggleChoreCompletion = (group_id, chore_name) => {
    completeGroupChore(group_id, chore_name, tasks)
      .then(() => refresh(user))  
      .catch((error) => console.error("Error toggling task:", error));
  };

  const handleToggleTaskCompletion = (group_id, chore_name, task) => {
    completeGroupTask(group_id, chore_name, task, completed)
      .then(() => refresh(user))  
      .catch((error) => console.error("Error toggling task:", error));
  };

  
  useEffect(() => {

    const fetchGroups = async (username) => {
      try {
        const response = await axios.post(`${API_URL}get-all-groups-for-user`, {
          username: username,
        });
        console.log("Blocks.js Group response:", response.data);
        setGroups(response.data);
      } catch (error) {
        console.error("Blocks.js Error fetching groups:", error);
        Alert.alert("Blocks.js Failed to load groups.");
      }
    };
    fetchGroups(user);

  }, []);

  useEffect(() => {
    const fetchGroupColors = async () => {
      if (user && groups.length > 0) {
        const colorMap = {};
        for (const group of groups) {
          const color = await getGroupColor(user, group);
          colorMap[group.group_id] = color;
          console.log('Group color fetching = :' + color);

          // console.log('COlor = :' + color);
        }
        setGroupColors(colorMap);
      }
    };
    fetchGroupColors();
  }, [user, groups]);

  console.log("group color: "+groupColors[group_id]);

  // Fetch the color for this specific group



  const desaturatedColors = {
    yellow: colors.yellow.desaturated,
    green: colors.green.desaturated,
    blue: colors.blue.desaturated,
    purple: colors.purple.desaturated,
    pink: colors.pink.desaturated,
  };
  const lightestColors= {
    yellow: colors.yellow.lightest,
    green: colors.green.lightest,
    blue: colors.blue.lightest,
    purple: colors.purple.lightest,
    pink: colors.pink.lightest,
  };
  
  const groupColor = groupColors[group_id];

  const notCompletedColor = lightestColors[groupColor] || colors.purple.lighter;

  const completedColor = desaturatedColors[groupColor] || colors.purple.desaturated;
  
  return (
    <TouchableOpacity
      style={[
        completed ? styles.choreBlockCompleted : styles.choreBlock,
        { backgroundColor: completed ? completedColor : notCompletedColor}
      ]}      
      
      onPress={() => onToggleVisibility(choreName)} // Toggle the task visibility
      activeOpacity={0.8}
    >
     {/* Checkbox */}
     <TouchableOpacity
        style={styles.choreCheck}
        onPress={() => handleToggleChoreCompletion(group_id, choreName)}
      >
        <Icon name={completed ? "checkbox-outline" : "square-outline"} size={26} color={completed ? theme.text3 : theme.text1} />
      </TouchableOpacity>

      {/* Chore Title */}
      <Text style={completed ? styles.choreTitleCompleted : styles.choreTitle}>{choreName}</Text>

      {/* Conditionally render Edit pencil if tasks visible */}
      {visible && (
        <TouchableOpacity
          style={styles.editChoreButton}
          onPress={() => onEdit(choreName)}
        >
          <Icon name="pencil" size={22} color={theme.text3} />
        </TouchableOpacity>
      )}

      {/* Render tasks if visible */}
      {visible && tasks.length > 0 && tasks.map(({ id, group_task, completed }) => (
        <View key={id} style={styles.taskContainer}>
          <View style={styles.taskAndCheck}>
            {/* checkbox */}
            <TouchableOpacity
              style={styles.taskCheck}
              onPress={() => handleToggleTaskCompletion(group_id, choreName, group_task)}
            >
              <Icon name={completed ? "checkbox-outline" : "square-outline"} size={24} color={completed ? theme.text3 : theme.text1} />
            </TouchableOpacity> 

            {/* task text */}
            <Text style={[styles.taskText, completed && styles.taskTextCompleted]}>
              {group_task}
            </Text>
          </View>

          {/* delete button */}
          {isEditing && (
            <TouchableOpacity
              onPress={() => onDelete(choreName, group_task, group_id)}
            >
              <Icon name="close-outline" size={24} color={theme.text3} />
            </TouchableOpacity>
          )}
        </View>
      ))}

      {/* Input for adding a task if editing */}
      {visible && isEditing && (
        <View style={styles.addTaskContainer}>
          <TextInput
            style={styles.addTaskInput}
            placeholder="add a new task . . ."
            placeholderTextColor={theme.text3}
            value={newTask}
            onChangeText={setNewTask}
            selectionColor={theme.text2}
            onSubmitEditing={() => onAddTask(choreName, group_id)}
          />

          <TouchableOpacity
            onPress={() => onAddTask(choreName, group_id)}
          >
            <Icon name="arrow-forward-circle-outline" size={30} color={theme.text3} />
          </TouchableOpacity>
          
        </View>
      )}
    </TouchableOpacity>
  );
};

// block for displaying a chore on home page
export const ChoreBlock = ({ choreName, tasks, onOpenChoreDetails, recurrence }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <TouchableOpacity
      style={styles.homeChoreBlock}
      onPress={() => onOpenChoreDetails(
        choreName,
        tasks
      )}
      activeOpacity={0.8}
    >

      {/* Chore Title */}
      <Text style={styles.homeChoreTitle}>{choreName}</Text>

      {/* Reccurence */}
      <Text style={styles.recurrenceLabel}>{recurrence}</Text>

    </TouchableOpacity>
  );
};