// Chores.js

import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import colors from '../style/colors';
import styles from '../style/styles';
import { TabHeader } from '../components/headers.js';
import { ChoreBlock } from '../components/blocks.js';
import showHelloPopup from '../components/hello.js';


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
    

    {/* ***replace this text with a checklist of chores*** */}
    {/* <Text style={styles.subtitle}>Chores Screen</Text> */}

    <ChoreBlock name="chore 1 blah blah blah blah blah blah blah blah blah blah blah blah" completed={true} onPress={showHelloPopup} />
    <ChoreBlock name="chore 2" completed={false} onPress={showHelloPopup} />


  </View>
);

export default ChoresScreen;
