// blocks.js

import React from 'react';
import { Text, View, TouchableOpacity, TextInput, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import showHelloPopup from '../components/hello.js';


// block for displaying a chore in weekly list
export const ActiveChoreBlock = ({ choreName, tasks, completed, onToggleVisibility, visible, onEdit, onDelete, isEditing, newTask, setNewTask, onAddTask }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <TouchableOpacity
      style={completed ? styles.choreBlockCompleted : styles.choreBlock}
      onPress={() => onToggleVisibility(choreName)} // Toggle the task visibility
      activeOpacity={0.8}
    >
     {/* Checkbox */}
     <TouchableOpacity
        style={styles.choreCheck}
        onPress={showHelloPopup}
      >
        <Icon name={completed ? "checkbox-outline" : "square-outline"} size={26} color={completed ? theme.gray : theme.text1} />
      </TouchableOpacity>

      {/* Chore title */}
      <Text style={completed ? styles.choreTitleCompleted : styles.choreTitle}>{choreName}</Text>

      {/* Conditionally render Edit pencil if tasks visible */}
      {visible && (
        <TouchableOpacity
          style={styles.editChoreButton}
          onPress={() => onEdit(choreName)}
        >
          <Icon name="pencil" size={22} color={theme.gray} />
        </TouchableOpacity>
      )}

      {/* Render tasks if visible */}
      {visible && tasks.length > 0 && tasks.map(({ id, task }) => (
        <View key={id} style={styles.taskContainer}>
          <View style={styles.taskAndCheck}>
            {/* checkbox */}
            <TouchableOpacity
              style={styles.taskCheck}
              onPress={showHelloPopup}
            >
              {/*<Icon name={completed ? "checkbox-outline" : "square-outline"} size={24} color={completed ? theme.gray : theme.text1} />*/}
              <Icon name={"square-outline"} size={20} color={theme.text1} />
            </TouchableOpacity> 

            {/* task text */}
            <Text style={styles.taskText}>{task}</Text>
          </View>

          {/* delete button */}
          {isEditing && (
            <TouchableOpacity
            onPress={() => onDelete(choreName, task)}
          >
            <Icon name="close-outline" size={24} color={theme.gray} />
          </TouchableOpacity>
          )}
        </View>
      ))}

      {/* Input for adding a task if editing */}
      {visible && isEditing && (
        <View style={styles.addTaskContainer}>
          <TextInput
            style={styles.addTaskInput}
            placeholder="add a new task"
            value={newTask}
            onChangeText={setNewTask}
            selectionColor={theme.main}
          />

          <TouchableOpacity
            onPress={() => onAddTask(choreName)}
          >
            <Icon name="arrow-forward-circle-outline" size={30} color={theme.gray} />
          </TouchableOpacity>
          
        </View>
      )}
    </TouchableOpacity>
  );
};


// block for displaying a chore on home page
export const ChoreBlock = ({ choreName, tasks, onOpenChoreDetails, visible, onEdit, onDelete, isEditing, newTask, setNewTask, onAddTask }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <TouchableOpacity
      style={styles.choreBlock}
      onPress={() => onOpenChoreDetails(
        choreName,
        tasks
      )}
      activeOpacity={0.8}
    >

      {/* Chore title */}
      <Text style={styles.choreTitle}>{choreName}</Text>

      {/* Conditionally render Edit pencil if tasks visible */}
      {visible && (
        <TouchableOpacity
          style={styles.editChoreButton}
          onPress={() => onEdit(choreName)}
        >
          <Icon name="pencil" size={22} color={theme.gray} />
        </TouchableOpacity>
      )}

      {/* Render tasks if visible */}
      {visible && tasks.length > 0 && tasks.map(({ id, task }) => (
        <View key={id} style={styles.taskContainer}>
          <View style={styles.taskAndCheck}>
            {/* checkbox */}
            <TouchableOpacity
              style={styles.taskCheck}
              onPress={showHelloPopup}
            >
              {/*<Icon name={completed ? "checkbox-outline" : "square-outline"} size={24} color={completed ? theme.gray : theme.text1} />*/}
              <Icon name={"square-outline"} size={20} color={theme.text1} />
            </TouchableOpacity> 

            {/* task text */}
            <Text style={styles.taskText}>{task}</Text>
          </View>

          {/* delete button */}
          {isEditing && (
            <TouchableOpacity
            onPress={() => onDelete(choreName, task)}
          >
            <Icon name="close-outline" size={24} color={theme.gray} />
          </TouchableOpacity>
          )}
        </View>
      ))}

      {/* Input for adding a task if editing */}
      {visible && isEditing && (
        <View style={styles.addTaskContainer}>
          <TextInput
            style={styles.addTaskInput}
            placeholder="add a new task"
            value={newTask}
            onChangeText={setNewTask}
            selectionColor={theme.main}
          />

          <TouchableOpacity
            onPress={() => onAddTask(choreName)}
          >
            <Icon name="arrow-forward-circle-outline" size={30} color={theme.gray} />
          </TouchableOpacity>
          
        </View>
      )}
    </TouchableOpacity>
  );
};