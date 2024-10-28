// Members.js

import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import { TabHeader } from '../components/headers.js';


// header and page content
const MembersScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      <TabHeader title="Members" />
      <MembersDisplay />
    </View>
  );
};

// page content
const MembersDisplay = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.content}>
      <Text style={styles.subtitle}>Members Screen</Text>
    </View>
  );
};

export default MembersScreen;
