// Settings.js

import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import colors from '../style/colors';
import styles from '../style/styles';
import { TabHeader } from '../components/headers.js';


// header and page content
const SettingsScreen = () => (
  <View style={styles.screen}>
    <TabHeader title="Settings" />
    <SettingsDisplay />
  </View>
);

// page content
const SettingsDisplay = () => (
  <View style={styles.content}>
    <Text style={styles.subtitle}>Settings Screen</Text>
  </View>
);

export default SettingsScreen;
