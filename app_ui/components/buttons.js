// buttons.js

import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../contexts/ThemeProvider';
import createStyles from '../style/styles';
import colors from '../style/colors';


// for any button with an icon + text
// Currently unused (removed from Settings.js) -VA
export const SettingsButton = ({ label, iconName, iconSize = 40, onClick }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <TouchableOpacity
      style={styles.settingsButton}
      activeOpacity={0.8}
      onPress={onClick}
    >
      <View style={styles.settingsButtonIcon}>
        <Ionicons name={iconName} size={iconSize} color={theme.main} />
      </View>
      
      <Text style={styles.settingsButtonText}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// for any button with an icon + text
export const ThemeButton = ({ iconName = "color-palette", iconSize = 50, color, user }) => {
  const { theme, changeTheme } = useTheme();
  
  return (
    <TouchableOpacity onPress={() => changeTheme(user, color)}>
      <Ionicons
        name={iconName}
        size={iconSize}
        color={colors[color]?.main || theme.gray}
      />
    </TouchableOpacity>
  );
};

// for to-do/completed tab buttons on Chores tab
export const SectionTabButton = ({ label, selected, onClick }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <TouchableOpacity
      style={selected ? styles.tabButtonSelected : styles.tabButtonDeselected}
      activeOpacity={0.8}
      onPress={onClick}
    >
      <Text style={styles.choreSectionTabText}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};