// NewProfilePicture.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, FlatList, Modal, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';


import { useTheme } from '../style/ThemeProvider.js';
import createStyles from '../style/styles.js';
import { ScreenHeader } from '../components/headers.js';

import axios from 'axios';
import { API_URL } from '../config.js';

const DUCK = require('../icons/profile_duck.jpg');
const PINK = require('../icons/pinkPFP.jpg');
const BLUE = require('../icons/bluePFP.jpg');
const PURPLE = require('../icons/purplePFP.jpg');
const GREEN = require('../icons/greenPFP.jpg');
const YELLOW = require('../icons/yellowPFP.jpg');


// navigation goes to home screen
const ChangeProfilePicScreen = ({ navigation }) => {
  const { theme, changeTheme } = useTheme();
  const styles = createStyles(theme);

  const [username, setUsername] = useState(null);
  const [profile_pic, setProfilePic] = useState('');



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

    const changePFP = async (profile_pic) => {
      console.log("UI NewProfilePicture.js: Updating profile picture to:", profile_pic);
      try {
          await axios.post(`${API_URL}update_profile`, {username, profile_pic});
          try { // load the new profile picture -KK
            console.log("Profile pic: "+profile_pic);
            setProfilePic(`..icons/'${profile_pic}.jpg`); // might not work
          } catch (error) {
            console.log("UI NewProfilePicture.js: Error loading new profile picture.");
          }
      } catch (error) {
        console.log("UI NewProfilePicture.js: Error changing profile picture.");
      }
  }

  return (

    
    <View style={styles.pfpContainer}>
      <ScreenHeader title="Set a Profile Picture" navigation={navigation} />

      {/* <Text style={styles.title}>Choose a Profile Picture</Text> */}
      <View style={styles.pfpIconContainer}>
        {/* Add more icons as options for profile pictures */}
        <TouchableOpacity onPress={() => changePFP(username, 'blue')} style={styles.setProfileIcon}>
          {/* <Ionicons name="person-circle" size={64} color="blue" /> */}
          {/* <Image source={PINK}  /> */}
          <Image source={PINK} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.setProfileIcon}>
          <Image source={BLUE} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.setProfileIcon}>
          <Image source={PURPLE} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.setProfileIcon}>
          <Image source={GREEN} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.setProfileIcon}>
          <Image source={YELLOW} style={styles.pfpImage} />
        </TouchableOpacity> 

        <TouchableOpacity style={styles.setProfileIcon}>
          {/* <Ionicons name="person-circle" size={64} color="blue" /> */}
          {/* <Image source={PINK}  /> */}
          <Image source={PINK} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.setProfileIcon}>
          {/* <Ionicons name="person-circle" size={64} color="blue" /> */}
          {/* <Image source={PINK}  /> */}
          <Image source={BLUE} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.setProfileIcon}>
          {/* <Ionicons name="person-circle" size={64} color="blue" /> */}
          {/* <Image source={PINK}  /> */}
          <Image source={PURPLE} style={styles.pfpImage} />
        </TouchableOpacity>
        

        {/* Add more icons if needed */}
      </View>
    </View>
  );
}

export default ChangeProfilePicScreen;

