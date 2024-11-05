// NewProfilePicture.js

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../style/ThemeProvider.js';
import createStyles from '../style/styles.js';
import { ScreenHeader } from '../components/headers.js';

import axios from 'axios';
import { API_URL } from '../config.js';

const duck = require('../icons/duck.jpg');
const pinkAvatar = require('../icons/pinkAvatar.jpg');
const blueAvatar = require('../icons/blueAvatar.jpg');
const purpleAvatar = require('../icons/purpleAvatar.jpg');
const greenAvatar = require('../icons/greenAvatar.jpg');
const yellowAvatar = require('../icons/yellowAvatar.jpg');


// navigation goes to home screen
const ChangeProfilePicScreen = ({ navigation }) => {
  const { theme, changeTheme } = useTheme();
  const styles = createStyles(theme);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const getUsername = async () => {   // get the username from securestore -KK
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        console.error("UI NewProfilePicture.js: Username not found in SecureStore.");
      }
    };
    getUsername();
  }, []);

  // updates the database with the new pfp -VA
  const changePFP = async (username, profile_pic) => {
    console.log("UI NewProfilePicture.js: Updating profile picture to:", profile_pic);
    try {
        await axios.post(`${API_URL}update_profile`, {username, profile_pic});
    } catch (error) {
      console.log("UI NewProfilePicture.js: Error changing profile picture.");
    }
    navigation.goBack();
  }

  return (
    <View style={styles.pfpContainer}>
      <ScreenHeader title="Set a Profile Picture" navigation={navigation} />
      {/* <Text style={styles.title}>Choose a Profile Picture</Text> */}
      <View style={styles.pfpIconContainer}>
        {/* Add more icons as options for profile pictures */}
        <TouchableOpacity onPress={() => changePFP(username, 'pinkAvatar')} style={styles.setProfileIcon}>
          {/* <Ionicons name="person-circle" size={64} color="blue" /> */}
          {/* <Image source={PINK}  /> */}
          <Image source={pinkAvatar} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'blueAvatar')} style={styles.setProfileIcon}>
          <Image source={blueAvatar} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'purpleAvatar')} style={styles.setProfileIcon}>
          <Image source={purpleAvatar} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'greenAvatar')} style={styles.setProfileIcon}>
          <Image source={greenAvatar} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'yellowAvatar')} style={styles.setProfileIcon}>
          <Image source={yellowAvatar} style={styles.pfpImage} />
        </TouchableOpacity> 

        <TouchableOpacity onPress={() => changePFP(username, 'duck')} style={styles.setProfileIcon}>
          {/* <Ionicons name="person-circle" size={64} color="blue" /> */}
          {/* <Image source={PINK}  /> */}
          <Image source={duck} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.setProfileIcon}>
          {/* <Ionicons name="person-circle" size={64} color="blue" /> */}
          {/* <Image source={PINK}  /> */}
          <Image source={blueAvatar} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.setProfileIcon}>
          {/* <Ionicons name="person-circle" size={64} color="blue" /> */}
          {/* <Image source={PINK}  /> */}
          <Image source={purpleAvatar} style={styles.pfpImage} />
        </TouchableOpacity>
        

        {/* Add more icons if needed */}
      </View>
    </View>
  );
}

export default ChangeProfilePicScreen;

