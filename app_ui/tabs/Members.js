// Members.js

import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import colors from '../style/colors';
import styles from '../style/styles';
import { TabHeader } from '../components/headers.js';


// header and page content
const MembersScreen = () => (
  <View style={styles.screen}>
    <TabHeader title="Members" />
    <MembersDisplay />
  </View>
);

// page content
const MembersDisplay = () => (
  <View style={styles.content}>
    <Text style={styles.subtitle}>Members Screen</Text>
  </View>
);

export default MembersScreen;
