// blocks.js

import React from 'react';
import { Text, View, TouchableOpacity, TextInput, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../style/colors';
import styles from '../style/styles';
import showHelloPopup from '../components/hello.js';


// block for displaying a chore in weekly list
export const ChoreBlock = ({ choreName, tasks, completed, onToggleVisibility, visible, onEdit, onDelete, isEditing, newTask, setNewTask, onAddTask }) => {
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
        <Icon name={completed ? "checkbox-outline" : "square-outline"} size={26} color={colors.text1} />
      </TouchableOpacity>

      {/* Chore title */}
      <Text style={styles.choreTitle}>{choreName}</Text>

      {/* Conditionally render Edit pencil if tasks visible */}
      {visible && (
        <TouchableOpacity
          style={styles.editChoreButton}
          onPress={() => onEdit(choreName)}
        >
          <Icon name="pencil" size={22} color={colors.text3} />
        </TouchableOpacity>
      )}

      {/* Render tasks if visible */}
      {visible && tasks.map(({ id, task }) => (
        <View key={id} style={styles.taskContainer}>
          <View style={styles.taskAndCheck}>
            {/* checkbox */}
            <TouchableOpacity
              style={styles.taskCheck}
              onPress={showHelloPopup}
            >
              {/*<Icon name={completed ? "checkbox-outline" : "square-outline"} size={24} color={colors.text1} />*/}
              <Icon name={"square-outline"} size={20} color={colors.text1} />
            </TouchableOpacity> 

            {/* task text */}
            <Text style={styles.taskText}>{task}</Text>
          </View>

          {/* delete button */}
          {isEditing && (
            <TouchableOpacity
            onPress={() => onDelete(choreName, task)}
          >
            <Icon name="close-outline" size={24} color={colors.text3} />
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
            selcectionColor={colors.blue}
          />

          <TouchableOpacity
            onPress={() => onAddTask(choreName)}
          >
            <Icon name="arrow-forward-circle-outline" size={30} color={colors.text3} />
          </TouchableOpacity>
          
        </View>
      )}
    </TouchableOpacity>
  );
};