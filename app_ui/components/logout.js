// logout.js

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';

const LogoutButton = ({ onLogout }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
      <Text style={styles.logoutButtonText}>Log out</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;
