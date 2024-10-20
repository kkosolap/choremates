// blocks.js

import React from 'react';
import { Text, View, TouchableOpacity, TextInput, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../style/colors';
import styles from '../style/styles';

// THIS CODE IS A WIP  -MH

// block for displaying a chore in weekly list
export const ChoreBlock = ({ choreName, tasks, completed, onToggleVisibility, visible, onEdit, onDelete, isEditing, newTask, setNewTask, onAddTask }) => {
  return (
    <TouchableOpacity
      style={completed ? styles.choreBlockCompleted : styles.choreBlock}
      onPress={() => onToggleVisibility(choreName)} // Toggle the task visibility
      activeOpacity={0.8}
    >
      {/* Chore title */}
      <Text style={styles.choreTitle}>{choreName}</Text>

      {/* Edit pencil */}
      <TouchableOpacity
        style={styles.editChoreButton}
        onPress={() => onEdit(choreName)}
      >
        <Icon name="pencil" size={24} color={colors.text3} />
      </TouchableOpacity>

      {/* Render tasks if visible */}
      {visible && tasks.map(({ id, task }) => (
        <View key={id} style={styles.taskContainer}>
          <Text style={styles.taskText}>- {task}</Text>
          {isEditing && (
            <TouchableOpacity onPress={() => onDelete(choreName, task)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      {/* Input for adding a task if editing */}
      {isEditing && (
        <View style={styles.addTaskContainer}>
          <TextInput
            style={styles.addTaskInput}
            placeholder="add a new task"
            value={newTask}
            onChangeText={setNewTask}
          />
          <Button title="Add Task" onPress={() => onAddTask(choreName)} />
        </View>
      )}
    </TouchableOpacity>
  );
};

// Kat's Chore Block code
export const KatChoreBlock = ({ choreName, tasks, onToggleVisibility, visible, onEdit, onDelete, isEditing, newTask, setNewTask, onAddTask }) => {
  return (
    <View style={styles.katChoreContainer}>
      {/* Chore heading and edit button */}
      <View style={styles.choreHeader}>
        <TouchableOpacity onPress={() => onToggleVisibility(choreName)}>
          <Text style={styles.subtitle}>{choreName}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onEdit(choreName)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* List tasks for each chore */}
      {visible && tasks.map(({ id, task }) => (
        <View key={id} style={styles.katTaskContainer}>
          <Text style={styles.katTaskText}>- {task}</Text>
          {isEditing && (
            <TouchableOpacity onPress={() => onDelete(choreName, task)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      {/* Text input for adding a task */}
      {isEditing && (
        <View style={styles.katAddTaskContainer}>
          <TextInput
            style={styles.addTaskInput}
            placeholder="add a new task"
            value={newTask}
            onChangeText={setNewTask}
          />
          <Button title="Add Task" onPress={() => onAddTask(choreName)} />
        </View>
      )}
    </View>
  );
};