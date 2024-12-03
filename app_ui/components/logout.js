// logout.js - NN

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../contexts/ThemeProvider';
import createStyles from '../style/styles';

// logout button
const LogoutButton = ({ onLogout }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // call logout function when pressed
  return (
    <TouchableOpacity
      style={styles.logoutButton}
      activeOpacity={0.8}
      onPress={onLogout}
    >
      <Ionicons name={"exit-outline"} size={28} color={theme.white} />

      <Text style={styles.logoutButtonText}> Log Out</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;
