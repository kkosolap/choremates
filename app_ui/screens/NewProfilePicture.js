// NewProfilePicture.js

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { useTheme } from '../contexts/ThemeProvider.js';
import createStyles from '../style/styles.js';
import { ScreenHeader } from '../components/headers.js';

import axios from 'axios';
import { API_URL } from '../config.js';

// Import icons to display options -VA
const pinkAvatar = require('../icons/pinkAvatar.jpg');
const pinkCat = require('../icons/cat_pink.jpg');
const pinkSheep = require('../icons/sheep_pink.jpg');
const pinkBear = require('../icons/bear_pink.jpg');

const yellowAvatar = require('../icons/yellowAvatar.jpg');
const yellowMouse = require('../icons/mouse_yellow.jpg');
const yellowFrog = require('../icons/frog_yellow.jpg');
const yellowTurtle = require('../icons/turtle_yellow.jpg');

const greenAvatar = require('../icons/greenAvatar.jpg');
const greenDog = require('../icons/dog_green.jpg');
const greenDuck = require('../icons/duck_green.jpg');
const greenRabbit = require('../icons/rabbit_green.jpg');

const blueAvatar = require('../icons/blueAvatar.jpg');
const blueSlug = require('../icons/slug_blue.jpg');
const bluePig = require('../icons/pig_blue.jpg');
const blueBee = require('../icons/bee_blue.jpg');

const purpleAvatar = require('../icons/purpleAvatar.jpg');
const purpleFox = require('../icons/fox_purple.jpg');
const purplePigeon = require('../icons/pigeon_purple.jpg');
const purpleDino = require('../icons/dino_purple.jpg');

const ChangeProfilePicScreen = ({ navigation }) => {
  const { theme } = useTheme();
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
    try {
        await axios.post(`${API_URL}update-profile`, {username, profile_pic});
    } catch (error) {
      console.log("UI NewProfilePicture.js: Error changing profile picture.");
    }
    navigation.goBack();
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Set a Profile Picture" navigation={navigation} />
      <View style={styles.pfpIconContainer}>
        {/* Add more icons as options for profile pictures */}
        <TouchableOpacity onPress={() => changePFP(username, 'pinkAvatar')} style={styles.setProfileIcon}>
          <Image source={pinkAvatar} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'pinkCat')} style={styles.setProfileIcon}>
          <Image source={pinkCat} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'pinkSheep')} style={styles.setProfileIcon}>
          <Image source={pinkSheep} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'pinkBear')} style={styles.setProfileIcon}>
          <Image source={pinkBear} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'yellowAvatar')} style={styles.setProfileIcon}>
          <Image source={yellowAvatar} style={styles.pfpImage} />
        </TouchableOpacity> 

        <TouchableOpacity onPress={() => changePFP(username, 'yellowTurtle')} style={styles.setProfileIcon}>
          <Image source={yellowTurtle} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'yellowMouse')} style={styles.setProfileIcon}>
          <Image source={yellowMouse} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'yellowFrog')} style={styles.setProfileIcon}>
          <Image source={yellowFrog} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'greenAvatar')} style={styles.setProfileIcon}>
          <Image source={greenAvatar} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'greenDuck')} style={styles.setProfileIcon}>
          <Image source={greenDuck} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'greenDog')} style={styles.setProfileIcon}>
          <Image source={greenDog} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'greenRabbit')} style={styles.setProfileIcon}>
          <Image source={greenRabbit} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'blueAvatar')} style={styles.setProfileIcon}>
          <Image source={blueAvatar} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'blueBee')} style={styles.setProfileIcon}>
          <Image source={blueBee} style={styles.pfpImage} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => changePFP(username, 'blueSlug')} style={styles.setProfileIcon}>
          <Image source={blueSlug} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'bluePig')} style={styles.setProfileIcon}>
          <Image source={bluePig} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'purpleAvatar')} style={styles.setProfileIcon}>
          <Image source={purpleAvatar} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'purpleFox')} style={styles.setProfileIcon}>
          <Image source={purpleFox} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'purplePigeon')} style={styles.setProfileIcon}>
          <Image source={purplePigeon} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'purpleDino')} style={styles.setProfileIcon}>
          <Image source={purpleDino} style={styles.pfpImage} />
        </TouchableOpacity>


        {/* duplicate as placeholder -VA */}

        {/* <TouchableOpacity onPress={() => changePFP(username, 'orangeTurtle')} style={styles.setProfileIcon}>
          <Image source={orangeTurtle} style={styles.pfpImage} />
        </TouchableOpacity> */}

        
      </View>
    </View>
  );
}

export default ChangeProfilePicScreen;