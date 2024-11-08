// blocks.js

import React from 'react';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import { completeChore, completeTask } from '../components/functions.js';


// block for displaying a chore in weekly list
export const ActiveChoreBlock = ({ user, choreName, tasks, completed, isOverdue, onToggleVisibility, visible, onEdit, onDelete, isEditing, newTask, setNewTask, onAddTask, refresh }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const handleToggleChoreCompletion = (user, chore_name) => {
    completeChore(user, chore_name, tasks)
      .then(() => refresh(user))  
      .catch((error) => console.error("Error toggling task:", error));
  };

  const handleToggleTaskCompletion = (user, chore_name, task) => {
    completeTask(user, chore_name, task)
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