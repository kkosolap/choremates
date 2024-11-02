// ChoreDetails.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import { ScreenHeader } from '../components/headers.js';

import axios from 'axios';
import { API_URL } from '../config';


// header and page content
const ChoreDetailsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Chore Details" navigation={navigation} />
      <ChoreDetailsDisplay navigation={navigation} />
    </View>
  );
};

// page content
const ChoreDetailsDisplay = ({navigation}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const route = useRoute();
  const { choreName, tasks } = route.params;  // Get chore name from parameters
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const getUsername = async () => {   // get the username from securestore -KK
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        console.error("UI ChoreDetails.js: Username not found in SecureStore.");
      }
    };
    getUsername();
  }, []);

  // deletes the chore from the database -KK
  const deleteChore = async (chore_name) => {
    try {
      await axios.post(`${API_URL}delete_chore`, { chore_name, username });
      navigation.goBack();   

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.content}>

      {/* chore name (text entry) */}
      {/* room tag (drop down) */}
      {/* starting week (drop down) */}
      {/* recurrence (drop down) */}
      {/* assign to (drop down) */}
      {/* steps (text entry) */}

      {/* ***change so this is default text in an editable form*** */}
      <Text style={styles.subtitle}>{choreName}</Text>

      <View style={styles.spacer}></View>
      <View style={styles.horizontalLine}></View>
      <View style={styles.spacer}></View>

      {tasks.map(({ id, task }) => (
        <View key={id} style={styles.taskContainer}>
          <View style={styles.taskAndCheck}>

            {/* task text */}
            <Text style={styles.taskText}>{task}</Text>
          </View>

        </View>
      ))}


      {/* DELETE Button */}
      <View style={styles.centeredContent}>
        <TouchableOpacity
          style={styles.deleteChoreButton}
          onPress={() => deleteChore(choreName)}
          activeOpacity={0.8}
        >
          <Text style={styles.addChoreButtonText}>Delete Chore</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default ChoreDetailsScreen;