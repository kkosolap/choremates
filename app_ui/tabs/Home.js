// Home.js

import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, Alert, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import { TabHeader } from '../components/headers.js';
import { ChoreBlock } from '../components/blocks.js';

import axios from 'axios';
import { API_URL } from '../config';


// header and page content
const HomeScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      <TabHeader title="My Home" />
        <HomeDisplay />
    </View>
  );
};

// page content
const HomeDisplay = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const scale = React.useRef(new Animated.Value(1)).current;
  const navigation = useNavigation(); // get the navigation object
  const [data, setData] = useState([]);

  // calls refresh whenever the screen is in focus -KK
  useFocusEffect(
    useCallback(() => {
      refresh(); 
    }, [])
  );

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
    refresh();
  };

  // fetch the task list for display -KK
  const refresh = () => {
    axios.get(API_URL + "chores")
      .then((response) => setData(response.data))
      .catch((error) => console.error(error));
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
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}  // Ensure each item has a unique id
          renderItem={({ item }) => (
          <Text style={styles.subtitle}>- {item.chore_name}</Text>
        )}
        />
        </Text>
      </View>

      

    </View>
  );
};

export default HomeScreen;