// Chores.js

import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import colors from '../style/colors';
import styles from '../style/styles';
import { TabHeader } from '../App.js';


// header and page content
const ChoresScreen = () => (
  <View style={styles.screen}>
    <TabHeader title="Weekly Chores" />
    <ChoresDisplay />
  </View>
);

// page content
const ChoresDisplay = () => (
  <View style={styles.content}>
    <Text style={styles.subtitle}>Chores Screen</Text>
  </View>
);

export default ChoresScreen;
