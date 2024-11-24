// logout.js - NN

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { useTheme } from '../contexts/ThemeProvider';
import createStyles from '../style/styles';

// logout button
const LogoutButton = ({ onLogout }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // call logout function when pressed
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
      <Text style={styles.logoutButtonText}>Log out</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;
