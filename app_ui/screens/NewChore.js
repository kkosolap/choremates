// NewChore.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../style/colors';
import styles from '../style/styles';

const NewChoreScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text><Icon name="arrow-back" size={35} color={colors.darkestBlue} /></Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Add a New Chore</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>blah blah blah</Text>
      </View>
    </View>
  );
};

export default NewChoreScreen;