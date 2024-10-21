// blocks.js

import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../style/colors';
import styles from '../style/styles';

// THIS CODE IS A WIP  -MH

// block for displaying a chore in weekly list
export const ChoreBlock = ({ choreName, taskList, completed, onPress }) => {
  return (
    <TouchableOpacity 
      style={completed ? styles.choreBlockCompleted : styles.choreBlock}
      onPress={onPress} // Trigger the function when pressed
      activeOpacity={0.8} // Adjusts opacity when pressed (optional)
    >
      <Text style={styles.choreTitle}>{choreName}</Text>
    </TouchableOpacity>
  );
};