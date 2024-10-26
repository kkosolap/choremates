// NewChore.js

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import colors from '../style/colors';
import styles from '../style/styles';
import { ScreenHeader } from '../components/headers.js';


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



      {/* ***replace this text with forms to get chore info*** */}
      <Text style={styles.subtitle}>blah blah blah</Text>

      {/* chore name (text entry) */}
      {/* room tag (drop down) */}
      {/* starting week (drop down) */}
      {/* recurrence (drop down) */}
      {/* assign to (drop down) */}
      {/* steps (text entry) */}



    </View>
  );
};

export default NewChoreScreen;