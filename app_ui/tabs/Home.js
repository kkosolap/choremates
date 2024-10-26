// Home.js

import React from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, Alert   } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import colors from '../style/colors';
import styles from '../style/styles';
import { TabHeader } from '../components/headers.js';
import AddChoreScreen from '../components/AddChore.js';
import DisplayChoresList from '../components/DisplayChores.js';


// header and page content
const HomeScreen = () => (
  <View style={styles.screen}>
    <TabHeader title="My Home" />
    <HomeDisplay />
  </View>
);

// page content
const HomeDisplay = () => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const navigation = useNavigation(); // get the navigation object

  // add chore button press
  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.8, // scale down to 80%
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  // add chore button release
  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1, // scale back to original size
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  // open NewChore page above current page
  const openAddChore = () => {
    navigation.navigate('NewChore');
  };

  return (
    <View style={styles.content}>
      <TouchableWithoutFeedback
        onPress={openAddChore}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
          <Icon name="add" size={40} color="#fff" />
        </Animated.View>
      </TouchableWithoutFeedback>

      <Text style={styles.buttonDescription}>
        add chore
      </Text>

      {/* To remove the checklists displayed on the homescreen, comment out line below 
          Just left it in case it could be useful!                               -VA */}
      <DisplayChoresList></DisplayChoresList>
    </View>
  );
};

export default HomeScreen;