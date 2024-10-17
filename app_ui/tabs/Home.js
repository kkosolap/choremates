// Home.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../style/colors';
import styles from '../style/styles';


const HomeDisplay = () => (
  <View style={styles.screen}>
    {/* Add Chore Button */}
    <TouchableOpacity
      style={styles.button}
      onPress={() => alert('Plus Icon Pressed!')}
      activeOpacity={0.7}  // opacity when pressed
    >
      <Icon name="add" size={40} color={colors.white} />
    </TouchableOpacity>
    <Text style={styles.buttonDescription}>
      add chore
    </Text>
  </View>
);

export default HomeDisplay;
