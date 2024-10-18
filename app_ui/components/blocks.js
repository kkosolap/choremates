// headers.js

import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../style/colors';
import styles from '../style/styles';

// block for displaying a chore in weekly list
export const ChoreBlock = ({ name, completed, onPress }) => {
  return (
    <TouchableOpacity 
      style={completed ? styles.choreBlockCompleted : styles.choreBlock}
      onPress={onPress} // Trigger the function when pressed
      activeOpacity={0.8} // Adjusts opacity when pressed (optional)
    >
      <Text style={styles.choreTitle}>{name}</Text>
    </TouchableOpacity>
  );
};