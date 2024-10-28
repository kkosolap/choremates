// Settings.js

import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import { TabHeader } from '../components/headers.js';
import LogoutButton from '../components/logout'; 

// Header and page content
const SettingsScreen = ({ onLogout }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleLogout = () => {
    onLogout();
  };

  return (
    <View style={styles.screen}>
      <TabHeader title="Settings" />
      <SettingsDisplay onLogout={handleLogout} />
    </View>
  );
};

// Page content
const SettingsDisplay = ({ onLogout }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return(
    <View style={styles.content}>
      <Text style={styles.subtitle}>Settings Screen</Text>
      
      <LogoutButton onLogout={onLogout} />
    </View>
  );
};

export default SettingsScreen;
