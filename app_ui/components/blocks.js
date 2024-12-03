// blocks.js

import React from 'react';
import { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../contexts/ThemeProvider.js';
import { useGroupThemes } from '../contexts/GroupThemeProvider';
import createStyles from '../style/styles';
import { completeChore, completeTask, completeGroupChore, completeGroupTask } from '../functions/markCompleted.js';


// block for displaying a chore in weekly list
export const ActiveChoreBlock = ({ user, choreName, tasks, completed, recurrence, onToggleVisibility, visible, refresh }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [completedState, setCompletedState] = useState(completed);

  const currentDay = new Date().getDay(); // 0 = Sunday, ..., 6 = Saturday
  const targetDay = 0; // Sunday (0)
  const daysUntilSunday = (targetDay - currentDay + 7) % 7;

  const recurrenceTextMap = {
    "Daily": "11:59pm",
    "Weekly":
      daysUntilSunday === 0 ? "11:59pm"
      : daysUntilSunday === 1 ? "Tomorrow"
      : `in ${daysUntilSunday} Days`,
    "Just Once": "never"
  };
  
  const handleToggleChoreCompletion = (user, chore_name) => {
    setCompletedState(!completedState);

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
      style={completedState ? styles.choreBlockCompleted : styles.choreBlock}
      onPress={() => onToggleVisibility(choreName)} // Toggle the task visibility
      activeOpacity={0.8}
    >
     {/* Checkbox */}
     <TouchableOpacity
        style={styles.choreCheck}
        onPress={() => handleToggleChoreCompletion(user, choreName)}
      >
        <Icon name={completedState ? "checkbox-outline" : "square-outline"} size={26} color={completedState ? theme.text3 : theme.text1} />
      </TouchableOpacity>

      {/* Chore Title */}
      <Text style={completedState ? styles.choreTitleCompleted : styles.choreTitle}>{choreName}</Text>

      {/* Render tasks if visible  -MH */}
      {visible && (
        <>
          {tasks.length > 0 ? (
            // if there are tasks to display
            tasks.map(({ id, task, completed }) => (
              <View key={id} style={styles.taskContainer}>
                <View style={styles.taskAndCheck}>
                  {/* Checkbox */}
                  <TouchableOpacity
                    style={styles.taskCheck}
                    onPress={() => handleToggleTaskCompletion(user, choreName, task)}
                  >
                    <Icon
                      name={completed ? "checkbox-outline" : "square-outline"}
                      size={24}
                      color={completed ? theme.text3 : theme.text1}
                    />
                  </TouchableOpacity>

                  {/* Task Text */}
                  <Text style={[styles.taskText, completed && styles.taskTextCompleted]}>
                    {task}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            // if NO tasks to display
            <View style={styles.taskContainer}>
              <Text style={styles.emptySectionText}>No tasks</Text>
            </View>
          )}

          {/* Show Due Date (if tasks visible and not completed) */}
          {!completed && (
            <View style={styles.dueDateContainer}>
              {recurrence !== "Just Once" ? (
                <Text style={styles.dueDateText}>Due: {recurrenceTextMap[recurrence]}</Text>
              ) : (
                <Text style={styles.dueDateText}>No Due Date</Text>
              )}
            </View>
          )}
        </>
      )}

      
    </TouchableOpacity>
  );
};

export const ActiveGroupChoreBlock = ({ user, group_id, choreName, tasks, completed, recurrence, onToggleVisibility, visible, refresh }) => {
  const { theme } = useTheme();
  const { groupThemes } = useGroupThemes();
  const styles = createStyles(groupThemes[group_id]);

  const [completedState, setCompletedState] = useState(completed);

  const currentDay = new Date().getDay(); // 0 = Sunday, ..., 6 = Saturday
  const targetDay = 0; // Sunday (0)
  const daysUntilSunday = (targetDay - currentDay + 7) % 7;

  const recurrenceTextMap = {
    "Daily": "11:59pm",
    "Weekly":
      daysUntilSunday === 0 ? "11:59pm"
      : daysUntilSunday === 1 ? "Tomorrow"
      : `in ${daysUntilSunday} Days`,
    "Just Once": "never"
  };

  const handleToggleChoreCompletion = (group_id, chore_name) => {
    setCompletedState(!completedState);

    completeGroupChore(group_id, chore_name, tasks)
      .then(() => refresh(user))  
      .catch((error) => console.error("Error toggling task:", error));
  };

  const handleToggleTaskCompletion = (group_id, chore_name, task) => {
    completeGroupTask(group_id, chore_name, task, completed)
      .then(() => refresh(user))  
      .catch((error) => console.error("Error toggling task:", error));
  };

  return (
    <TouchableOpacity
      style={completedState ? styles.choreBlockCompleted : styles.choreBlock}
      onPress={() => onToggleVisibility(choreName)} // Toggle the task visibility
      activeOpacity={0.8}
    >
     {/* Checkbox */}
     <TouchableOpacity
        style={styles.choreCheck}
        onPress={() => handleToggleChoreCompletion(group_id, choreName)}
      >
        <Icon name={completedState ? "checkbox-outline" : "square-outline"} size={26} color={completedState ? theme.text3 : theme.text1} />
      </TouchableOpacity>

      {/* Chore Title */}
      <Text style={completedState ? styles.choreTitleCompleted : styles.choreTitle}>{choreName}</Text>

      {/* Render tasks if visible */}
      {visible && (
        <>
          {tasks.length > 0 ? (
            // if there are tasks to display
            tasks.map(({ id, task, completed }) => (
              <View key={id} style={styles.taskContainer}>
                <View style={styles.taskAndCheck}>
                  {/* Checkbox */}
                  <TouchableOpacity
                    style={styles.taskCheck}
                    onPress={() => handleToggleTaskCompletion(group_id, choreName, task)}
                  >
                    <Icon
                      name={completed ? "checkbox-outline" : "square-outline"}
                      size={24}
                      color={completed ? theme.text3 : theme.text1}
                    />
                  </TouchableOpacity>

                  {/* Task Text */}
                  <Text style={[styles.taskText, completed && styles.taskTextCompleted]}>
                    {task}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            // if NO tasks to display
            <View style={styles.taskContainer}>
              <Text style={styles.emptySectionText}>No tasks</Text>
            </View>
          )}

          {/* Show Due Date (if tasks visible and not completed) */}
          {!completed && (
            <View style={styles.dueDateContainer}>
              {recurrence !== "Just Once" ? (
                <Text style={styles.dueDateText}>Due: {recurrenceTextMap[recurrence]}</Text>
              ) : (
                <Text style={styles.dueDateText}>No Due Date</Text>
              )}
            </View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

// block for displaying a chore on home page
export const HomeChoreBlock = ({ choreName, tasks, onOpenChoreDetails, recurrence }) => {
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
      <View style={styles.homeChoreInfo}>
        <Text style={styles.recurrenceLabel}>{recurrence}</Text>
      </View>

    </TouchableOpacity>
  );
};

// block for displaying group chores on home page
export const HomeGroupChoreBlock = ({ choreName, onOpenChoreDetails, recurrence, rotation, group_id }) => {
  const { groupThemes } = useGroupThemes();
  const styles = createStyles(groupThemes[group_id]);

  return (
    <TouchableOpacity
      style={styles.homeChoreBlock}
      onPress={onOpenChoreDetails}
      activeOpacity={0.8}
    >

      {/* Chore Title */}
      <Text style={styles.homeChoreTitle}>{choreName}</Text>

      {/* Recurrence and Rotation */}
      <View style={styles.homeChoreInfo}>
        <Text style={styles.recurrenceLabel}>{recurrence}</Text>

        {rotation === 1 && (
          <View style={styles.rotatingLabel}>
            <Ionicons name={"sync-outline"} size={25} color={groupThemes[group_id].text3} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};