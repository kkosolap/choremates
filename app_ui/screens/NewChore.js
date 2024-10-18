// NewChore.js

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import colors from '../style/colors';
import styles from '../style/styles';
import { ScreenHeader } from '../App.js';


// header and page content
const NewChoreScreen = ({navigation}) => (
  <View style={styles.screen}>
    <ScreenHeader title="Add a New Chore" navigation={navigation} />
    <NewChoreDisplay navigation={navigation} />
  </View>
);

// page content
const NewChoreDisplay = () => {
  return (
    <View style={styles.content}>
      <Text style={styles.subtitle}>blah blah blah</Text>
    </View>
  );
};

export default NewChoreScreen;