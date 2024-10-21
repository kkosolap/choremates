// headers.js

import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../style/colors';
import styles from '../style/styles';


// Custom header for main TABS (Home, Chores, etc)
export const TabHeader = ({ title }) => {
  return (
    <View style={styles.tabHeader}>
      <Text style={styles.tabTitle}>{title}</Text>
    </View>
  );
};

// Custom header for screens (Add Chore, etc)
export const ScreenHeader = ({ title, navigation }) => {
  return (
    <View style={styles.screenHeader}>
      {/* GoBack button */}
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.7}
        onPress={() => navigation.goBack()}
      >
        <Text><Icon name="arrow-back" size={35} color={colors.darkestBlue} /></Text>
      </TouchableOpacity>
      
      {/* Title */}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};