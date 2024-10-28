// Home.js

import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, Alert   } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import { TabHeader } from '../components/headers.js';
import { ChoreBlock } from '../components/blocks.js';


// header and page content
const HomeScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      <TabHeader title="My Home" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <HomeDisplay />
      </ScrollView>
    </View>
  );
};

// page content
const HomeDisplay = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
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
      {/* AddChore button */}
      <TouchableWithoutFeedback
        onPress={openAddChore}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
          <Icon name="add" size={40} color="#fff" />
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* button label */}
      <Text style={styles.buttonDescription}>
        add chore
      </Text>

      {/* All House Chores Heading */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionHeading}>
          All House Chores
        </Text>

        {/* Horizontal Line */}
        <View style={styles.horizontalLine} />

        {/* Display all Chores */}
        <Text style={styles.subtitle}>
          (all chores list will go here)
        </Text>
      </View>

      

    </View>
  );
};

export default HomeScreen;