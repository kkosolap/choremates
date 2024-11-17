// NewProfilePicture.js

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';

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
const  pinkCat = require('../icons/cat_pink.jpg');
const  blueBee = require('../icons/bee_blue.jpg');
const  blueSlug = require('../icons/slug_blue.jpg');
const  bluePig = require('../icons/pig_blue.jpg');
const  purpleRabbit = require('../icons/rabbit_purple.jpg');
const  purpleMouse = require('../icons/mouse_purple.jpg');
const  purpleSheep = require('../icons/sheep_purple.jpg');
const  purpleFox = require('../icons/fox_purple.jpg');
const  greenDog = require('../icons/dog_green.jpg');
const  greenDuck = require('../icons/duck_green.jpg');
const  yellowFrog = require('../icons/frog_yellow.jpg');
const  orangeDino = require('../icons/dino_orange.jpg');
const  orangeTurtle = require('../icons/turtle_orange.jpg');

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
          <Image source={duck} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'pinkCat')} style={styles.setProfileIcon}>
          <Image source={pinkCat} style={styles.pfpImage} />
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

        <TouchableOpacity onPress={() => changePFP(username, 'purpleRabbit')} style={styles.setProfileIcon}>
          <Image source={purpleRabbit} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'purpleMouse')} style={styles.setProfileIcon}>
          <Image source={purpleMouse} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'purpleSheep')} style={styles.setProfileIcon}>
          <Image source={purpleSheep} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'purpleFox')} style={styles.setProfileIcon}>
          <Image source={purpleFox} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'greenDog')} style={styles.setProfileIcon}>
          <Image source={greenDog} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'greenDuck')} style={styles.setProfileIcon}>
          <Image source={greenDuck} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'yellowFrog')} style={styles.setProfileIcon}>
          <Image source={yellowFrog} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'orangeDino')} style={styles.setProfileIcon}>
          <Image source={orangeDino} style={styles.pfpImage} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changePFP(username, 'orangeTurtle')} style={styles.setProfileIcon}>
          <Image source={orangeTurtle} style={styles.pfpImage} />
        </TouchableOpacity>

        {/* duplicate as placeholder -VA */}

        <TouchableOpacity onPress={() => changePFP(username, 'orangeTurtle')} style={styles.setProfileIcon}>
          <Image source={orangeTurtle} style={styles.pfpImage} />
        </TouchableOpacity>

        
      </View>
    </View>
  );
}

export default ChangeProfilePicScreen;

